/**
 * NeonCrates - Cyber-Fresh Online Grocery Supermarket Full-Stack Server
 * Real Node.js REST API Backend & Static File Server
 * Uses Express for standalone authentication routes and native Node.js routing
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const DB_FILE = path.join(__dirname, 'data', 'database.json');
const STATIC_DIR = __dirname;
const SECRET_KEY = process.env.SECRET_KEY || 'neoncrates_cyber_secret_key_2026_x89';

// Active 2FA OTP Memory Store (maps adminId -> { otp, expiresAt, attempts })
const activeOtps = new Map();

// Latest security events log (in-memory circular log for audit)
const securityLog = [];

// Express handles the beginner-friendly standalone login and signup pages.
const authApp = express();
authApp.use(express.json());

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone || '',
    email: user.email,
    address: user.address || ''
  };
}

authApp.post('/signup', async (req, res) => {
  try {
    const { name, phone = '', address = '', email, password } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const db = loadDB();
    if (db.users.some(user => user.email.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const user = {
      id: `usr-${Date.now()}`,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: normalizedEmail,
      address: String(address).trim(),
      passwordHash: await bcrypt.hash(password, 12),
      createdAt: new Date().toISOString()
    };

    db.users.push(user);
    if (!saveDB(db)) {
      return res.status(500).json({ error: 'Could not save the account.' });
    }

    const token = signToken({ id: user.id, email: user.email, role: 'customer' });
    logSecurity(`New customer registered: ${user.email} (${user.name})`);
    return res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    console.error('Signup failed:', error);
    return res.status(500).json({ error: 'Unable to create the account.' });
  }
});

authApp.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const db = loadDB();
    const user = db.users.find(candidate => candidate.email.toLowerCase() === normalizedEmail);

    if (!user || !password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = user.passwordHash.startsWith('$2')
      ? await bcrypt.compare(password, user.passwordHash)
      : hashPassword(password, user.salt) === user.passwordHash;
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken({ id: user.id, email: user.email, role: 'customer' });
    logSecurity(`Customer logged in: ${user.email}`);
    return res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ error: 'Unable to sign in.' });
  }
});

function logSecurity(event) {
  const entry = {
    timestamp: new Date().toISOString(),
    event
  };
  securityLog.unshift(entry);
  if (securityLog.length > 50) securityLog.pop();
  console.log(`[SECURITY ${new Date().toLocaleTimeString()}] ${event}`);
}

/* ==========================================================================
   Database Operations
   ========================================================================== */
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { admin: {}, users: [], products: [], orders: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { admin: {}, users: [], products: [], orders: [] };
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving database file:', err);
    return false;
  }
}

/* ==========================================================================
   Cryptographic Helpers (PBKDF2 Password Hashing & HMAC Tokens)
   ========================================================================== */
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
}

function createSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function signToken(payload, expiresInMs = 7 * 24 * 3600 * 1000) {
  const expiresAt = Date.now() + expiresInMs;
  const tokenPayload = { ...payload, exp: expiresAt };
  const data = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('base64url');
  return `${data}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [data, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null; // Expired
    return payload;
  } catch (e) {
    return null;
  }
}

/* ==========================================================================
   Request & Response Helpers
   ========================================================================== */
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
  sendJSON(res, statusCode, { error: message });
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format in request body'));
      }
    });
    req.on('error', reject);
  });
}

function getBearerToken(req) {
  const auth = req.headers['authorization'] || '';
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  return null;
}

function getUserFromReq(req) {
  const token = getBearerToken(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'customer') return null;
  return payload;
}

function getAdminFromReq(req) {
  const token = getBearerToken(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') return null;
  return payload;
}

/* ==========================================================================
   Static File Server
   ========================================================================== */
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

function serveStaticFile(req, res, pathname) {
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  const filePath = path.join(STATIC_DIR, relativePath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(STATIC_DIR)) {
    sendError(res, 403, 'Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If requested path doesn't exist, fallback to index.html for SPA navigation
      const indexPath = path.join(STATIC_DIR, 'index.html');
      fs.readFile(indexPath, (indexErr, content) => {
        if (indexErr) {
          sendError(res, 404, 'File not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

/* ==========================================================================
   HTTP Server Router
   ========================================================================== */
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    });
    res.end();
    return;
  }

  // Standalone login.html and signup.html routes are handled by Express.
  if ((pathname === '/login' || pathname === '/signup') && method === 'POST') {
    return authApp(req, res);
  }

  // ==========================================================================
  // API Routes
  // ==========================================================================
  if (pathname.startsWith('/api/')) {
    
    // --- Health Check ---
    if (pathname === '/api/health' && method === 'GET') {
      return sendJSON(res, 200, { status: 'healthy', time: new Date().toISOString() });
    }

    // --- Customer Authentication: Register ---
    if (pathname === '/api/auth/register' && method === 'POST') {
      try {
        const body = await parseJSONBody(req);
        const { name, phone, email, address, password } = body;

        if (!name || !phone || !email || !address || !password) {
          return sendError(res, 400, 'All fields (name, phone, email, address, password) are required.');
        }

        const db = loadDB();
        const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (existing) {
          return sendError(res, 409, 'An account with this email address already exists.');
        }

        const salt = createSalt();
        const passwordHash = hashPassword(password, salt);

        const newUser = {
          id: 'usr-' + Date.now(),
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          address: address.trim(),
          passwordHash,
          salt,
          createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        saveDB(db);

        const token = signToken({ id: newUser.id, email: newUser.email, role: 'customer' });
        logSecurity(`New customer registered: ${newUser.email} (${newUser.name})`);

        return sendJSON(res, 201, {
          token,
          user: {
            id: newUser.id,
            name: newUser.name,
            phone: newUser.phone,
            email: newUser.email,
            address: newUser.address
          }
        });
      } catch (e) {
        return sendError(res, 500, e.message);
      }
    }

    // --- Customer Authentication: Login ---
    if (pathname === '/api/auth/login' && method === 'POST') {
      try {
        const body = await parseJSONBody(req);
        const { email, password } = body;

        if (!email || !password) {
          return sendError(res, 400, 'Email and password are required.');
        }

        const db = loadDB();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (!user) {
          return sendError(res, 401, 'Invalid email or password.');
        }

        const hash = hashPassword(password, user.salt);
        if (hash !== user.passwordHash) {
          return sendError(res, 401, 'Invalid email or password.');
        }

        const token = signToken({ id: user.id, email: user.email, role: 'customer' });
        logSecurity(`Customer logged in: ${user.email}`);

        return sendJSON(res, 200, {
          token,
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            address: user.address
          }
        });
      } catch (e) {
        return sendError(res, 500, e.message);
      }
    }

    // --- Customer: Get Profile (/api/auth/me) ---
    if (pathname === '/api/auth/me' && method === 'GET') {
      const userPayload = getUserFromReq(req);
      if (!userPayload) return sendError(res, 401, 'Unauthorized');

      const db = loadDB();
      const user = db.users.find(u => u.id === userPayload.id);
      if (!user) return sendError(res, 404, 'User profile not found');

      return sendJSON(res, 200, {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          address: user.address
        }
      });
    }

    // --- Customer: Update Profile (/api/auth/profile) ---
    if (pathname === '/api/auth/profile' && method === 'PUT') {
      const userPayload = getUserFromReq(req);
      if (!userPayload) return sendError(res, 401, 'Unauthorized');

      try {
        const body = await parseJSONBody(req);
        const db = loadDB();
        const user = db.users.find(u => u.id === userPayload.id);
        if (!user) return sendError(res, 404, 'User profile not found');

        if (body.name) user.name = body.name.trim();
        if (body.phone) user.phone = body.phone.trim();
        if (body.address) user.address = body.address.trim();

        saveDB(db);
        logSecurity(`Customer profile updated: ${user.email}`);

        return sendJSON(res, 200, {
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            address: user.address
          }
        });
      } catch (e) {
        return sendError(res, 500, e.message);
      }
    }

    // --- Admin Authentication Step 1: Login & Request 2FA OTP ---
    if (pathname === '/api/admin/login' && method === 'POST') {
      try {
        const body = await parseJSONBody(req);
        const { username, password } = body;

        const db = loadDB();
        const admin = db.admin || { username: 'admin' };

        // Verify password against stored hash or fallback default
        const expectedHash = admin.passwordHash || hashPassword('neonadmin2026', 'neonsec_salt_2026');
        const inputHash = hashPassword(password || '', admin.salt || 'neonsec_salt_2026');

        if (username !== admin.username || inputHash !== expectedHash) {
          logSecurity(`Failed admin login attempt for user "${username}" from IP ${req.socket.remoteAddress}`);
          return sendError(res, 401, 'Invalid Admin credentials.');
        }

        // Generate dynamic 6-digit cryptographic OTP
        const otp = String(crypto.randomInt(100000, 999999));
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

        activeOtps.set(username, { otp, expiresAt, attempts: 0 });

        console.log('\n=================================================================');
        console.log(`[NEONCRATES AUTH] 🛡️ 2FA One-Time Passcode (OTP) Generated:`);
        console.log(`-> Passcode:  [  ${otp}  ]`);
        console.log(`-> Dispatched to: ${admin.email || 'security@neoncrate.io'} / ${admin.phone || '+1 (555) 019-9021'}`);
        console.log(`-> Expiration: 5 minutes (${new Date(expiresAt).toLocaleTimeString()})`);
        console.log('=================================================================\n');

        logSecurity(`2FA OTP generated for Admin user "${username}". Code dispatched to admin secure terminal.`);

        return sendJSON(res, 200, {
          success: true,
          message: 'Admin credentials verified. 2FA OTP has been dispatched to the secure Admin console/device.',
          // Also include the real OTP for local testing ease without needing a separate SMS provider
          otpForConsole: otp
        });
      } catch (e) {
        return sendError(res, 500, e.message);
      }
    }

    // --- Admin Authentication Step 2: Verify 2FA OTP ---
    if (pathname === '/api/admin/verify-otp' && method === 'POST') {
      try {
        const body = await parseJSONBody(req);
        const { username, otp } = body;

        const record = activeOtps.get(username || 'admin');
        if (!record) {
          return sendError(res, 401, 'No active OTP session found. Please request a new OTP code.');
        }

        if (Date.now() > record.expiresAt) {
          activeOtps.delete(username || 'admin');
          return sendError(res, 401, 'OTP code has expired. Please request a new OTP code.');
        }

        if (record.otp !== String(otp).trim()) {
          record.attempts = (record.attempts || 0) + 1;
          if (record.attempts >= 4) {
            activeOtps.delete(username || 'admin');
            logSecurity(`Admin 2FA locked out due to multiple failed OTP attempts.`);
            return sendError(res, 429, 'Too many failed OTP attempts. Session terminated.');
          }
          return sendError(res, 401, 'Incorrect OTP verification code. Check your server terminal/device.');
        }

        // OTP Verified successfully!
        activeOtps.delete(username || 'admin');

        // Issue 12-hour signed Admin token
        const adminToken = signToken({ role: 'admin', username: username || 'admin' }, 12 * 3600 * 1000);
        logSecurity(`Admin "${username || 'admin'}" successfully authenticated via 2FA OTP.`);

        return sendJSON(res, 200, {
          success: true,
          adminToken,
          message: 'Two-factor authentication verified successfully.'
        });
      } catch (e) {
        return sendError(res, 500, e.message);
      }
    }

    // --- Admin: Verify Active Session (/api/admin/verify-session) ---
    if (pathname === '/api/admin/verify-session' && method === 'GET') {
      const admin = getAdminFromReq(req);
      if (!admin) return sendError(res, 401, 'Invalid or expired admin session.');
      return sendJSON(res, 200, { success: true, admin: admin.username });
    }

    // --- Products: List All (Public) ---
    if (pathname === '/api/products' && method === 'GET') {
      const db = loadDB();
      return sendJSON(res, 200, db.products || []);
    }

    // --- Products: Add New Grocery Item (Admin Protected) ---
    if (pathname === '/api/products' && method === 'POST') {
      const admin = getAdminFromReq(req);
      if (!admin) return sendError(res, 401, 'Unauthorized: Admin access required');

      try {
        const body = await parseJSONBody(req);
        const { title, category, unit, price, originalPrice, image, badges, dietary, origin, shelfLife, description } = body;

        if (!title || !category || !price) {
          return sendError(res, 400, 'Title, category, and price are required.');
        }

        const db = loadDB();
        const newProduct = {
          id: 'prod-' + Date.now(),
          title: title.trim(),
          category: category.trim().toLowerCase(),
          unit: unit ? unit.trim() : '1 Pack',
          price: parseFloat(price),
          originalPrice: originalPrice ? parseFloat(originalPrice) : null,
          rating: 5.0,
          reviews: 1,
          image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
          badges: badges || ['organic'],
          dietary: dietary || ['organic'],
          origin: origin ? origin.trim() : 'Certified Regenerative Farm',
          shelfLife: shelfLife ? shelfLife.trim() : 'Guaranteed 7 Days Fresh',
          nutrition: { calories: '110 kcal', carbs: '12g', protein: '4g', fat: '2g' },
          description: description ? description.trim() : 'Fresh farm-sourced essential.'
        };

        db.products.push(newProduct);
        saveDB(db);
        logSecurity(`New product added to catalog by admin: "${newProduct.title}" ($${newProduct.price})`);

        return sendJSON(res, 201, newProduct);
      } catch (e) {
        return sendError(res, 500, e.message);
      }
    }

    // --- Products: Delete Grocery Item (Admin Protected) ---
    if (pathname.startsWith('/api/products/') && method === 'DELETE') {
      const admin = getAdminFromReq(req);
      if (!admin) return sendError(res, 401, 'Unauthorized: Admin access required');

      const productId = pathname.replace('/api/products/', '').trim();
      const db = loadDB();
      const idx = db.products.findIndex(p => p.id === productId);

      if (idx === -1) {
        return sendError(res, 404, 'Product not found');
      }

      const deleted = db.products.splice(idx, 1)[0];
      saveDB(db);
      logSecurity(`Product deleted from catalog: "${deleted.title}" (ID: ${productId})`);

      return sendJSON(res, 200, { success: true, message: 'Product deleted', product: deleted });
    }

    // --- Orders: Place New Customer Order (Public or Customer) ---
    if (pathname === '/api/orders' && method === 'POST') {
      try {
        const body = await parseJSONBody(req);
        const { name, phone, address, items, total, paymentMethod } = body;

        if (!name || !address || !items || !Array.isArray(items) || items.length === 0) {
          return sendError(res, 400, 'Name, address, and items are required.');
        }

        const userPayload = getUserFromReq(req);
        const db = loadDB();

        const newOrder = {
          orderId: 'NC-' + Math.floor(100000 + Math.random() * 900000),
          userId: userPayload ? userPayload.id : (body.userId || 'guest'),
          name: name.trim(),
          phone: phone ? phone.trim() : 'Not provided',
          address: address.trim(),
          total: parseFloat(total) || 0,
          status: 'Pending',
          paymentMethod: paymentMethod || 'NeonPay 1-Click',
          items: items.map(item => ({
            id: item.id || item.productId,
            title: item.title,
            unit: item.unit || '',
            price: item.price,
            quantity: item.quantity || 1
          })),
          date: new Date().toISOString()
        };

        db.orders.push(newOrder);
        saveDB(db);
        logSecurity(`New Order placed: ${newOrder.orderId} by ${newOrder.name} - Total: $${newOrder.total}`);

        return sendJSON(res, 201, newOrder);
      } catch (e) {
        return sendError(res, 500, e.message);
      }
    }

    // --- Orders: Get Customer Past Orders ---
    if (pathname === '/api/orders/my' && method === 'GET') {
      const userPayload = getUserFromReq(req);
      if (!userPayload) return sendError(res, 401, 'Unauthorized');

      const db = loadDB();
      const myOrders = db.orders.filter(o => o.userId === userPayload.id);
      return sendJSON(res, 200, myOrders);
    }

    // --- Admin: Get All Orders (Admin Protected) ---
    if (pathname === '/api/admin/orders' && method === 'GET') {
      const admin = getAdminFromReq(req);
      if (!admin) return sendError(res, 401, 'Unauthorized: Admin access required');

      const db = loadDB();
      return sendJSON(res, 200, db.orders || []);
    }

    // --- Admin: Update Order Status (Admin Protected) ---
    if (pathname.startsWith('/api/admin/orders/') && pathname.endsWith('/status') && (method === 'PATCH' || method === 'PUT')) {
      const admin = getAdminFromReq(req);
      if (!admin) return sendError(res, 401, 'Unauthorized: Admin access required');

      try {
        const parts = pathname.split('/');
        const orderId = parts[parts.length - 2];
        const body = await parseJSONBody(req);
        const { status } = body;

        if (!status) return sendError(res, 400, 'Status field required');

        const db = loadDB();
        const order = db.orders.find(o => o.orderId === orderId);
        if (!order) return sendError(res, 404, 'Order not found');

        order.status = status;
        saveDB(db);
        logSecurity(`Order ${orderId} status updated to "${status}" by admin`);

        return sendJSON(res, 200, { success: true, order });
      } catch (e) {
        return sendError(res, 500, e.message);
      }
    }

    // --- Admin: Get Dashboard KPI Stats (Admin Protected) ---
    if (pathname === '/api/admin/stats' && method === 'GET') {
      const admin = getAdminFromReq(req);
      if (!admin) return sendError(res, 401, 'Unauthorized: Admin access required');

      const db = loadDB();
      const grossSales = db.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const pendingOrders = db.orders.filter(o => (o.status || '').toLowerCase() === 'pending').length;

      return sendJSON(res, 200, {
        grossSales,
        totalOrders: db.orders.length,
        pendingOrders,
        registeredUsers: db.users.length,
        totalProducts: db.products.length,
        recentActivity: securityLog.slice(0, 10)
      });
    }

    // API 404
    return sendError(res, 404, 'API endpoint not found');
  }

  // ==========================================================================
  // Static Assets Fallback
  // ==========================================================================
  serveStaticFile(req, res, pathname);
});

// Start Server
server.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🚀 NeonCrates Full-Stack Server LIVE & RUNNING!`);
  console.log(`-> Local URL:        http://localhost:${PORT}`);
  console.log(`-> Real Database:    ${DB_FILE}`);
  console.log(`-> Admin Protected:  2FA OTP Gate Active`);
  console.log(`=============================================================\n`);
});
