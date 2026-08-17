// ANX Marketplace - Realistic Demo Datasets

export const DEMO_USERS = {
  customer: {
    id: 101,
    name: 'Alex Mercer',
    email: 'customer@demo.com',
    role: 'user',
    avatar: '/customer-avatar.jpg',
    store_credit: 150.00,
    points: 730,
    created_at: '2026-01-15T10:00:00Z'
  },
  seller: {
    id: 202,
    name: 'Vanguard Gaming Store',
    email: 'seller@demo.com',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80',
    store_name: 'Vanguard Pro Vault',
    store_rating: 4.9,
    store_credit: 2450.00,
    points: 3420,
    created_at: '2025-11-01T10:00:00Z'
  },
  admin: {
    id: 303,
    name: 'System Administrator',
    email: 'admin@demo.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    store_credit: 9999.00,
    points: 10000,
    created_at: '2025-01-01T10:00:00Z'
  }
};

export const DEMO_CATEGORIES = [
  { id: 1, name: 'Valorant Accounts', slug: 'valorant', icon: '🎯', description: 'Ranked Radiant & Immortal Accounts', offers: '1,240 offers' },
  { id: 2, name: 'Mobile Legends Accounts', slug: 'mobile-legends', icon: '📱', description: 'Mythic Glory Accounts & Diamonds', offers: '850 offers' },
  { id: 3, name: 'GTA V Modded Accounts', slug: 'gta-v', icon: '🚗', description: 'Modded Money & Level 1000 Accounts', offers: '420 offers' },
  { id: 4, name: 'EA Sports FC Coins', slug: 'ea-fc', icon: '⚽', description: 'Ultimate Team Accounts & Coins', offers: '310 offers' },
  { id: 5, name: 'Genshin Impact Accounts', slug: 'genshin-impact', icon: '⚔️', description: 'AR60 Whale Accounts', offers: '215 offers' },
  { id: 6, name: 'Roblox Robux & Items', slug: 'roblox', icon: '🧱', description: 'Robux & Limited Item Accounts', offers: '540 offers' },
  { id: 7, name: 'Fortnite Skin Accounts', slug: 'fortnite', icon: '⚡', description: 'OG Skin Accounts & V-Bucks', offers: '390 offers' },
  { id: 8, name: 'Steam Wallet & Cards', slug: 'steam', icon: '🎮', description: 'Steam Wallet Codes & Loaded Accounts', offers: '680 offers' }
];

export const DEMO_PRODUCTS = [
  {
    id: 1,
    title: 'Valorant Radiant Account (Full Email Access)',
    slug: 'valorant-radiant-full-access',
    category_id: 1,
    category: { id: 1, name: 'Valorant' },
    seller_id: 202,
    seller: { id: 202, name: 'Vanguard Gaming Store', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100' },
    price: 249.99,
    original_price: 299.99,
    stock: 5,
    rating: 4.95,
    reviews_count: 128,
    server: 'Asia / SEA',
    platform: 'PC',
    rank: 'Radiant #340',
    skin_count: 45,
    image_url: '/images/products/Steam.png',
    image: '/images/products/Steam.png',
    cover_image: '/images/products/Steam.png',
    short_description: 'Stacked Radiant account with Vandal Prime, Reaver Vandal & Karambit Knife.',
    long_description: 'Instant automated delivery. Full access email included. Change username and password immediately. Account clean with zero bans.',
    status: 'active',
    featured: true
  },
  {
    id: 2,
    title: 'Mobile Legends Mythical Glory (120+ Heroes)',
    slug: 'mlbb-mythical-glory-120-heroes',
    category_id: 2,
    category: { id: 2, name: 'Mobile Legends' },
    seller_id: 202,
    seller: { id: 202, name: 'Vanguard Gaming Store', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100' },
    price: 65.00,
    original_price: 85.00,
    stock: 12,
    rating: 4.88,
    reviews_count: 94,
    server: 'Global / SEA',
    platform: 'Mobile (Android/iOS)',
    rank: 'Mythical Glory 1200+ pts',
    skin_count: 150,
    image_url: '/images/products/Steam.png',
    image: '/images/products/Steam.png',
    cover_image: '/images/products/Steam.png',
    short_description: 'Collector Skins, Legend Skins (Gusion & Lesley) + Max Emblem Setup.',
    long_description: 'Moonton account fully unlinked. Bind your personal Gmail or Facebook instantly upon receipt.',
    status: 'active',
    featured: true
  },
  {
    id: 3,
    title: 'GTA V Online Modded Money ($500M + Lvl 500)',
    slug: 'gta-v-modded-money-level-500',
    category_id: 3,
    category: { id: 3, name: 'GTA V' },
    seller_id: 202,
    seller: { id: 202, name: 'Vanguard Gaming Store', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100' },
    price: 40.00,
    original_price: 60.00,
    stock: 20,
    rating: 4.92,
    reviews_count: 215,
    server: 'Global',
    platform: 'PC / PS5 / Xbox Series X',
    rank: 'Level 500',
    skin_count: 0,
    image_url: '/images/products/Steam.png',
    image: '/images/products/Steam.png',
    cover_image: '/images/products/Steam.png',
    short_description: '$500,000,000 In-Bank Cash, All Garages Filled with Oppressor MkII & Supercars.',
    long_description: 'Safe money boost with anti-cheat protection guarantee. Complete account handover or recovery service.',
    status: 'active',
    featured: true
  },
  {
    id: 4,
    title: 'EA Sports FC 24 Ultimate Team (2.5M Coins)',
    slug: 'ea-fc-24-ultimate-team-coins',
    category_id: 4,
    category: { id: 4, name: 'EA Sports FC' },
    seller_id: 202,
    seller: { id: 202, name: 'Vanguard Gaming Store', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100' },
    price: 45.00,
    original_price: 55.00,
    stock: 8,
    rating: 4.79,
    reviews_count: 67,
    server: 'Global',
    platform: 'PC / Console',
    rank: 'Division 1',
    skin_count: 0,
    image_url: '/images/products/EA-Sport.png',
    image: '/images/products/EA-Sport.png',
    cover_image: '/images/products/EA-Sport.png',
    short_description: '2.5 Million Tradeable Coins + TOTY Mbappé & Icon Ronaldinho.',
    long_description: 'Safe comfort trade method. Zero ban record guarantee.',
    status: 'active',
    featured: false
  },
  {
    id: 5,
    title: 'Genshin Impact AR60 Whale (25x 5-Star Characters)',
    slug: 'genshin-impact-ar60-whale',
    category_id: 5,
    category: { id: 5, name: 'Genshin Impact' },
    seller_id: 202,
    seller: { id: 202, name: 'Vanguard Gaming Store', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100' },
    price: 180.00,
    original_price: 220.00,
    stock: 3,
    rating: 4.98,
    reviews_count: 42,
    server: 'Asia',
    platform: 'PC / Mobile / PS5',
    rank: 'Adventure Rank 60',
    skin_count: 6,
    image_url: '/images/products/Genshin-Impact.png',
    image: '/images/products/Genshin-Impact.png',
    cover_image: '/images/products/Genshin-Impact.png',
    short_description: 'C6 Raiden Shogun, C2 Kazuha, Staff of Homa R5 + 40,000 Primogems.',
    long_description: 'Clean Hoyoverse login without third-party links. Full email control transferred upon checkout.',
    status: 'active',
    featured: true
  },
  {
    id: 6,
    title: 'Steam $100 USD Gift Card (Global Code)',
    slug: 'steam-100-usd-gift-card',
    category_id: 8,
    category: { id: 8, name: 'Steam' },
    seller_id: 202,
    seller: { id: 202, name: 'Vanguard Gaming Store', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100' },
    price: 92.50,
    original_price: 100.00,
    stock: 50,
    rating: 5.0,
    reviews_count: 530,
    server: 'Global',
    platform: 'Steam PC',
    rank: 'N/A',
    skin_count: 0,
    image_url: '/images/products/Steam.png',
    image: '/images/products/Steam.png',
    cover_image: '/images/products/Steam.png',
    short_description: 'Instant digital code delivery. Redeemable on any Steam region.',
    long_description: 'Official Steam Wallet Code. Redeem directly in Steam client under Account Details -> Add Funds.',
    status: 'active',
    featured: false
  }
];

export const DEMO_ORDERS = [
  {
    id: 9001,
    order_number: 'ORD-6A6DB31F7A4B6',
    status: 'completed',
    total_amount: 0.01,
    total_price: 0.01,
    created_at: '2026-08-01T14:30:00Z',
    items: [
      {
        id: 1,
        title: 'qwsdwd',
        price: 0.01,
        quantity: 1,
        product: DEMO_PRODUCTS[0]
      }
    ],
    credentials: {
      username: 'vanguard_val_99',
      password: 'PassWord2026!',
      email: 'radiant_vault_99@gmail.com'
    }
  },
  {
    id: 9002,
    order_number: 'ORD-6A6DAD99A8E3B',
    status: 'completed',
    total_amount: 0.01,
    total_price: 0.01,
    created_at: '2026-08-01T16:20:00Z',
    items: [
      {
        id: 2,
        title: '212',
        price: 0.01,
        quantity: 1,
        product: DEMO_PRODUCTS[1]
      }
    ],
    credentials: {
      username: 'mlbb_mythic_pro',
      password: 'MlbbPassword2026!',
      email: 'mythic_pro_vault@moonton.com'
    }
  },
  {
    id: 9003,
    order_number: 'ORD-6A6D73AA5A2C7',
    status: 'completed',
    total_amount: 65.00,
    total_price: 65.00,
    created_at: '2026-08-02T11:15:00Z',
    items: [
      {
        id: 3,
        title: 'Mobile Legends Mythical Glory (120+ Heroes)',
        price: 65.00,
        quantity: 1,
        product: DEMO_PRODUCTS[1]
      }
    ],
    credentials: {
      username: 'legendary_ml_star',
      password: 'SecureMlbbPass99!',
      email: 'star_vault_120@gmail.com'
    }
  },
  {
    id: 9004,
    order_number: 'ORD-6A6E881B99F12',
    status: 'pending_payment',
    total_amount: 249.99,
    total_price: 249.99,
    created_at: '2026-08-02T18:00:00Z',
    items: [
      {
        id: 4,
        title: 'Valorant Radiant Account (Full Email Access)',
        price: 249.99,
        quantity: 1,
        product: DEMO_PRODUCTS[0]
      }
    ]
  }
];

export const DEMO_SELLER_STATS = {
  totalOrders: 52,
  completedOrders: 48,
  pendingOrders: 4,
  totalSales: 4850.00,
  monthlyEarnings: 1950.00,
  availableBalance: 2450.00
};

export const DEMO_ANALYTICS = {
  period: '30days',
  totalRevenue: 4850.00,
  totalOrders: 52,
  averageOrderValue: 93.26,
  conversionRate: '4.8%',
  chartData: [
    { label: 'Week 1', sales: 850, orders: 10 },
    { label: 'Week 2', sales: 1200, orders: 14 },
    { label: 'Week 3', sales: 1450, orders: 15 },
    { label: 'Week 4', sales: 1350, orders: 13 }
  ]
};

export const DEMO_REVIEWS = [
  {
    id: 1,
    product_id: 1,
    user: { name: 'DragonSlayer99', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    rating: 5,
    comment: 'Super fast delivery! Account has all the skins as promised and email change worked smoothly.',
    seller_reply: 'Thank you for buying! Enjoy playing in Radiant rank!',
    created_at: '2026-07-28T12:00:00Z'
  },
  {
    id: 2,
    product_id: 2,
    user: { name: 'ProGamer_KH', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
    rating: 5,
    comment: 'Legit seller. Emblem setup is fully maxed out and Moonton ID unlinked properly.',
    seller_reply: null,
    created_at: '2026-07-30T15:30:00Z'
  }
];

export const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Order Received!',
    message: 'Order #ORD-6A6E881B99F12 placed for Valorant Radiant Account.',
    read: false,
    created_at: '2026-08-02T18:00:00Z'
  },
  {
    id: 2,
    title: 'Payout Transferred',
    message: '$65.00 has been released to your available wallet balance.',
    read: true,
    created_at: '2026-08-02T11:20:00Z'
  }
];

export const DEMO_MESSAGES = [
  {
    id: 1,
    user: { id: 101, name: 'Alex Mercer', avatar: '/customer-avatar.jpg' },
    last_message: 'Is the Valorant account email changeable right away?',
    updated_at: '2026-08-02T17:45:00Z',
    unread: 1,
    messages: [
      { id: 101, sender_id: 101, text: 'Hi! Is the Valorant account email changeable right away?', created_at: '2026-08-02T17:45:00Z' },
      { id: 102, sender_id: 202, text: 'Yes! You get full access to the registered email and can change it immediately.', created_at: '2026-08-02T17:46:00Z' }
    ]
  }
];

export const DEMO_TESTIMONIALS = [
  {
    id: 1,
    name: 'Alex Johnson',
    time: '2 hours ago',
    created_at: '2 hours ago',
    message: 'Instant delivery on my Valorant account! Password and email change worked smoothly within 2 minutes.',
    comment: 'Instant delivery on my Valorant account! Password and email change worked smoothly within 2 minutes.'
  },
  {
    id: 2,
    name: 'Srey Leak',
    time: '5 hours ago',
    created_at: '5 hours ago',
    message: 'Best marketplace for MLBB skins. Fast transaction via Bakong KHQR, highly recommended!',
    comment: 'Best marketplace for MLBB skins. Fast transaction via Bakong KHQR, highly recommended!'
  },
  {
    id: 3,
    name: 'David K.',
    time: '1 day ago',
    created_at: '1 day ago',
    message: 'Great seller support and escrow protection. Felt 100% safe purchasing here.',
    comment: 'Great seller support and escrow protection. Felt 100% safe purchasing here.'
  }
];

