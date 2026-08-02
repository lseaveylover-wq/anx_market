// ANX Marketplace - Demo Mode LocalStorage State Manager

import {
  DEMO_USERS,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_ORDERS,
  DEMO_SELLER_STATS,
  DEMO_ANALYTICS,
  DEMO_REVIEWS,
  DEMO_NOTIFICATIONS,
  DEMO_MESSAGES
} from './mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'anx_demo_products',
  CATEGORIES: 'anx_demo_categories',
  ORDERS: 'anx_demo_orders',
  SELLER_STATS: 'anx_demo_seller_stats',
  REVIEWS: 'anx_demo_reviews',
  NOTIFICATIONS: 'anx_demo_notifications',
  MESSAGES: 'anx_demo_messages',
  CURRENT_USER: 'user',
  TOKEN: 'token',
  DEMO_SESSION_ROLE: 'anx_demo_active_role'
};

// Initialize LocalStorage with default datasets if missing
export const initDemoStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEMO_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEMO_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEMO_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SELLER_STATS)) {
    localStorage.setItem(STORAGE_KEYS.SELLER_STATS, JSON.stringify(DEMO_SELLER_STATS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEMO_REVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEMO_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(DEMO_MESSAGES));
  }
};

// Generic Helpers
const getItem = (key, fallback) => {
  initDemoStorage();
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to set demo storage:', e);
  }
};

// --- API Query & Mutation Handlers ---

export const getDemoProducts = (params = {}) => {
  let products = getItem(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);

  // Search filter
  if (params.search) {
    const q = params.search.toLowerCase();
    products = products.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      (p.short_description && p.short_description.toLowerCase().includes(q)) ||
      (p.category && p.category.name.toLowerCase().includes(q))
    );
  }

  // Category filter
  if (params.category_id && params.category_id !== 'all') {
    products = products.filter((p) => String(p.category_id) === String(params.category_id));
  }

  // Status filter
  if (params.status) {
    products = products.filter((p) => p.status === params.status);
  }

  // Sorting
  if (params.sort_by === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (params.sort_by === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (params.sort_by === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  }

  return products;
};

export const createDemoProduct = (productData) => {
  const products = getItem(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);
  const categories = getItem(STORAGE_KEYS.CATEGORIES, DEMO_CATEGORIES);

  const matchedCat = categories.find((c) => String(c.id) === String(productData.category_id)) || {
    id: Number(productData.category_id) || 1,
    name: 'Gaming Account'
  };

  const newProduct = {
    id: Date.now(),
    title: productData.title || 'Untitled Game Account',
    slug: (productData.title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category_id: Number(productData.category_id) || 1,
    category: matchedCat,
    seller_id: 202,
    seller: { id: 202, name: 'Vanguard Gaming Store', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100' },
    price: Number(productData.price) || 29.99,
    original_price: Number(productData.original_price || productData.price) || 35.00,
    stock: Number(productData.stock) || 5,
    rating: 5.0,
    reviews_count: 0,
    server: productData.server || 'Global',
    platform: productData.platform || 'PC',
    rank: productData.rank || 'Max Rank',
    skin_count: Number(productData.skin_count) || 0,
    image_url: productData.image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
    short_description: productData.short_description || productData.description || 'Full account access included.',
    long_description: productData.long_description || 'Instant delivery with full credentials guarantee.',
    status: 'active',
    featured: false
  };

  products.unshift(newProduct);
  setItem(STORAGE_KEYS.PRODUCTS, products);
  return newProduct;
};

export const updateDemoProduct = (id, updateData) => {
  const products = getItem(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);
  const index = products.findIndex((p) => p.id === Number(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...updateData };
    setItem(STORAGE_KEYS.PRODUCTS, products);
    return products[index];
  }
  return null;
};

export const deleteDemoProduct = (id) => {
  const products = getItem(STORAGE_KEYS.PRODUCTS, DEMO_PRODUCTS);
  const updated = products.filter((p) => p.id !== Number(id));
  setItem(STORAGE_KEYS.PRODUCTS, updated);
  return true;
};

export const getDemoCategories = () => {
  return getItem(STORAGE_KEYS.CATEGORIES, DEMO_CATEGORIES);
};

export const getDemoOrders = (params = {}) => {
  let orders = getItem(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
  if (params.status) {
    orders = orders.filter((o) => o.status === params.status);
  }
  return orders;
};

export const createDemoOrder = (orderData) => {
  const orders = getItem(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
  const newOrder = {
    id: Date.now(),
    order_number: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    status: 'pending_payment',
    total_amount: Number(orderData.total_amount || orderData.price || 0),
    total_price: Number(orderData.total_amount || orderData.price || 0),
    created_at: new Date().toISOString(),
    items: orderData.items || [
      {
        id: 1,
        title: orderData.product?.title || 'Game Account Order',
        price: Number(orderData.price || 0),
        quantity: Number(orderData.quantity || 1),
        product: orderData.product || DEMO_PRODUCTS[0]
      }
    ]
  };

  orders.unshift(newOrder);
  setItem(STORAGE_KEYS.ORDERS, orders);
  return newOrder;
};

export const getDemoOrderDetails = (id) => {
  const orders = getItem(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
  return orders.find((o) => o.id === Number(id)) || orders[0];
};

export const confirmDemoOrderDelivery = (id) => {
  const orders = getItem(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
  const index = orders.findIndex((o) => o.id === Number(id));
  if (index !== -1) {
    orders[index].status = 'completed';
    orders[index].credentials = orders[index].credentials || {
      username: 'vanguard_vault_user',
      password: 'DemoVaultPassword2026!',
      email: 'demo_vault@anxmarket.com'
    };
    setItem(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  }
  return null;
};

export const getDemoSellerStats = () => {
  return getItem(STORAGE_KEYS.SELLER_STATS, DEMO_SELLER_STATS);
};

export const getDemoAnalytics = () => {
  return DEMO_ANALYTICS;
};

export const getDemoReviews = () => {
  return getItem(STORAGE_KEYS.REVIEWS, DEMO_REVIEWS);
};

export const replyDemoReview = (id, replyText) => {
  const reviews = getItem(STORAGE_KEYS.REVIEWS, DEMO_REVIEWS);
  const index = reviews.findIndex((r) => r.id === Number(id));
  if (index !== -1) {
    reviews[index].seller_reply = replyText;
    setItem(STORAGE_KEYS.REVIEWS, reviews);
    return reviews[index];
  }
  return null;
};

export const getDemoMessages = () => {
  return getItem(STORAGE_KEYS.MESSAGES, DEMO_MESSAGES);
};

export const sendDemoMessage = (recipientId, text) => {
  const conversations = getItem(STORAGE_KEYS.MESSAGES, DEMO_MESSAGES);
  const newMsg = {
    id: Date.now(),
    sender_id: 202,
    text,
    created_at: new Date().toISOString()
  };

  if (conversations.length > 0) {
    conversations[0].messages.push(newMsg);
    conversations[0].last_message = text;
    conversations[0].updated_at = new Date().toISOString();
  }

  setItem(STORAGE_KEYS.MESSAGES, conversations);
  return newMsg;
};

export const getDemoNotifications = () => {
  return getItem(STORAGE_KEYS.NOTIFICATIONS, DEMO_NOTIFICATIONS);
};
