/**
 * NeonCrates - Cyber-Fresh Online Grocery Supermarket Full-Stack Server
 * Real Node.js REST API Backend & Static File Server
 * Uses Express for authentication, API routing, and static files
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');
const DEFAULT_DB = { admin: {}, users: [], products: [], orders: [] };
const STATIC_DIR = __dirname;
const SECRET_KEY = process.env.SECRET_KEY || 'neoncrates_cyber_secret_key_2026_x89';
const GOOGLE_CALLBACK_URL = 'https://neoncrates-backend.onrender.com/api/auth/google/callback';
const FRONTEND_URL = 'https://muhdjesinpm-design.github.io/Neon-Crates/';

// Latest security events log (in-memory circular log for audit)
const securityLog = [];

// Express handles the beginner-friendly standalone login and signup pages.
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: '10mb' }));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = loadDB().users.find(candidate => candidate.id === id);
  done(null, user || false);
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
  }, (accessToken, refreshToken, profile, done) => {
    try {
      const db = loadDB();
      const email = profile.emails?.[0]?.value?.trim().toLowerCase() || '';
      let user = db.users.find(candidate =>
        candidate.googleId === profile.id || (email && candidate.email === email)
      );

      if (!user) {
        user = {
          id: `usr-${Date.now()}`,
          name: profile.displayName || 'NeonCrates Customer',
          phone: '',
          email,
          address: '',
          passwordHash: '',
          googleId: profile.id,
          createdAt: new Date().toISOString()
        };
        db.users.push(user);
      } else if (!user.googleId) {
        user.googleId = profile.id;
      }

      if (!saveDB(db)) return done(new Error('Could not save the Google account.'));
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}

app.get('/api/auth/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ error: 'Google authentication is not configured.' });
  }
  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get(
  '/api/auth/google/callback',
  (req, res, next) => passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}login.html?error=google_auth_failed`
  })(req, res, next),
  (req, res) => {
    const user = req.user;
    const userDetails = { id: user.id, name: user.name, email: user.email };
    res.redirect(`${FRONTEND_URL}?user=${encodeURIComponent(JSON.stringify(userDetails))}`);
  }
);
function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone || '',
    email: user.email,
    address: user.address || ''
  };
}

app.post('/signup', async (req, res) => {
  try {
    const { name, phone = '', address = '', email, password } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!name || !normalizedEmail || typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const db = loadDB();
    if (db.users.some(user => typeof user.email === 'string' && user.email.toLowerCase() === normalizedEmail)) {
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

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = loadDB();
    const user = db.users.find(candidate => candidate.email.toLowerCase() === normalizedEmail);

    if (!user || typeof user.passwordHash !== 'string') {
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
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      return { ...DEFAULT_DB, users: [], products: [], orders: [] };
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { ...DEFAULT_DB, users: [], products: [], orders: [] };
  }
}

function saveDB(data) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
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
  const safePassword = typeof password === 'string' ? password : '';
  const safeSalt = typeof salt === 'string' && salt.length > 0
    ? salt
    : crypto.randomBytes(16).toString('hex');
  return crypto.pbkdf2Sync(safePassword, safeSalt, 1000, 32, 'sha256').toString('hex');
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
  return res.status(statusCode).json(data);
}

function sendError(res, statusCode, message) {
  return sendJSON(res, statusCode, { error: message });
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

function verifyAdmin(req, res, next) {
  const userRole = req.headers['x-user-role'];
  if (userRole === 'admin') {
    req.adminAuthorized = true;
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admins only.' });
  }
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
app.use(express.static(STATIC_DIR));

app.use('/api', (req, res, next) => {
  const isProductManagement = req.path === '/products' && ['POST', 'PUT'].includes(req.method)
    || req.path.startsWith('/products/') && req.method === 'DELETE';
  const isOrderManagement = req.path === '/admin/orders' && req.method === 'GET'
    || req.path.startsWith('/admin/orders/') && ['PATCH', 'PUT'].includes(req.method)
    || req.path === '/admin/stats' && req.method === 'GET';

  if (isProductManagement || isOrderManagement) {
    return verifyAdmin(req, res, next);
  }
  return next();
});

app.get('/api/health', (req, res) => {
  return sendJSON(res, 200, { status: 'healthy', time: new Date().toISOString() });
});

app.use(async (req, res, next) => {
  const pathname = req.path;
  const method = req.method.toUpperCase();

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.status(204).end();
    return;
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
        const body = req.body || {};
        const { name, phone, email, address, password } = body;

        if (typeof name !== 'string' || typeof phone !== 'string' || typeof email !== 'string' ||
            typeof address !== 'string' || typeof password !== 'string' ||
            !name.trim() || !phone.trim() || !email.trim() || !address.trim() || !password) {
          return sendError(res, 400, 'All fields (name, phone, email, address, password) are required.');
        }

        const db = loadDB();
        const existing = db.users.find(u => typeof u.email === 'string' && u.email.toLowerCase() === email.toLowerCase().trim());
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
        const body = req.body || {};
        const { email, password } = body;

        if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
          return sendError(res, 400, 'Email and password are required.');
        }

        const db = loadDB();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (!user || typeof user.passwordHash !== 'string') {
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
        const body = req.body || {};
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

    // --- Products: List All (Public) ---
    if (pathname === '/api/products' && method === 'GET') {
      const db = loadDB();
      return sendJSON(res, 200, db.products || []);
    }

    // --- Products: Add New Grocery Item (Admin Protected) ---
    if (pathname === '/api/products' && method === 'POST') {
      const admin = getAdminFromReq(req);
      if (!admin && !req.adminAuthorized) return sendError(res, 401, 'Unauthorized: Admin access required');

      try {
        const body = req.body || {};
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

    // --- Products: Update Grocery Item (Admin Protected) ---
    if (pathname.startsWith('/api/products/') && method === 'PUT') {
      const admin = getAdminFromReq(req);
      if (!admin && !req.adminAuthorized) return sendError(res, 401, 'Unauthorized: Admin access required');

      try {
        const productId = pathname.replace('/api/products/', '').trim();
        const body = req.body || {};
        const db = loadDB();
        const product = db.products.find(item => item.id === productId);
        if (!product) return sendError(res, 404, 'Product not found');

        if (typeof body.title === 'string' && body.title.trim()) product.title = body.title.trim();
        if (typeof body.category === 'string' && body.category.trim()) product.category = body.category.trim().toLowerCase();
        if (body.unit !== undefined) product.unit = String(body.unit).trim();
        if (body.price !== undefined) product.price = parseFloat(body.price);
        if (body.originalPrice !== undefined) product.originalPrice = body.originalPrice === '' ? null : parseFloat(body.originalPrice);
        if (body.image !== undefined) product.image = body.image;
        if (body.description !== undefined) product.description = String(body.description).trim();

        saveDB(db);
        logSecurity(`Product updated in catalog: "${product.title}" (ID: ${productId})`);
        return sendJSON(res, 200, product);
      } catch (e) {
        return sendError(res, 500, e.message);
      }
    }

    // --- Products: Delete Grocery Item (Admin Protected) ---
    if (pathname.startsWith('/api/products/') && method === 'DELETE') {
      const admin = getAdminFromReq(req);
      if (!admin && !req.adminAuthorized) return sendError(res, 401, 'Unauthorized: Admin access required');

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
        const body = req.body || {};
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
      if (!admin && !req.adminAuthorized) return sendError(res, 401, 'Unauthorized: Admin access required');

      const db = loadDB();
      return sendJSON(res, 200, db.orders || []);
    }

    // --- Admin: Update Order Status (Admin Protected) ---
    if (pathname.startsWith('/api/admin/orders/') && pathname.endsWith('/status') && (method === 'PATCH' || method === 'PUT')) {
      const admin = getAdminFromReq(req);
      if (!admin && !req.adminAuthorized) return sendError(res, 401, 'Unauthorized: Admin access required');

      try {
        const parts = pathname.split('/');
        const orderId = parts[parts.length - 2];
        const body = req.body || {};
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
      if (!admin && !req.adminAuthorized) return sendError(res, 401, 'Unauthorized: Admin access required');

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
  // Static files are handled by the Express middleware above.
  return next();
});

app.get('*', (req, res) => res.sendFile(path.join(STATIC_DIR, 'index.html')));

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});