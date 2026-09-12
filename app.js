const API_BASE_URL = 'https://neoncrates-backend.onrender.com';

/**
 * NeonCrates - Cyber-Fresh Online Grocery Supermarket Engine
 * Vanilla JavaScript Single Page Application with User Accounts & Admin Portal
 */

(function () {
  'use strict';

  /* ==========================================================================
     Base Grocery Product Catalog Data
     ========================================================================== */
  const BASE_PRODUCTS = [
    // Curated Signature Crates
    {
      id: 'crate-harvest',
      title: 'Neon Harvest Organic Crate',
      category: 'crates',
      unit: '8-10 Essential Farm Items',
      price: 38.99,
      originalPrice: 46.99,
      rating: 4.9,
      reviews: 184,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      badges: ['crate', 'organic'],
      dietary: ['organic', 'vegan'],
      origin: 'Salinas Valley Certified Organic Co-op',
      shelfLife: 'Guaranteed 7-10 Days Fresh',
      nutrition: { calories: '320 kcal', carbs: '45g', protein: '14g', fat: '6g' },
      description: 'Handpicked seasonal organic greens, heirloom tomatoes, crunchy carrots, avocado, and wild honey in an insulated thermal crate.'
    },
    {
      id: 'crate-protein',
      title: 'Cyber-Protein Power Crate',
      category: 'crates',
      unit: 'High Protein Bundle (4.5kg)',
      price: 54.99,
      originalPrice: 65.00,
      rating: 5.0,
      reviews: 96,
      image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80',
      badges: ['crate', 'sale'],
      dietary: ['high-protein', 'gluten-free'],
      origin: 'Grass-fed Pastures & Wild Pacific Fisheries',
      shelfLife: 'Fresh chilled (Keep below 4°C)',
      nutrition: { calories: '640 kcal', carbs: '8g', protein: '68g', fat: '22g' },
      description: 'Prime cuts of grass-fed ribeye, free-range chicken breast fillets, Norwegian Atlantic salmon, and pasture-raised brown eggs.'
    },
    {
      id: 'crate-breakfast',
      title: 'Sunrise Artisan Bakery & Dairy Crate',
      category: 'crates',
      unit: 'Morning Comfort Box (6 Items)',
      price: 29.50,
      originalPrice: 34.00,
      rating: 4.8,
      reviews: 142,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      badges: ['crate'],
      dietary: ['organic'],
      origin: 'Neon Hearth Bakers & Jersey Valley Creamery',
      shelfLife: 'Baked fresh daily at 5:00 AM',
      nutrition: { calories: '420 kcal', carbs: '58g', protein: '12g', fat: '14g' },
      description: 'Warm sourdough boule, French flaky butter croissants, European cultured butter, artisan berry jam, and glass-bottled Jersey whole milk.'
    },
    {
      id: 'crate-vegan',
      title: 'Vibrant Vegan Vitality Crate',
      category: 'crates',
      unit: '100% Plant-Based Superpack',
      price: 36.00,
      originalPrice: 42.50,
      rating: 4.9,
      reviews: 78,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      badges: ['crate', 'vegan'],
      dietary: ['vegan', 'organic', 'gluten-free'],
      origin: 'California Solar-Powered Micro-Greenery',
      shelfLife: '7 Days Peak Freshness',
      nutrition: { calories: '280 kcal', carbs: '38g', protein: '16g', fat: '8g' },
      description: 'Loaded with organic kale, baby spinach, Haas avocados, artisanal cashew cheese, organic tempeh, and cold-pressed cold brew.'
    },

    // Fresh Fruits (Neon Orchards)
    {
      id: 'fruit-avocado',
      title: 'Organic Hass Avocados (Pack of 4)',
      category: 'fruits',
      unit: '4 Count Mesh Bag',
      price: 5.49,
      originalPrice: 6.99,
      rating: 4.9,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
      badges: ['organic', 'sale'],
      dietary: ['organic', 'vegan', 'gluten-free'],
      origin: 'Michoacán Highlands High-Altitude Farm',
      shelfLife: 'Ripe & ready within 2-3 days',
      nutrition: { calories: '160 kcal', carbs: '9g', protein: '2g', fat: '15g' },
      description: 'Creamy, rich, and high in heart-healthy monounsaturated fats. Perfectly ripened for guacamole, toast, or bowls.'
    },
    {
      id: 'fruit-berries',
      title: 'Neon Mountain Wild Blueberries',
      category: 'fruits',
      unit: '300g Clamshell',
      price: 4.89,
      originalPrice: null,
      rating: 4.8,
      reviews: 215,
      image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
      badges: ['organic'],
      dietary: ['organic', 'vegan', 'gluten-free'],
      origin: 'Pacific Northwest Certified Bio-Orchard',
      shelfLife: '5-7 Days Chilled',
      nutrition: { calories: '85 kcal', carbs: '21g', protein: '1g', fat: '0.5g' },
      description: 'Sweet and tangy wild blueberries packed with potent antioxidants and anthocyanins. Washed and ready to eat.'
    },
    {
      id: 'fruit-bananas',
      title: 'Fairtrade Golden Baby Bananas',
      category: 'fruits',
      unit: '1 Bunch (~1.2 kg)',
      price: 2.29,
      originalPrice: 2.79,
      rating: 4.7,
      reviews: 520,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
      badges: ['sale'],
      dietary: ['vegan', 'gluten-free'],
      origin: 'Ecuador Rain-Forest Alliance Certified',
      shelfLife: '5-6 Days Room Temp',
      nutrition: { calories: '105 kcal', carbs: '27g', protein: '1.3g', fat: '0.3g' },
      description: 'Naturally sweet and creamy bananas loaded with potassium and quick sustained energy for smoothies or snacking.'
    },
    {
      id: 'fruit-oranges',
      title: 'Valencia Juicy Blood Oranges',
      category: 'fruits',
      unit: '1.5 kg Cotton Crate Bag',
      price: 6.20,
      originalPrice: null,
      rating: 4.9,
      reviews: 88,
      image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
      badges: ['organic'],
      dietary: ['organic', 'vegan', 'gluten-free'],
      origin: 'Sun Valley Citrus Groves',
      shelfLife: '10-14 Days Refrigerated',
      nutrition: { calories: '62 kcal', carbs: '15g', protein: '1.2g', fat: '0.2g' },
      description: 'Stunning crimson-fleshed blood oranges bursting with rich citrus sweetness and floral berry undertones.'
    },

    // Fresh Vegetables & Greens
    {
      id: 'veg-spinach',
      title: 'Hydroponic Crisp Baby Spinach',
      category: 'vegetables',
      unit: '250g Airtight Box',
      price: 3.49,
      originalPrice: 4.19,
      rating: 4.8,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
      badges: ['organic', 'sale'],
      dietary: ['organic', 'vegan', 'gluten-free'],
      origin: 'Neon Vertical Hydroponic Labs',
      shelfLife: '8 Days Fresh Lock',
      nutrition: { calories: '23 kcal', carbs: '3.6g', protein: '2.9g', fat: '0.4g' },
      description: 'Triple-washed hydroponically grown tender spinach leaves. Zero pesticides, vibrant chlorophyll glow, velvety texture.'
    },
    {
      id: 'veg-tomatoes',
      title: 'Heirloom Sunset Cherry Tomatoes',
      category: 'vegetables',
      unit: '400g Biodegradable Punnet',
      price: 4.15,
      originalPrice: null,
      rating: 4.9,
      reviews: 164,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      badges: ['organic'],
      dietary: ['organic', 'vegan', 'gluten-free'],
      origin: 'Ojai Valley Glasshouses',
      shelfLife: '7 Days Room Temp',
      nutrition: { calories: '27 kcal', carbs: '5.8g', protein: '1.3g', fat: '0.3g' },
      description: 'A dazzling rainbow mix of yellow, burgundy, and fiery orange cherry tomatoes bursting with candy-like sweetness.'
    },
    {
      id: 'veg-bellpeppers',
      title: 'Trio Sweet Bell Peppers (RGB Mix)',
      category: 'vegetables',
      unit: 'Pack of 3 (Red, Green, Yellow)',
      price: 4.50,
      originalPrice: 5.20,
      rating: 4.7,
      reviews: 110,
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
      badges: [],
      dietary: ['vegan', 'gluten-free', 'organic'],
      origin: 'Baja Sunshine Agrico',
      shelfLife: '10 Days Chilled',
      nutrition: { calories: '31 kcal', carbs: '6g', protein: '1g', fat: '0.3g' },
      description: 'Extra crisp and succulent bell peppers ideal for fajitas, fresh salads, or crunchy dipping with hummus.'
    },
    {
      id: 'veg-broccoli',
      title: 'Tenderstem Crown Broccoli',
      category: 'vegetables',
      unit: '500g Bunch',
      price: 3.20,
      originalPrice: null,
      rating: 4.8,
      reviews: 140,
      image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80',
      badges: ['organic'],
      dietary: ['organic', 'vegan', 'gluten-free'],
      origin: 'Monterey Coast Cool Farms',
      shelfLife: '7 Days Chilled',
      nutrition: { calories: '34 kcal', carbs: '6.6g', protein: '2.8g', fat: '0.4g' },
      description: 'Dense, emerald-green broccoli crowns harvested at sunrise. High in sulforaphane, Vitamin C, and crisp fiber.'
    },

    // Dairy & Plant Milks & Eggs
    {
      id: 'dairy-oatmilk',
      title: 'Oat Wave Ultra Barista Edition',
      category: 'dairy',
      unit: '1 Litre Tetra Pak',
      price: 3.99,
      originalPrice: 4.50,
      rating: 4.9,
      reviews: 410,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      badges: ['vegan', 'sale'],
      dietary: ['vegan', 'gluten-free'],
      origin: 'Nordic Organic Oat Fields',
      shelfLife: 'Guaranteed 6 Months Shelf-Stable',
      nutrition: { calories: '140 kcal', carbs: '16g', protein: '3g', fat: '7g' },
      description: 'Steams into silky micro-foam for lattes, or pours velvety smooth over cereals. No added sugar or rapeseed junk.'
    },
    {
      id: 'dairy-eggs',
      title: 'Pasture-Raised Organic Golden Eggs',
      category: 'dairy',
      unit: 'Carton of 12 Large',
      price: 6.49,
      originalPrice: null,
      rating: 5.0,
      reviews: 380,
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
      badges: ['organic'],
      dietary: ['organic', 'high-protein', 'gluten-free'],
      origin: 'Shenandoah Green Acre Co-op',
      shelfLife: 'Guaranteed 3 Weeks Fresh',
      nutrition: { calories: '72 kcal', carbs: '0.4g', protein: '6.3g', fat: '4.8g' },
      description: 'From hens free to roam open green pastures with 108 sq ft per bird. Deep vibrant amber yolks with exceptional flavor.'
    },
    {
      id: 'dairy-yogurt',
      title: 'Greek Cultured High-Protein Yogurt',
      category: 'dairy',
      unit: '500g Tub',
      price: 4.79,
      originalPrice: 5.50,
      rating: 4.8,
      reviews: 175,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
      badges: ['organic', 'sale'],
      dietary: ['high-protein', 'gluten-free', 'organic'],
      origin: 'Adirondack Creamery Valley',
      shelfLife: '14 Days Refrigerated',
      nutrition: { calories: '130 kcal', carbs: '6g', protein: '18g', fat: '4g' },
      description: 'Triple-strained whole milk Greek yogurt with 18 grams of live bio-active protein per serving. Super thick and decadent.'
    },

    // Artisan Bakery
    {
      id: 'bakery-sourdough',
      title: 'Neon Hearth San Francisco Sourdough',
      category: 'bakery',
      unit: '750g Artisan Boule',
      price: 5.80,
      originalPrice: null,
      rating: 4.9,
      reviews: 290,
      image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
      badges: ['organic'],
      dietary: ['vegan', 'organic'],
      origin: 'Neon Hearth Bakery (Mother Starter est. 1998)',
      shelfLife: '4 Days Room Temp (Freezable)',
      nutrition: { calories: '180 kcal', carbs: '36g', protein: '7g', fat: '1g' },
      description: 'Fermented for 36 hours for blistered golden crust and an airy, custard-soft open crumb with a bright tangy sour finish.'
    },
    {
      id: 'bakery-croissants',
      title: 'French Butter Croissants (Pack of 4)',
      category: 'bakery',
      unit: '4 Gourmet Pastries',
      price: 6.99,
      originalPrice: 8.20,
      rating: 4.9,
      reviews: 210,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      badges: ['sale'],
      dietary: [],
      origin: 'Normandy Artisan Pastry Kitchen',
      shelfLife: 'Best enjoyed within 48 hours',
      nutrition: { calories: '260 kcal', carbs: '28g', protein: '5g', fat: '14g' },
      description: 'Hand-laminated with 82% cultured Charentes-Poitou French butter. Hundreds of flaky honeycomb layers that melt on your tongue.'
    },

    // Proteins & Seafood
    {
      id: 'protein-salmon',
      title: 'Wild Alaskan Sockeye Salmon Fillet',
      category: 'proteins',
      unit: '450g Fresh Cut Fillet',
      price: 14.90,
      originalPrice: 17.50,
      rating: 5.0,
      reviews: 165,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
      badges: ['sale'],
      dietary: ['high-protein', 'gluten-free'],
      origin: 'Bristol Bay Sustainable Wild Fishery',
      shelfLife: '3 Days Chilled (Or freeze immediately)',
      nutrition: { calories: '220 kcal', carbs: '0g', protein: '27g', fat: '12g' },
      description: 'Deep ruby-red color and rich in heart-protecting Omega-3 EPA & DHA fatty acids. Responsibly hook-and-line caught.'
    },
    {
      id: 'protein-beef',
      title: 'Grass-Fed Angus Ribeye Steak',
      category: 'proteins',
      unit: '350g Prime Cut',
      price: 16.50,
      originalPrice: null,
      rating: 4.9,
      reviews: 130,
      image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
      badges: ['organic'],
      dietary: ['high-protein', 'gluten-free', 'organic'],
      origin: 'Montana Highland Cattle Ranches',
      shelfLife: '4 Days Chilled',
      nutrition: { calories: '310 kcal', carbs: '0g', protein: '29g', fat: '21g' },
      description: '100% grass-fed and finished beef, dry aged for 21 days for maximum tenderness and deep, complex beefy flavor.'
    },
    {
      id: 'protein-chicken',
      title: 'Organic Air-Chilled Chicken Breasts',
      category: 'proteins',
      unit: '600g (Pack of 2 Fillets)',
      price: 9.20,
      originalPrice: 10.50,
      rating: 4.8,
      reviews: 240,
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
      badges: ['organic'],
      dietary: ['organic', 'high-protein', 'gluten-free'],
      origin: 'Blue Ridge Humane Farms',
      shelfLife: '4 Days Chilled',
      nutrition: { calories: '165 kcal', carbs: '0g', protein: '31g', fat: '3.6g' },
      description: 'Air-chilled to lock in pure chicken flavor and moisture without chlorine water absorption. Tender and juicy every time.'
    },

    // CyberSnacks & Refreshing Drinks
    {
      id: 'snack-kombucha',
      title: 'Neon Glow Ginger-Lime Live Kombucha',
      category: 'snacks',
      unit: '473ml Glass Bottle',
      price: 3.75,
      originalPrice: null,
      rating: 4.8,
      reviews: 195,
      image: 'https://images.unsplash.com/photo-1559839914-ba2a0f8eb86a?auto=format&fit=crop&w=600&q=80',
      badges: ['vegan', 'organic'],
      dietary: ['vegan', 'organic', 'gluten-free'],
      origin: 'Neon Fermentary Small Batch',
      shelfLife: '3 Months Refrigerated',
      nutrition: { calories: '35 kcal', carbs: '8g', protein: '0g', fat: '0g' },
      description: 'Effervescent, sparkling fermented tea steeped with cold-pressed Peruvian ginger root and zesty Mexican key lime.'
    },
    {
      id: 'snack-chips',
      title: 'Truffle & Sea Salt Avocado Oil Chips',
      category: 'snacks',
      unit: '150g Bag',
      price: 4.25,
      originalPrice: 4.99,
      rating: 4.9,
      reviews: 260,
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
      badges: ['sale'],
      dietary: ['vegan', 'gluten-free'],
      origin: 'Artisan Kettle Cook Co.',
      shelfLife: '6 Months Ambient',
      nutrition: { calories: '150 kcal', carbs: '16g', protein: '2g', fat: '9g' },
      description: 'Thick cut heirloom potatoes kettle-cooked in 100% pure avocado oil, then dusted with black summer truffle and sea salt.'
    },
    {
      id: 'snack-chocolate',
      title: 'Midnight 85% Single-Origin Dark Chocolate',
      category: 'snacks',
      unit: '80g Gourmet Bar',
      price: 3.99,
      originalPrice: null,
      rating: 5.0,
      reviews: 140,
      image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80',
      badges: ['organic', 'vegan'],
      dietary: ['organic', 'vegan', 'gluten-free'],
      origin: 'Madagascar Sambirano Valley Direct Trade',
      shelfLife: '1 Year Room Temp',
      nutrition: { calories: '210 kcal', carbs: '14g', protein: '4g', fat: '17g' },
      description: 'Velvety stone-ground dark chocolate notes of bright red currants and roasted espresso bean. Low glycemic treat.'
    }
  ];

  /* ==========================================================================
     Initial Seeding Data for Users & Orders (if first run)
     ========================================================================== */
  const SEED_USERS = [
    {
      id: 'usr-1',
      name: 'Alex Morgan',
      phone: '+1 (555) 839-2041',
      email: 'alex@neoncrate.io',
      address: '742 Evergreen Terrace, Penthouse B',
      password: 'password123',
      createdAt: '2026-09-01T10:00:00.000Z'
    },
    {
      id: 'usr-2',
      name: 'Sarah Connor',
      phone: '+1 (555) 302-8492',
      email: 'sarah@cybertech.io',
      address: '1044 Neon Sky Blvd, Apt 7',
      password: 'cyberpass',
      createdAt: '2026-09-03T14:30:00.000Z'
    }
  ];

  const SEED_ORDERS = [
    {
      orderId: 'NC-418290',
      userId: 'usr-1',
      name: 'Alex Morgan',
      phone: '+1 (555) 839-2041',
      address: '742 Evergreen Terrace, Penthouse B',
      total: 48.78,
      status: 'Dispatched',
      items: [
        { title: 'Neon Harvest Organic Crate', unit: '8-10 Essential Farm Items', price: 38.99, quantity: 1 },
        { title: 'French Butter Croissants', unit: '4 Gourmet Pastries', price: 6.99, quantity: 1 }
      ],
      date: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      orderId: 'NC-902144',
      userId: 'usr-2',
      name: 'Sarah Connor',
      phone: '+1 (555) 302-8492',
      address: '1044 Neon Sky Blvd, Apt 7',
      total: 62.40,
      status: 'Pending',
      items: [
        { title: 'Cyber-Protein Power Crate', unit: 'High Protein Bundle', price: 54.99, quantity: 1 },
        { title: 'Oat Wave Ultra Barista Edition', unit: '1 Litre', price: 3.99, quantity: 1 }
      ],
      date: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  /* ==========================================================================
     Application State
     ========================================================================== */
  const STATE = {
    cart: JSON.parse(localStorage.getItem('neon_crates_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('neon_crates_wishlist') || '[]'),
    orders: JSON.parse(localStorage.getItem('neon_crates_orders') || JSON.stringify(SEED_ORDERS)),
    users: JSON.parse(localStorage.getItem('neon_crates_users') || JSON.stringify(SEED_USERS)),
    currentUser: JSON.parse(localStorage.getItem('neon_crates_current_user') || 'null'),
    authToken: localStorage.getItem('neon_crates_auth_token') || null,
    serverProducts: [],
    customProducts: JSON.parse(localStorage.getItem('neon_crates_custom_products') || '[]'),
    hiddenProductIds: JSON.parse(localStorage.getItem('neon_crates_hidden_products') || '[]'),
    theme: localStorage.getItem('neon_crates_theme') || 'dark',
    appliedPromo: null,
    filters: {
      category: 'all',
      dietary: 'all',
      search: '',
      sort: 'featured'
    },
    customCrate: {
      boxType: 'Cyber-Insulated Coolbox ❄️',
      items: []
    },
  };

  const PROMO_CODES = {
    'NEON20': { type: 'percent', value: 0.20, label: '20% OFF Everything' },
    'FRESH10': { type: 'flat', value: 10.00, label: '$10 OFF Order' },
    'CRATE5': { type: 'flat', value: 5.00, label: '$5 Welcome Discount' }
  };

  const FREE_SHIPPING_THRESHOLD = 45.00;
  const STANDARD_SHIPPING_FEE = 4.99;
  const TAX_RATE = 0.08;

  function getAllProducts() {
    const products = STATE.serverProducts.length > 0
      ? STATE.serverProducts
      : [...BASE_PRODUCTS, ...STATE.customProducts];
    return products.filter(p => !STATE.hiddenProductIds.includes(p.id));
  }

  /* ==========================================================================
     DOM Elements Cache
     ========================================================================== */
  const DOM = {
    // Header & Theme
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    categoryNavItems: document.querySelectorAll('.cat-nav-item'),
    tagBtns: document.querySelectorAll('.tag-btn'),
    sortSelect: document.getElementById('sortSelect'),
    productGrid: document.getElementById('productGrid'),
    productCountLabel: document.getElementById('productCountLabel'),

    // User Auth & Dropdown
    userAuthBtn: document.getElementById('userAuthBtn'),
    userAvatar: document.getElementById('userAvatar'),
    userNameLabel: document.getElementById('userNameLabel'),
    userDropdown: document.getElementById('userDropdown'),
    openProfileItem: document.getElementById('openProfileItem'),
    openUserOrdersItem: document.getElementById('openUserOrdersItem'),
    logoutItem: document.getElementById('logoutItem'),

    // Profile Modal
    profileModal: document.getElementById('profileModal'),
    profileCloseBtn: document.getElementById('profileCloseBtn'),
    profHeaderName: document.getElementById('profHeaderName'),
    profHeaderEmail: document.getElementById('profHeaderEmail'),
    profAvatarDisplay: document.getElementById('profAvatarDisplay'),
    profileUpdateForm: document.getElementById('profileUpdateForm'),
    profName: document.getElementById('profName'),
    profPhone: document.getElementById('profPhone'),
    profEmail: document.getElementById('profEmail'),
    profAddress: document.getElementById('profAddress'),
    userOrdersListBody: document.getElementById('userOrdersListBody'),

    // Admin Portal
    adminTabOverview: document.getElementById('adminTabOverview'),
    adminTabOrders: document.getElementById('adminTabOrders'),
    adminTabInventory: document.getElementById('adminTabInventory'),
    adminContentOverview: document.getElementById('adminContentOverview'),
    adminContentOrders: document.getElementById('adminContentOrders'),
    adminContentInventory: document.getElementById('adminContentInventory'),
    adminPendingBadge: document.getElementById('adminPendingBadge'),
    adminInventoryBadge: document.getElementById('adminInventoryBadge'),
    kpiRevenue: document.getElementById('kpiRevenue'),
    kpiOrders: document.getElementById('kpiOrders'),
    kpiUsers: document.getElementById('kpiUsers'),
    kpiProducts: document.getElementById('kpiProducts'),
    adminRecentActivityList: document.getElementById('adminRecentActivityList'),
    adminOrdersTableBody: document.getElementById('adminOrdersTableBody'),
    adminProductsTableBody: document.getElementById('adminProductsTableBody'),

    // Add Product Modal
    openAddProductBtn: document.getElementById('openAddProductBtn'),
    addProductModal: document.getElementById('addProductModal'),
    addProductCloseBtn: document.getElementById('addProductCloseBtn'),
    addNewProductForm: document.getElementById('addNewProductForm'),
    newProdTitle: document.getElementById('newProdTitle'),
    newProdCategory: document.getElementById('newProdCategory'),
    newProdUnit: document.getElementById('newProdUnit'),
    newProdPrice: document.getElementById('newProdPrice'),
    newProdOriginalPrice: document.getElementById('newProdOriginalPrice'),
    newProdImage: document.getElementById('newProdImage'),
    dietOrganic: document.getElementById('dietOrganic'),
    dietVegan: document.getElementById('dietVegan'),
    dietGlutenFree: document.getElementById('dietGlutenFree'),
    dietHighProtein: document.getElementById('dietHighProtein'),
    newProdOrigin: document.getElementById('newProdOrigin'),
    newProdShelfLife: document.getElementById('newProdShelfLife'),
    newProdDesc: document.getElementById('newProdDesc'),

    // Cart Elements
    cartToggleBtn: document.getElementById('cartToggleBtn'),
    cartCloseBtn: document.getElementById('cartCloseBtn'),
    cartDrawer: document.getElementById('cartDrawer'),
    drawerBackdrop: document.getElementById('drawerBackdrop'),
    cartItemsList: document.getElementById('cartItemsList'),
    cartCountBadge: document.getElementById('cartCountBadge'),
    cartHeaderCount: document.getElementById('cartHeaderCount'),
    cartTotalDisplay: document.getElementById('cartTotalDisplay'),
    freeShippingText: document.getElementById('freeShippingText'),
    freeShippingProgress: document.getElementById('freeShippingProgress'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartDeliveryFee: document.getElementById('cartDeliveryFee'),
    cartDiscountRow: document.getElementById('cartDiscountRow'),
    cartDiscountAmount: document.getElementById('cartDiscountAmount'),
    cartTax: document.getElementById('cartTax'),
    cartGrandTotal: document.getElementById('cartGrandTotal'),
    promoInput: document.getElementById('promoInput'),
    promoApplyBtn: document.getElementById('promoApplyBtn'),
    appliedPromoBanner: document.getElementById('appliedPromoBanner'),
    checkoutBtn: document.getElementById('checkoutBtn'),

    // Wishlist
    wishlistBadge: document.getElementById('wishlistBadge'),
    wishlistBtn: document.getElementById('wishlistBtn'),

    // Quick View Modal
    quickViewModal: document.getElementById('quickViewModal'),
    quickViewCloseBtn: document.getElementById('quickViewCloseBtn'),
    quickViewContainer: document.getElementById('quickViewContainer'),

    // Checkout Modal
    checkoutModal: document.getElementById('checkoutModal'),
    checkoutCloseBtn: document.getElementById('checkoutCloseBtn'),
    checkoutForm: document.getElementById('checkoutForm'),
    checkoutSummaryTotal: document.getElementById('checkoutSummaryTotal'),
    deliverySlots: document.querySelectorAll('.slot-radio-card'),
    paymentCards: document.querySelectorAll('.pay-card'),

    // Live Drone Tracker Modal
    droneTrackerModal: document.getElementById('droneTrackerModal'),
    droneCloseBtn: document.getElementById('droneCloseBtn'),
    droneOrderCode: document.getElementById('droneOrderCode'),
    droneDeliveryAddress: document.getElementById('droneDeliveryAddress'),
    droneItemsSummary: document.getElementById('droneItemsSummary'),

    // Custom Crate Studio
    crateTypeCards: document.querySelectorAll('.crate-type-card'),
    builderItemsGrid: document.getElementById('builderItemsGrid'),
    traySlots: document.querySelectorAll('.tray-slot'),
    trayCounter: document.getElementById('trayCounter'),
    crateOriginalPrice: document.getElementById('crateOriginalPrice'),
    crateBundlePrice: document.getElementById('crateBundlePrice'),
    addCustomCrateBtn: document.getElementById('addCustomCrateBtn'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  /* ==========================================================================
     Helper Utilities
     ========================================================================== */
  function formatMoney(amount) {
    return '$' + Math.max(0, Number(amount)).toFixed(2);
  }

  function saveState() {
    localStorage.setItem('neon_crates_cart', JSON.stringify(STATE.cart));
    localStorage.setItem('neon_crates_wishlist', JSON.stringify(STATE.wishlist));
    localStorage.setItem('neon_crates_orders', JSON.stringify(STATE.orders));
    localStorage.setItem('neon_crates_users', JSON.stringify(STATE.users));
    localStorage.setItem('neon_crates_current_user', JSON.stringify(STATE.currentUser));
    localStorage.setItem('neon_crates_custom_products', JSON.stringify(STATE.customProducts));
    localStorage.setItem('neon_crates_hidden_products', JSON.stringify(STATE.hiddenProductIds));
    localStorage.setItem('neon_crates_theme', STATE.theme);
    if (STATE.authToken) localStorage.setItem('neon_crates_auth_token', STATE.authToken);
    else localStorage.removeItem('neon_crates_auth_token');
  }

  async function apiRequest(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = options.admin ? null : STATE.authToken;
    if (token) headers.Authorization = `Bearer ${token}`;
    let response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    } catch (error) {
      throw new Error('Cannot reach the NeonCrates server. Start it with "npm start" and try again.');
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Request failed');
    return payload;
  }

  async function loadServerProducts() {
    try {
      const products = await apiRequest('/api/products');
      if (Array.isArray(products) && products.length > 0) STATE.serverProducts = products;
    } catch (error) {
      console.warn('Using local catalog fallback:', error.message);
    }
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'error' ? '⚠️' : type === 'info' ? 'ℹ️' : '⚡';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* ==========================================================================
     Theme Management
     ========================================================================== */
  function applyTheme(theme) {
    STATE.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    DOM.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    saveState();
  }

  /* ==========================================================================
     User Accounts & Authentication
     ========================================================================== */
  function updateUserHeaderUI() {
    if (STATE.currentUser) {
      DOM.userNameLabel.textContent = STATE.currentUser.name;
      DOM.userAvatar.textContent = STATE.currentUser.name.charAt(0).toUpperCase();
    } else {
      DOM.userNameLabel.textContent = 'Sign In';
      DOM.userAvatar.textContent = '👤';
    }
  }

  function handleSignOut() {
    STATE.currentUser = null;
    STATE.authToken = null;
    saveState();
    updateUserHeaderUI();
    DOM.userDropdown.classList.remove('active');
    showToast('You have signed out successfully.', 'info');
  }

  function openProfileModal() {
    if (!STATE.currentUser) {
      window.location.href = 'login.html';
      return;
    }
    DOM.userDropdown.classList.remove('active');

    // Populate profile inputs
    DOM.profHeaderName.textContent = STATE.currentUser.name;
    DOM.profHeaderEmail.textContent = STATE.currentUser.email;
    DOM.profAvatarDisplay.textContent = STATE.currentUser.name.charAt(0).toUpperCase();
    DOM.profName.value = STATE.currentUser.name;
    DOM.profPhone.value = STATE.currentUser.phone;
    DOM.profEmail.value = STATE.currentUser.email;
    DOM.profAddress.value = STATE.currentUser.address;

    // Render customer orders
    renderUserOrdersTable();
    if (STATE.authToken) {
      apiRequest('/api/orders/my').then(orders => {
        STATE.orders = orders;
        saveState();
        renderUserOrdersTable();
      }).catch(error => console.warn('Could not refresh orders:', error.message));
    }

    DOM.profileModal.classList.add('active');
  }

  function closeProfileModal() {
    DOM.profileModal.classList.remove('active');
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    if (!STATE.currentUser) return;

    try {
      const result = await apiRequest('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: DOM.profName.value.trim(),
          phone: DOM.profPhone.value.trim(),
          address: DOM.profAddress.value.trim()
        })
      });
      STATE.currentUser = result.user;
      saveState();
      updateUserHeaderUI();
      DOM.profHeaderName.textContent = STATE.currentUser.name;
      DOM.profHeaderEmail.textContent = STATE.currentUser.email;
      DOM.profAvatarDisplay.textContent = STATE.currentUser.name.charAt(0).toUpperCase();
      showToast('Profile information updated successfully! ✨', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  function renderUserOrdersTable() {
    if (!STATE.currentUser) return;

    const myOrders = STATE.orders.filter(o => o.userId === STATE.currentUser.id || o.name === STATE.currentUser.name);

    if (myOrders.length === 0) {
      DOM.userOrdersListBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;color:var(--text-muted);padding:1.5rem;">
            No orders placed yet. Add groceries to your crate to get started!
          </td>
        </tr>
      `;
      return;
    }

    DOM.userOrdersListBody.innerHTML = myOrders.map(order => {
      const itemsText = order.items.map(i => `${i.quantity || 1}x ${i.title}`).join(', ');
      const dateStr = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const statusClass = order.status ? order.status.toLowerCase() : 'pending';

      return `
        <tr>
          <td><strong style="color:var(--neon-cyan);">${order.orderId}</strong></td>
          <td style="color:var(--text-muted);">${dateStr}</td>
          <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${itemsText}">${itemsText}</td>
          <td><strong style="color:var(--neon-green);">${formatMoney(order.total)}</strong></td>
          <td><span class="order-status-badge status-${statusClass}">${order.status || 'Pending'}</span></td>
        </tr>
      `;
    }).join('');
  }

  async function refreshAdminData() {
    try {
      const [orders, products] = await Promise.all([
        apiRequest('/api/admin/orders', { admin: true }),
        apiRequest('/api/products')
      ]);
      STATE.orders = orders;
      STATE.serverProducts = products;
      saveState();
      renderAdminOverview();
      renderAdminOrders();
      renderAdminInventory();
      renderProducts();
      renderCrateBuilder();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  function switchAdminTab(tab) {
    [DOM.adminTabOverview, DOM.adminTabOrders, DOM.adminTabInventory].forEach(b => b.classList.remove('active'));
    [DOM.adminContentOverview, DOM.adminContentOrders, DOM.adminContentInventory].forEach(c => c.style.display = 'none');

    if (tab === 'overview') {
      DOM.adminTabOverview.classList.add('active');
      DOM.adminContentOverview.style.display = 'block';
      renderAdminOverview();
    } else if (tab === 'orders') {
      DOM.adminTabOrders.classList.add('active');
      DOM.adminContentOrders.style.display = 'block';
      renderAdminOrders();
    } else if (tab === 'inventory') {
      DOM.adminTabInventory.classList.add('active');
      DOM.adminContentInventory.style.display = 'block';
      renderAdminInventory();
    }
  }

  function renderAdminOverview() {
    const products = getAllProducts();
    const grossSales = STATE.orders.reduce((acc, cur) => acc + (Number(cur.total) || 0), 0);
    const pendingOrders = STATE.orders.filter(o => (o.status || 'Pending').toLowerCase() === 'pending').length;

    DOM.kpiRevenue.textContent = formatMoney(grossSales);
    DOM.kpiOrders.textContent = STATE.orders.length;
    DOM.kpiUsers.textContent = STATE.users.length;
    DOM.kpiProducts.textContent = products.length;

    DOM.adminPendingBadge.textContent = pendingOrders;
    DOM.adminInventoryBadge.textContent = `(${products.length})`;

    // Activity Feed
    const recent = [...STATE.orders].reverse().slice(0, 5);
    if (recent.length === 0) {
      DOM.adminRecentActivityList.innerHTML = '<div>No recent activity recorded.</div>';
    } else {
      DOM.adminRecentActivityList.innerHTML = recent.map(o => `
        <div style="display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
          <span>📦 Order <strong>${o.orderId}</strong> placed by <strong>${o.name}</strong></span>
          <span style="color:var(--neon-green);font-weight:bold;">${formatMoney(o.total)} • <span style="text-transform:capitalize;">${o.status || 'Pending'}</span></span>
        </div>
      `).join('');
    }
  }

  function renderAdminOrders() {
    const orders = [...STATE.orders].reverse();
    const pendingCount = STATE.orders.filter(o => (o.status || 'Pending').toLowerCase() === 'pending').length;
    DOM.adminPendingBadge.textContent = pendingCount;

    if (orders.length === 0) {
      DOM.adminOrdersTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center;color:var(--text-muted);padding:2rem;">
            No incoming customer orders yet.
          </td>
        </tr>
      `;
      return;
    }

    DOM.adminOrdersTableBody.innerHTML = orders.map(order => {
      const itemsList = order.items.map(i => `${i.quantity || 1}x ${i.title}`).join(', ');
      const dateStr = new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
      const currentStatus = order.status || 'Pending';
      const statusClass = currentStatus.toLowerCase();

      return `
        <tr>
          <td><strong style="color:var(--neon-cyan);">${order.orderId}</strong></td>
          <td style="color:var(--text-muted);white-space:nowrap;">${dateStr}</td>
          <td>
            <strong>${order.name}</strong><br />
            <span style="font-size:0.75rem;color:var(--text-muted);">${order.phone}</span>
          </td>
          <td style="max-width:200px;font-size:0.82rem;">${order.address}</td>
          <td style="max-width:220px;font-size:0.82rem;" title="${itemsList}">${itemsList}</td>
          <td><strong style="color:var(--neon-green);">${formatMoney(order.total)}</strong></td>
          <td><span class="order-status-badge status-${statusClass}">${currentStatus}</span></td>
          <td>
            <select class="status-select" data-action="update-order-status" data-order-id="${order.orderId}">
              <option value="Pending" ${currentStatus === 'Pending' ? 'selected' : ''}>Pending ⏳</option>
              <option value="Dispatched" ${currentStatus === 'Dispatched' ? 'selected' : ''}>Dispatched 🛸</option>
              <option value="Delivered" ${currentStatus === 'Delivered' ? 'selected' : ''}>Delivered ✅</option>
              <option value="Cancelled" ${currentStatus === 'Cancelled' ? 'selected' : ''}>Cancelled ❌</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  }

  async function updateOrderStatus(orderId, newStatus) {
    const order = STATE.orders.find(o => o.orderId === orderId);
    if (order) {
      try {
        const result = await apiRequest(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
          method: 'PATCH',
          admin: true,
          body: JSON.stringify({ status: newStatus })
        });
        order.status = result.order.status;
        saveState();
        renderAdminOrders();
        renderAdminOverview();
        showToast(`Order <strong>${orderId}</strong> marked as <strong>${newStatus}</strong>!`, 'info');
      } catch (error) {
        showToast(error.message, 'error');
      }
    }
  }

  function renderAdminInventory() {
    const products = getAllProducts();
    DOM.adminInventoryBadge.textContent = `(${products.length})`;

    DOM.adminProductsTableBody.innerHTML = products.map(item => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <img src="${item.image}" alt="${item.title}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;" />
            <div>
              <strong>${item.title}</strong><br />
              <span style="font-size:0.75rem;color:var(--text-muted);">Origin: ${item.origin || 'Certified Farm'}</span>
            </div>
          </div>
        </td>
        <td><span style="text-transform:uppercase;font-size:0.78rem;color:var(--neon-cyan);">${item.category}</span></td>
        <td>${item.unit}</td>
        <td><strong style="color:var(--neon-green);">${formatMoney(item.price)}</strong></td>
        <td><span class="badge-pill organic">In Stock</span></td>
        <td>
          <button class="btn-del-prod" data-action="delete-product" data-product-id="${item.id}">
            🗑️ Delete
          </button>
        </td>
      </tr>
    `).join('');
  }

  async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to remove this item from the store catalog?')) return;

    try {
      await apiRequest(`/api/products/${encodeURIComponent(productId)}`, { method: 'DELETE', admin: true });
      STATE.serverProducts = STATE.serverProducts.filter(product => product.id !== productId);
      saveState();
      renderAdminInventory();
      renderAdminOverview();
      renderProducts();
      renderCrateBuilder();
      showToast('Grocery item removed from store catalog.', 'info');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function handleAddNewProduct(e) {
    e.preventDefault();

    const title = DOM.newProdTitle.value.trim();
    const category = DOM.newProdCategory.value;
    const unit = DOM.newProdUnit.value.trim();
    const price = parseFloat(DOM.newProdPrice.value);
    const originalPrice = DOM.newProdOriginalPrice.value ? parseFloat(DOM.newProdOriginalPrice.value) : null;
    const image = DOM.newProdImage.value.trim();
    const origin = DOM.newProdOrigin.value.trim() || 'Local Eco Farm';
    const shelfLife = DOM.newProdShelfLife.value.trim() || 'Guaranteed Fresh';
    const description = DOM.newProdDesc.value.trim();

    const dietary = [];
    if (DOM.dietOrganic.checked) dietary.push('organic');
    if (DOM.dietVegan.checked) dietary.push('vegan');
    if (DOM.dietGlutenFree.checked) dietary.push('gluten-free');
    if (DOM.dietHighProtein.checked) dietary.push('high-protein');

    const badges = [];
    if (dietary.includes('organic')) badges.push('organic');
    if (dietary.includes('vegan')) badges.push('vegan');
    if (originalPrice && originalPrice > price) badges.push('sale');
    if (category === 'crates') badges.push('crate');

    try {
      const newProduct = await apiRequest('/api/products', {
        method: 'POST',
        admin: true,
        body: JSON.stringify({ title, category, unit, price, originalPrice, image, badges, dietary, origin, shelfLife, description })
      });
      STATE.serverProducts.push(newProduct);
      saveState();
      DOM.addNewProductForm.reset();
      DOM.addProductModal.classList.remove('active');
      renderProducts();
      renderCrateBuilder();
      renderAdminInventory();
      renderAdminOverview();
      showToast(`<strong>${title}</strong> has been listed on the store! 🚀`, 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  /* ==========================================================================
     Product Grid Rendering & Filtering
     ========================================================================== */
  function getFilteredProducts() {
    let list = getAllProducts();

    // Category Filter
    if (STATE.filters.category !== 'all') {
      list = list.filter(item => item.category === STATE.filters.category);
    }

    // Dietary Filter
    if (STATE.filters.dietary !== 'all') {
      list = list.filter(item => item.dietary.includes(STATE.filters.dietary));
    }

    // Search Query
    if (STATE.filters.search.trim()) {
      const q = STATE.filters.search.toLowerCase().trim();
      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.origin && item.origin.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (STATE.filters.sort) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        break;
    }

    return list;
  }

  function renderProducts() {
    const filtered = getFilteredProducts();

    if (DOM.productCountLabel) {
      DOM.productCountLabel.textContent = `Showing ${filtered.length} item${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      DOM.productGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>No Groceries Found</h3>
          <p>We couldn't find any items matching your filters or search.</p>
          <button class="btn-secondary" id="resetFiltersBtn">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          STATE.filters = { category: 'all', dietary: 'all', search: '', sort: 'featured' };
          DOM.searchInput.value = '';
          DOM.searchClearBtn.style.display = 'none';
          DOM.sortSelect.value = 'featured';
          DOM.categoryNavItems.forEach(el => el.classList.toggle('active', el.dataset.category === 'all'));
          DOM.tagBtns.forEach(el => el.classList.toggle('active', el.dataset.tag === 'all'));
          renderProducts();
        });
      }
      return;
    }

    DOM.productGrid.innerHTML = filtered.map(item => {
      const isWishlisted = STATE.wishlist.includes(item.id);
      const cartItem = STATE.cart.find(c => c.productId === item.id);
      const qty = cartItem ? cartItem.quantity : 0;

      // Badges
      const badgesHTML = (item.badges || []).map(b => {
        let badgeLabel = b.toUpperCase();
        if (b === 'organic') badgeLabel = '🌿 100% Organic';
        if (b === 'sale') badgeLabel = '🔥 Best Value';
        if (b === 'crate') badgeLabel = '📦 Curated Crate';
        if (b === 'vegan') badgeLabel = '🌱 Pure Vegan';
        return `<span class="badge-pill ${b}">${badgeLabel}</span>`;
      }).join('');

      return `
        <div class="product-card" data-id="${item.id}">
          <div class="product-card-top">
            <img src="${item.image}" alt="${item.title}" class="product-img" loading="lazy" />
            <div class="product-badges">${badgesHTML}</div>
            <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-action="wishlist" data-id="${item.id}" title="Save to Favorites">
              ${isWishlisted ? '❤️' : '🤍'}
            </button>
            <button class="quick-view-trigger" data-action="quickview" data-id="${item.id}">
              Quick View 👁️
            </button>
          </div>

          <div class="product-category-label">${item.category.toUpperCase()}</div>
          <h4 class="product-title">${item.title}</h4>
          <div class="product-unit">${item.unit}</div>

          <div class="product-rating">
            <span>⭐ ${item.rating.toFixed(1)}</span>
            <span>(${item.reviews} reviews)</span>
          </div>

          <div class="product-card-bottom">
            <div class="price-box">
              <span class="current-price">${formatMoney(item.price)}</span>
              ${item.originalPrice ? `<span class="original-price">${formatMoney(item.originalPrice)}</span>` : ''}
            </div>

            ${qty > 0 ? `
              <div class="card-stepper">
                <button data-action="card-qty-minus" data-id="${item.id}">−</button>
                <span>${qty}</span>
                <button data-action="card-qty-plus" data-id="${item.id}">+</button>
              </div>
            ` : `
              <button class="add-btn" data-action="add-to-cart" data-id="${item.id}">
                <span>+ Add</span> 🛒
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  /* ==========================================================================
     Cart Logic & Calculations
     ========================================================================== */
  function getCartItemDetails(cartItem) {
    if (cartItem.isCustomCrate) {
      return {
        id: cartItem.id,
        title: cartItem.customCrateTitle,
        unit: `${cartItem.customCrateItems.length} Handpicked Items • ${cartItem.boxType}`,
        price: cartItem.price,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
        quantity: cartItem.quantity
      };
    }
    const product = getAllProducts().find(p => p.id === cartItem.productId);
    if (!product) return null;
    return {
      id: product.id,
      title: product.title,
      unit: product.unit,
      price: product.price,
      image: product.image,
      quantity: cartItem.quantity
    };
  }

  function calculateCartTotals() {
    let subtotal = 0;
    let totalItems = 0;

    STATE.cart.forEach(item => {
      const details = getCartItemDetails(item);
      if (details) {
        subtotal += details.price * details.quantity;
        totalItems += details.quantity;
      }
    });

    let discount = 0;
    if (STATE.appliedPromo && subtotal > 0) {
      if (STATE.appliedPromo.type === 'percent') {
        discount = subtotal * STATE.appliedPromo.value;
      } else if (STATE.appliedPromo.type === 'flat') {
        discount = Math.min(subtotal, STATE.appliedPromo.value);
      }
    }

    const freeShippingAchieved = subtotal >= FREE_SHIPPING_THRESHOLD;
    const deliveryFee = (subtotal === 0 || freeShippingAchieved) ? 0.00 : STANDARD_SHIPPING_FEE;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * TAX_RATE;
    const grandTotal = taxableAmount + deliveryFee + tax;

    return {
      subtotal,
      totalItems,
      discount,
      deliveryFee,
      tax,
      grandTotal,
      freeShippingAchieved
    };
  }

  function updateCartDrawerUI() {
    const totals = calculateCartTotals();

    DOM.cartCountBadge.textContent = totals.totalItems;
    DOM.cartHeaderCount.textContent = `(${totals.totalItems})`;
    DOM.cartTotalDisplay.textContent = formatMoney(totals.grandTotal);
    DOM.wishlistBadge.textContent = STATE.wishlist.length;

    // Free delivery progress bar
    if (totals.subtotal >= FREE_SHIPPING_THRESHOLD) {
      DOM.freeShippingText.innerHTML = `🎉 You've unlocked <strong>FREE 15-Min Express Delivery!</strong>`;
      DOM.freeShippingProgress.style.width = '100%';
    } else {
      const remaining = FREE_SHIPPING_THRESHOLD - totals.subtotal;
      const progressPercent = Math.min(100, Math.round((totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      DOM.freeShippingText.innerHTML = `Add <strong>${formatMoney(remaining)}</strong> more for <strong>FREE Express Delivery</strong>!`;
      DOM.freeShippingProgress.style.width = `${progressPercent}%`;
    }

    DOM.cartSubtotal.textContent = formatMoney(totals.subtotal);
    DOM.cartDeliveryFee.textContent = totals.deliveryFee === 0 ? 'FREE' : formatMoney(totals.deliveryFee);
    DOM.cartDeliveryFee.style.color = totals.deliveryFee === 0 ? 'var(--neon-green)' : 'inherit';

    if (totals.discount > 0) {
      DOM.cartDiscountRow.style.display = 'flex';
      DOM.cartDiscountAmount.textContent = `-${formatMoney(totals.discount)}`;
    } else {
      DOM.cartDiscountRow.style.display = 'none';
    }

    DOM.cartTax.textContent = formatMoney(totals.tax);
    DOM.cartGrandTotal.textContent = formatMoney(totals.grandTotal);

    if (STATE.cart.length === 0) {
      DOM.cartItemsList.innerHTML = `
        <div class="cart-empty-message">
          <div class="icon">🛒</div>
          <h4>Your Crate is Empty</h4>
          <p>Explore our fresh aisles or build your custom bundle!</p>
        </div>
      `;
      DOM.checkoutBtn.disabled = true;
      DOM.checkoutBtn.style.opacity = '0.5';
    } else {
      DOM.checkoutBtn.disabled = false;
      DOM.checkoutBtn.style.opacity = '1';

      DOM.cartItemsList.innerHTML = STATE.cart.map((cartItem, index) => {
        const details = getCartItemDetails(cartItem);
        if (!details) return '';

        return `
          <div class="cart-item">
            <img src="${details.image}" alt="${details.title}" class="cart-item-img" />
            <div class="cart-item-info">
              <h5>${details.title}</h5>
              <div class="item-unit">${details.unit}</div>
              <div class="item-price">${formatMoney(details.price * details.quantity)}</div>
            </div>
            <div class="cart-item-actions">
              <div class="cart-stepper">
                <button data-action="cart-minus" data-index="${index}">−</button>
                <span>${details.quantity}</span>
                <button data-action="cart-plus" data-index="${index}">+</button>
              </div>
              <button class="remove-item-btn" data-action="cart-remove" data-index="${index}" title="Remove">
                🗑️ Remove
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (STATE.appliedPromo) {
      DOM.appliedPromoBanner.style.display = 'flex';
      DOM.appliedPromoBanner.innerHTML = `
        <span>🏷️ <strong>${STATE.appliedPromo.code}</strong> (${STATE.appliedPromo.label})</span>
        <button id="removePromoBtn" style="color:var(--neon-coral);font-weight:bold;">✕</button>
      `;
      const removeBtn = document.getElementById('removePromoBtn');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          STATE.appliedPromo = null;
          DOM.appliedPromoBanner.style.display = 'none';
          updateCartDrawerUI();
          showToast('Promo code removed', 'info');
        });
      }
    } else {
      DOM.appliedPromoBanner.style.display = 'none';
    }
  }

  function addToCart(productId, quantity = 1) {
    const existing = STATE.cart.find(c => c.productId === productId && !c.isCustomCrate);
    const product = getAllProducts().find(p => p.id === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      STATE.cart.push({ productId, quantity });
    }

    saveState();
    updateCartDrawerUI();
    renderProducts();

    if (product) {
      showToast(`Added <strong>${product.title}</strong> to your crate!`);
    }
  }

  function updateCartItemQty(index, delta) {
    if (!STATE.cart[index]) return;
    STATE.cart[index].quantity += delta;
    if (STATE.cart[index].quantity <= 0) {
      STATE.cart.splice(index, 1);
      showToast('Item removed from crate', 'info');
    }
    saveState();
    updateCartDrawerUI();
    renderProducts();
  }

  function removeCartItem(index) {
    if (!STATE.cart[index]) return;
    STATE.cart.splice(index, 1);
    saveState();
    updateCartDrawerUI();
    renderProducts();
    showToast('Item removed from crate', 'info');
  }

  function toggleWishlist(productId) {
    const idx = STATE.wishlist.indexOf(productId);
    const product = getAllProducts().find(p => p.id === productId);
    if (idx > -1) {
      STATE.wishlist.splice(idx, 1);
      showToast(`Removed from Favorites`, 'info');
    } else {
      STATE.wishlist.push(productId);
      showToast(`Saved <strong>${product ? product.title : 'Item'}</strong> to Favorites! ❤️`);
    }
    saveState();
    renderProducts();
    DOM.wishlistBadge.textContent = STATE.wishlist.length;
  }

  /* ==========================================================================
     Build Your Own Crate (Interactive Studio)
     ========================================================================== */
  function renderCrateBuilder() {
    const nonCrateItems = getAllProducts().filter(p => p.category !== 'crates');

    DOM.builderItemsGrid.innerHTML = nonCrateItems.map(item => `
      <div class="mini-pick-card" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" />
        <h5>${item.title}</h5>
        <div class="price">${formatMoney(item.price)}</div>
      </div>
    `).join('');

    updateCrateTray();
  }

  function updateCrateTray() {
    const slots = STATE.customCrate.items;
    const maxSlots = 4;

    DOM.trayCounter.textContent = `${slots.length}/${maxSlots} Selected`;

    DOM.traySlots.forEach((slotEl, idx) => {
      const item = slots[idx];
      if (item) {
        slotEl.className = 'tray-slot filled';
        slotEl.innerHTML = `
          <button class="slot-remove-btn" data-slot-idx="${idx}" title="Remove slot item">✕</button>
          <div class="slot-item-view">
            <img src="${item.image}" alt="${item.title}" />
            <div class="slot-name">${item.title}</div>
          </div>
        `;
      } else {
        slotEl.className = 'tray-slot';
        slotEl.innerHTML = `
          <div class="slot-placeholder">
            <span>➕</span>
            <div>Empty Slot ${idx + 1}</div>
          </div>
        `;
      }
    });

    const rawTotal = slots.reduce((acc, cur) => acc + cur.price, 0);
    const discountedTotal = rawTotal * 0.85;

    DOM.crateOriginalPrice.textContent = formatMoney(rawTotal);
    DOM.crateBundlePrice.textContent = formatMoney(discountedTotal);

    DOM.addCustomCrateBtn.disabled = slots.length < 2;
    DOM.addCustomCrateBtn.style.opacity = slots.length < 2 ? '0.6' : '1';
  }

  function addItemToCustomCrate(product) {
    if (STATE.customCrate.items.length >= 4) {
      showToast('Crate is full (Max 4 items). Remove an item to swap!', 'error');
      return;
    }
    STATE.customCrate.items.push(product);
    updateCrateTray();
    showToast(`Packed <strong>${product.title}</strong> into your custom crate!`);
  }

  function removeItemFromCustomCrate(slotIndex) {
    STATE.customCrate.items.splice(slotIndex, 1);
    updateCrateTray();
  }

  function addCustomCrateToCart() {
    if (STATE.customCrate.items.length < 2) {
      showToast('Please pack at least 2 items into your crate!', 'error');
      return;
    }

    const rawTotal = STATE.customCrate.items.reduce((acc, cur) => acc + cur.price, 0);
    const discountedPrice = Number((rawTotal * 0.85).toFixed(2));

    const customCrateBundle = {
      id: 'custom-crate-' + Date.now(),
      isCustomCrate: true,
      customCrateTitle: `Custom ${STATE.customCrate.boxType}`,
      boxType: STATE.customCrate.boxType,
      customCrateItems: [...STATE.customCrate.items],
      price: discountedPrice,
      quantity: 1
    };

    STATE.cart.push(customCrateBundle);
    saveState();
    updateCartDrawerUI();

    STATE.customCrate.items = [];
    updateCrateTray();

    showToast('Your Custom Crate was packed and added to cart! 📦✨');
    openCartDrawer();
  }

  /* ==========================================================================
     Modal Handlers: Quick View, Checkout, Drone Tracking
     ========================================================================== */
  function openQuickView(productId) {
    const product = getAllProducts().find(p => p.id === productId);
    if (!product) return;

    DOM.quickViewContainer.innerHTML = `
      <div class="quickview-content">
        <div>
          <img src="${product.image}" alt="${product.title}" class="quickview-img" />
          <div class="product-badges" style="margin-top:0.75rem;">
            ${(product.badges || []).map(b => `<span class="badge-pill ${b}">${b.toUpperCase()}</span>`).join(' ')}
          </div>
        </div>
        <div>
          <div class="product-category-label">${product.category.toUpperCase()}</div>
          <h3 style="font-size:1.6rem;margin-bottom:0.4rem;">${product.title}</h3>
          <div style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:0.75rem;">${product.unit}</div>

          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
            <span style="font-size:1.6rem;font-weight:800;color:var(--neon-green);">${formatMoney(product.price)}</span>
            ${product.originalPrice ? `<span style="text-decoration:line-through;color:var(--text-muted);">${formatMoney(product.originalPrice)}</span>` : ''}
          </div>

          <p style="color:var(--text-secondary);font-size:0.92rem;line-height:1.6;margin-bottom:1rem;">
            ${product.description}
          </p>

          <div style="background:var(--bg-card);padding:0.85rem;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);margin-bottom:1.25rem;">
            <div style="font-size:0.8rem;color:var(--neon-cyan);margin-bottom:0.25rem;">📍 <strong>Farm Origin:</strong> ${product.origin || 'Certified Organic Farm'}</div>
            <div style="font-size:0.8rem;color:var(--neon-green);">⏳ <strong>Shelf Life Guarantee:</strong> ${product.shelfLife || 'Fresh Daily'}</div>
          </div>

          <div style="font-size:0.82rem;font-weight:700;color:var(--text-secondary);margin-bottom:0.4rem;">ESTIMATED NUTRITION PER SERVING:</div>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <div class="val">${product.nutrition ? product.nutrition.calories : '120 kcal'}</div>
              <div class="label">Calories</div>
            </div>
            <div class="nutrition-item">
              <div class="val">${product.nutrition ? product.nutrition.protein : '5g'}</div>
              <div class="label">Protein</div>
            </div>
            <div class="nutrition-item">
              <div class="val">${product.nutrition ? product.nutrition.carbs : '15g'}</div>
              <div class="label">Carbs</div>
            </div>
            <div class="nutrition-item">
              <div class="val">${product.nutrition ? product.nutrition.fat : '2g'}</div>
              <div class="label">Fat</div>
            </div>
          </div>

          <button class="btn-primary" id="modalAddToCartBtn" style="width:100%;justify-content:center;margin-top:1.25rem;">
            Add to Crate • ${formatMoney(product.price)}
          </button>
        </div>
      </div>
    `;

    const modalAddBtn = document.getElementById('modalAddToCartBtn');
    if (modalAddBtn) {
      modalAddBtn.addEventListener('click', () => {
        addToCart(product.id, 1);
        closeQuickView();
      });
    }

    DOM.quickViewModal.classList.add('active');
  }

  function closeQuickView() {
    DOM.quickViewModal.classList.remove('active');
  }

  function openCheckoutModal() {
    if (STATE.cart.length === 0) {
      showToast('Your crate is currently empty!', 'error');
      return;
    }
    closeCartDrawer();
    const totals = calculateCartTotals();
    DOM.checkoutSummaryTotal.textContent = formatMoney(totals.grandTotal);

    // Autofill user information if logged in
    if (STATE.currentUser) {
      document.getElementById('custName').value = STATE.currentUser.name;
      document.getElementById('custPhone').value = STATE.currentUser.phone;
      document.getElementById('custAddress').value = STATE.currentUser.address;
    }

    DOM.checkoutModal.classList.add('active');
  }

  function closeCheckoutModal() {
    DOM.checkoutModal.classList.remove('active');
  }

  async function handleOrderSubmission(e) {
    e.preventDefault();

    const address = document.getElementById('custAddress').value.trim();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();

    if (!address || !name) {
      showToast('Please enter your full name and delivery address', 'error');
      return;
    }

    const totals = calculateCartTotals();

    // Map items cleanly for order record
    const orderedItems = STATE.cart.map(c => {
      const d = getCartItemDetails(c);
      return {
        id: c.productId || c.id,
        title: d.title,
        unit: d.unit,
        price: d.price,
        quantity: c.quantity
      };
    });

    try {
      const newOrder = await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          name,
          address,
          phone,
          items: orderedItems,
          total: totals.grandTotal,
          paymentMethod: document.querySelector('.pay-card.active')?.textContent.trim() || 'NeonPay 1-Click'
        })
      });
      STATE.orders.push(newOrder);
      STATE.cart = [];
      STATE.appliedPromo = null;
      saveState();
      updateCartDrawerUI();
      renderProducts();
      closeCheckoutModal();
      launchDroneTrackingSimulation(newOrder);
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  function launchDroneTrackingSimulation(order) {
    DOM.droneOrderCode.textContent = order.orderId;
    DOM.droneDeliveryAddress.textContent = order.address;
    DOM.droneItemsSummary.textContent = `${order.items.length} items • Total Paid: ${formatMoney(order.total)}`;

    DOM.droneTrackerModal.classList.add('active');

    const steps = [
      document.getElementById('step-1'),
      document.getElementById('step-2'),
      document.getElementById('step-3'),
      document.getElementById('step-4')
    ];

    steps.forEach(s => s.classList.remove('active', 'completed'));

    steps[0].classList.add('completed');
    steps[1].classList.add('active');

    setTimeout(() => {
      steps[1].classList.remove('active');
      steps[1].classList.add('completed');
      steps[2].classList.add('active');
    }, 3000);

    setTimeout(() => {
      steps[2].classList.remove('active');
      steps[2].classList.add('completed');
      steps[3].classList.add('active');
    }, 6000);

    setTimeout(() => {
      steps[3].classList.remove('active');
      steps[3].classList.add('completed');
      showToast('Drone has safely delivered your NeonCrates order! 🎁🚁', 'success');
    }, 9000);
  }

  function closeDroneTracker() {
    DOM.droneTrackerModal.classList.remove('active');
  }

  /* ==========================================================================
     Cart Drawer Open / Close
     ========================================================================== */
  function openCartDrawer() {
    DOM.cartDrawer.classList.add('open');
    DOM.drawerBackdrop.classList.add('active');
  }

  function closeCartDrawer() {
    DOM.cartDrawer.classList.remove('open');
    DOM.drawerBackdrop.classList.remove('active');
  }

  /* ==========================================================================
     Event Listeners Setup
     ========================================================================== */
  function setupEventListeners() {
    // Theme Toggle
    DOM.themeToggleBtn.addEventListener('click', () => {
      applyTheme(STATE.theme === 'dark' ? 'light' : 'dark');
    });

    // User Account & Header Events
    DOM.userAuthBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (STATE.currentUser) {
        DOM.userDropdown.classList.toggle('active');
      } else {
        window.location.href = 'login.html';
      }
    });

    // Close user dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!DOM.userAuthBtn.contains(e.target) && !DOM.userDropdown.contains(e.target)) {
        DOM.userDropdown.classList.remove('active');
      }
    });

    DOM.openProfileItem.addEventListener('click', openProfileModal);
    DOM.openUserOrdersItem.addEventListener('click', openProfileModal);
    DOM.logoutItem.addEventListener('click', handleSignOut);

    // Profile Modal Events
    DOM.profileCloseBtn.addEventListener('click', closeProfileModal);
    DOM.profileUpdateForm.addEventListener('submit', handleProfileUpdate);

    // Admin Order Status Updates (delegated)
    DOM.adminOrdersTableBody.addEventListener('change', (e) => {
      if (e.target.dataset.action === 'update-order-status') {
        const orderId = e.target.dataset.orderId;
        const newStatus = e.target.value;
        updateOrderStatus(orderId, newStatus);
      }
    });

    // Admin Inventory Delete (delegated)
    DOM.adminProductsTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="delete-product"]');
      if (btn) {
        deleteProduct(btn.dataset.productId);
      }
    });

    // Add Product Modal Events
    DOM.openAddProductBtn.addEventListener('click', () => {
      DOM.addProductModal.classList.add('active');
    });
    DOM.addProductCloseBtn.addEventListener('click', () => {
      DOM.addProductModal.classList.remove('active');
    });
    DOM.addNewProductForm.addEventListener('submit', handleAddNewProduct);

    // Search Input
    DOM.searchInput.addEventListener('input', (e) => {
      STATE.filters.search = e.target.value;
      DOM.searchClearBtn.style.display = e.target.value ? 'block' : 'none';
      renderProducts();
    });

    DOM.searchClearBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      STATE.filters.search = '';
      DOM.searchClearBtn.style.display = 'none';
      renderProducts();
    });

    // Category Tabs
    DOM.categoryNavItems.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.categoryNavItems.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        STATE.filters.category = btn.dataset.category;
        renderProducts();
      });
    });

    // Dietary Filter Pills
    DOM.tagBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.tagBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        STATE.filters.dietary = btn.dataset.tag;
        renderProducts();
      });
    });

    // Sort Dropdown
    DOM.sortSelect.addEventListener('change', (e) => {
      STATE.filters.sort = e.target.value;
      renderProducts();
    });

    // Cart Drawer Toggle
    DOM.cartToggleBtn.addEventListener('click', openCartDrawer);
    DOM.cartCloseBtn.addEventListener('click', closeCartDrawer);
    DOM.drawerBackdrop.addEventListener('click', closeCartDrawer);

    // Product Grid Delegated Events
    DOM.productGrid.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;
      const id = target.dataset.id;

      if (action === 'add-to-cart') {
        addToCart(id, 1);
      } else if (action === 'card-qty-plus') {
        addToCart(id, 1);
      } else if (action === 'card-qty-minus') {
        const itemIdx = STATE.cart.findIndex(c => c.productId === id && !c.isCustomCrate);
        if (itemIdx > -1) updateCartItemQty(itemIdx, -1);
      } else if (action === 'wishlist') {
        toggleWishlist(id);
      } else if (action === 'quickview') {
        openQuickView(id);
      }
    });

    // Cart Drawer Delegated Events
    DOM.cartItemsList.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;
      const index = parseInt(target.dataset.index, 10);

      if (action === 'cart-plus') {
        updateCartItemQty(index, 1);
      } else if (action === 'cart-minus') {
        updateCartItemQty(index, -1);
      } else if (action === 'cart-remove') {
        removeCartItem(index);
      }
    });

    // Promo Code Apply
    DOM.promoApplyBtn.addEventListener('click', () => {
      const code = DOM.promoInput.value.trim().toUpperCase();
      if (!code) return;

      if (PROMO_CODES[code]) {
        STATE.appliedPromo = { code, ...PROMO_CODES[code] };
        DOM.promoInput.value = '';
        updateCartDrawerUI();
        showToast(`Coupon applied! ${PROMO_CODES[code].label}`, 'success');
      } else {
        showToast('Invalid promo code. Try NEON20 or FRESH10', 'error');
      }
    });

    // Checkout Form
    DOM.checkoutBtn.addEventListener('click', openCheckoutModal);
    DOM.checkoutCloseBtn.addEventListener('click', closeCheckoutModal);
    DOM.checkoutForm.addEventListener('submit', handleOrderSubmission);

    // Delivery Slots
    DOM.deliverySlots.forEach(slot => {
      slot.addEventListener('click', () => {
        DOM.deliverySlots.forEach(s => s.classList.remove('active'));
        slot.classList.add('active');
      });
    });

    // Payment Methods
    DOM.paymentCards.forEach(card => {
      card.addEventListener('click', () => {
        DOM.paymentCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // Modal Background Clicks to Dismiss
    [DOM.quickViewModal, DOM.checkoutModal, DOM.droneTrackerModal, DOM.profileModal, DOM.addProductModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    });

    DOM.droneCloseBtn.addEventListener('click', closeDroneTracker);
    DOM.quickViewCloseBtn.addEventListener('click', closeQuickView);

    // Custom Crate Studio Box Picker
    DOM.crateTypeCards.forEach(card => {
      card.addEventListener('click', () => {
        DOM.crateTypeCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        STATE.customCrate.boxType = card.dataset.boxName;
      });
    });

    // Custom Crate Studio Item Picking
    DOM.builderItemsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.mini-pick-card');
      if (!card) return;
      const product = getAllProducts().find(p => p.id === card.dataset.id);
      if (product) addItemToCustomCrate(product);
    });

    // Custom Crate Tray Remove
    document.querySelector('.crate-assembly-tray').addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.slot-remove-btn');
      if (!removeBtn) return;
      const idx = parseInt(removeBtn.dataset.slotIdx, 10);
      removeItemFromCustomCrate(idx);
    });

    DOM.addCustomCrateBtn.addEventListener('click', addCustomCrateToCart);

    // Wishlist Header Button Quick Filter
    DOM.wishlistBtn.addEventListener('click', () => {
      if (STATE.wishlist.length === 0) {
        showToast('Your Favorites list is currently empty! Heart any item to save it.', 'info');
        return;
      }
      DOM.searchInput.value = '';
      STATE.filters.search = '';
      STATE.filters.category = 'all';
      STATE.filters.dietary = 'all';

      const favs = getAllProducts().filter(p => STATE.wishlist.includes(p.id));
      DOM.productCountLabel.textContent = `Favorites (${favs.length} items)`;
      DOM.productGrid.innerHTML = favs.map(item => `
        <div class="product-card" data-id="${item.id}">
          <div class="product-card-top">
            <img src="${item.image}" alt="${item.title}" class="product-img" />
            <button class="wishlist-btn active" data-action="wishlist" data-id="${item.id}">❤️</button>
            <button class="quick-view-trigger" data-action="quickview" data-id="${item.id}">Quick View 👁️</button>
          </div>
          <div class="product-category-label">${item.category.toUpperCase()}</div>
          <h4 class="product-title">${item.title}</h4>
          <div class="product-unit">${item.unit}</div>
          <div class="product-rating"><span>⭐ ${item.rating.toFixed(1)}</span></div>
          <div class="product-card-bottom">
            <div class="price-box"><span class="current-price">${formatMoney(item.price)}</span></div>
            <button class="add-btn" data-action="add-to-cart" data-id="${item.id}">+ Add 🛒</button>
          </div>
        </div>
      `).join('');

      showToast(`Showing ${favs.length} saved favorite items!`, 'info');
    });
  }

  /* ==========================================================================
     Application Initialization
     ========================================================================== */
  async function init() {
    applyTheme(STATE.theme);
    updateUserHeaderUI();
    await loadServerProducts();
    renderProducts();
    updateCartDrawerUI();
    renderCrateBuilder();
    setupEventListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
