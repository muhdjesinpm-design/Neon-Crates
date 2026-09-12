# 📦 NeonCrates - Cyber-Fresh Online Grocery Supermarket & Protected Admin Portal

Welcome to **NeonCrates**, an ultra-modern, interactive online grocery shopping platform with **User Account Management** and a **Protected 2-Factor Admin Control Center** to list products and receive live orders.

---

## 🚀 Quick Start & How to Run

### Authentication Backend (Node.js + JSON database)

Install the server dependencies once from the project folder:

```bash
npm install
node server.js
```

Then open `http://localhost:3000/login.html` or
`http://localhost:3000/signup.html`. Registered accounts are persisted in
[`data/database.json`](./data/database.json); no cloud database is required.

The forms send JSON with `fetch()` to `POST /login` or `POST /signup`. The
Express authentication routes validate the request, hash new passwords with
`bcryptjs`, and save the user record. On success the returned token and
basic user profile are saved in `localStorage`, then the browser redirects to
`index.html`. Existing users created by the original store auth flow remain
compatible.

### Method 1: Double-Click (Zero Setup!)
Simply double-click [`index.html`](file:///c:/Users/VICTUS/OneDrive/Desktop/My%20projects/del1/index.html) in your file explorer to open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Method 2: Local Web Server (Recommended)
Using Python (pre-installed):
```bash
python -m http.server 8080
```
Or using Node.js:
```bash
npx serve .
```
Then visit: `http://localhost:8080` in your web browser.

---

## 🛡️ Protected Admin Portal (2-Factor Authentication)

The Admin Control Center is protected by a two-step authentication gate:

### Step 1: Admin ID & Password Authentication
Click the **`🛡️ Admin`** button in the top navigation bar. An authentication modal appears requesting:
- **Admin ID**: `admin`
- **Admin Password**: `neonadmin2026`

### Step 2: 6-Digit One-Time Passcode (OTP) Verification
Upon entering valid credentials, the system automatically generates a dynamic 6-digit verification code:
- Enter the 6-digit OTP in the verification field.
- For ease of testing, the generated OTP is also conveniently displayed on-screen and announced via a toast notification.
- Click **Verify OTP & Unlock Dashboard 🚀** to access the Admin Control Center.
- Supports **Resend OTP** and returning to the credentials screen.

### Step 3: Session Security & Portal Lock
- Once verified, the dashboard unlocks for the current session.
- Click the **🔒 Lock** button in the Admin header to immediately terminate the session and re-lock the portal.

---

## 📊 Admin Features ("List Items & Receive Orders")

Once unlocked, the Admin Control Center gives you complete control:

### 1. 📊 Overview & Real-Time KPIs
- **Gross Store Sales**: Total dollar revenue across all customer orders.
- **Total Orders**: Count of all incoming customer orders.
- **Registered Customers**: Total customer accounts.
- **Live Active Products**: Total grocery items in catalog.
- **Recent Activity Feed**: Real-time order events log.

### 2. 📦 Incoming Orders Management ("Receive Orders")
- Real-time customer order stream with Order ID, Timestamp, Customer Name, Mobile Number, Delivery Address, Ordered Items, and Total Bill.
- **Order Status Manager**: Change order status on the fly:
  - `Pending ⏳`
  - `Dispatched 🛸`
  - `Delivered ✅`
  - `Cancelled ❌`
- Status changes immediately sync with the customer's personal order history.

### 3. 🛒 Grocery Inventory ("List & Add Items")
- Searchable table listing all current store products with image thumbnail, category, weight/unit, selling price, and stock status.
- **Add New Grocery Item**:
  - Click **➕ Add New Grocery Item** button in the inventory tab.
  - Enter Product Title, Category, Unit, Selling Price, Original Price, Image URL, Dietary Tags (Organic, Vegan, Gluten-Free, High Protein), Farm Origin, Shelf Life, and Description.
  - Submitting instantly publishes the product to the live customer aisles, search filter, and custom crate builder!
- **Delete / Remove Item**:
  - Remove any grocery item from the store catalog with 1-click.

---

## 👤 User Account System

- **Sign Up / Account Creation**:
  - Register with **Full Name**, **Mobile Phone Number**, **Email Address**, **Default Delivery Address & Apt / Unit**, and **Password**.
- **Persistent Data**:
  - Saved in `localStorage` under `neon_crates_users` and `neon_crates_current_user`.
- **Pre-filled Express Checkout**:
  - Logged-in customer details automatically populate the checkout form.
- **Customer Profile & Past Orders**:
  - Click your avatar in the header -> select **My Profile** or **My Orders**.
  - Update your contact info or review previous orders, tracking IDs, and statuses.

---

## 🔑 Quick Credentials & Testing Shortcuts

- **Admin Login**:
  - **Admin ID**: `admin`
  - **Admin Password**: `neonadmin2026`
  - **2FA OTP**: Automatically generated and displayed on screen upon entering credentials.
- **Customer Account (Pre-seeded)**:
  - **Email**: `alex@neoncrate.io`
  - **Password**: `password123`
- **Promo Codes**:
  - `NEON20`: 20% OFF entire crate
  - `FRESH10`: $10.00 OFF
  - `CRATE5`: $5.00 Welcome discount
