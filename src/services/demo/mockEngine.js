// ANX Marketplace - Axios Mock Request Interceptor Router

import { DEMO_USERS, DEMO_TESTIMONIALS } from './mockData';
import {
  getDemoProducts,
  createDemoProduct,
  updateDemoProduct,
  deleteDemoProduct,
  getDemoCategories,
  getDemoOrders,
  createDemoOrder,
  getDemoOrderDetails,
  confirmDemoOrderDelivery,
  getDemoSellerStats,
  getDemoAnalytics,
  getDemoReviews,
  replyDemoReview,
  getDemoMessages,
  sendDemoMessage,
  getDemoNotifications
} from './mockStorage';

// Simulated latency delay (350ms)
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleMockRequest = async (config) => {
  await delay(350);

  const url = (config.url || '').replace(/^(?:https?:\/\/[^\/]+)?(?:\/api)?/, '');
  const method = (config.method || 'get').toLowerCase();
  let data = {};

  try {
    if (typeof config.data === 'string') {
      data = JSON.parse(config.data);
    } else if (config.data) {
      data = config.data;
    }
  } catch (e) {
    data = {};
  }

  // Parse params
  const params = config.params || {};

  // --- Auth Endpoints ---
  if (url === '/auth/login' && method === 'post') {
    const email = (data.email || '').toLowerCase();
    let user = DEMO_USERS.customer;
    if (email.includes('seller')) {
      user = DEMO_USERS.seller;
    } else if (email.includes('admin')) {
      user = DEMO_USERS.admin;
    }

    const token = `demo-jwt-token-${user.role}-${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      data: {
        success: true,
        message: 'Login successful (Demo Mode)',
        user,
        token
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/auth/register' && method === 'post') {
    const newUser = {
      id: Date.now(),
      name: data.name || 'New Member',
      email: data.email || 'user@demo.com',
      role: 'user',
      avatar: '/customer-avatar.jpg',
      store_credit: 50.00,
      points: 100,
      created_at: new Date().toISOString()
    };

    const token = `demo-jwt-token-user-${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));

    return {
      data: {
        success: true,
        message: 'Registration successful (Demo Mode)',
        user: newUser,
        token
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/auth/me' && method === 'get') {
    const savedUser = localStorage.getItem('user');
    const user = savedUser ? JSON.parse(savedUser) : DEMO_USERS.customer;
    return {
      data: {
        success: true,
        user
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/auth/logout' && method === 'post') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      data: { success: true, message: 'Logged out' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/auth/profile' && method === 'post') {
    const savedUser = localStorage.getItem('user');
    const current = savedUser ? JSON.parse(savedUser) : DEMO_USERS.customer;
    const updated = { ...current, name: data.name || current.name, email: data.email || current.email };
    localStorage.setItem('user', JSON.stringify(updated));
    return {
      data: { success: true, message: 'Profile updated successfully', user: updated },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // --- Products & Catalog ---
  if (url === '/categories' && method === 'get') {
    const categories = getDemoCategories();
    return {
      data: { success: true, data: categories, categories },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/testimonials' && method === 'get') {
    return {
      data: { success: true, data: DEMO_TESTIMONIALS },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/products/trending' && method === 'get') {
    const products = getDemoProducts();
    const trending = products.slice(0, 4);
    return {
      data: { success: true, data: trending, products: trending },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if ((url === '/products' || url.startsWith('/products?')) && method === 'get') {
    const products = getDemoProducts(params);
    return {
      data: { success: true, data: products, products },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  const singleProductMatch = url.match(/^\/products\/(\d+)$/);
  if (singleProductMatch && method === 'get') {
    const id = Number(singleProductMatch[1]);
    const products = getDemoProducts();
    const product = products.find((p) => p.id === id) || products[0];
    return {
      data: { success: true, data: product, product },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // --- Orders ---
  if (url === '/orders' && method === 'get') {
    const orders = getDemoOrders(params);
    return {
      data: { success: true, data: orders, orders },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/orders' && method === 'post') {
    const newOrder = createDemoOrder(data);
    return {
      data: { success: true, message: 'Order created successfully', data: newOrder, order: newOrder },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  const singleOrderMatch = url.match(/^\/orders\/(\d+)$/);
  if (singleOrderMatch && method === 'get') {
    const id = Number(singleOrderMatch[1]);
    const order = getDemoOrderDetails(id);
    return {
      data: { success: true, data: order, order },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  const confirmDeliveryMatch = url.match(/^\/orders\/(\d+)\/confirm-delivery$/);
  if (confirmDeliveryMatch && method === 'post') {
    const id = Number(confirmDeliveryMatch[1]);
    const updated = confirmDemoOrderDelivery(id);
    return {
      data: { success: true, message: 'Delivery confirmed! Payment released.', order: updated },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // --- Seller Hub Endpoints ---
  if (url === '/seller/check-permission' && method === 'get') {
    return {
      data: { success: true, is_seller: true, is_admin: false, permissions: ['all'] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/seller/dashboard' && method === 'get') {
    const stats = getDemoSellerStats();
    return {
      data: { success: true, stats, data: stats },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url.startsWith('/seller/analytics') && method === 'get') {
    const analytics = getDemoAnalytics();
    return {
      data: { success: true, ...analytics, data: analytics },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url.startsWith('/seller/products') && method === 'get') {
    const products = getDemoProducts(params);
    return {
      data: {
        success: true,
        data: products,
        total: products.length,
        from: 1,
        to: products.length,
        current_page: 1,
        last_page: 1,
        per_page: 15
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/seller/products' && method === 'post') {
    const newProd = createDemoProduct(data);
    return {
      data: { success: true, message: 'Product created successfully', product: newProd },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  const sellerUpdateProdMatch = url.match(/^\/seller\/products\/(\d+)$/);
  if (sellerUpdateProdMatch && (method === 'put' || method === 'post')) {
    const id = Number(sellerUpdateProdMatch[1]);
    const updated = updateDemoProduct(id, data);
    return {
      data: { success: true, message: 'Product updated successfully', product: updated },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (sellerUpdateProdMatch && method === 'delete') {
    const id = Number(sellerUpdateProdMatch[1]);
    deleteDemoProduct(id);
    return {
      data: { success: true, message: 'Product deleted successfully' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/seller/products/bulk-actions' && method === 'post') {
    return {
      data: { success: true, message: 'Bulk action completed' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url.startsWith('/seller/orders') && method === 'get') {
    const orders = getDemoOrders(params);
    return {
      data: {
        success: true,
        data: orders,
        total: orders.length,
        from: 1,
        to: orders.length,
        current_page: 1,
        last_page: 1,
        per_page: 15
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url.startsWith('/seller/reviews') && method === 'get') {
    const reviews = getDemoReviews();
    return {
      data: { success: true, data: reviews, total: reviews.length, from: 1, to: reviews.length, current_page: 1, last_page: 1, per_page: 15 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  const replyReviewMatch = url.match(/^\/seller\/reviews\/(\d+)\/reply$/);
  if (replyReviewMatch && method === 'post') {
    const id = Number(replyReviewMatch[1]);
    const review = replyDemoReview(id, data.reply);
    return {
      data: { success: true, message: 'Reply submitted', review },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/seller/messages' && method === 'get') {
    const conversations = getDemoMessages();
    return {
      data: { success: true, conversations },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/seller/messages' && method === 'post') {
    const msg = sendDemoMessage(data.recipient_id, data.message);
    return {
      data: { success: true, message: 'Message sent', data: msg },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url.startsWith('/seller/notifications') && method === 'get') {
    const notifications = getDemoNotifications();
    return {
      data: { success: true, data: notifications, total: notifications.length, from: 1, to: notifications.length, current_page: 1, last_page: 1, per_page: 15 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/seller/settings' && method === 'get') {
    return {
      data: {
        success: true,
        settings: {
          store_name: 'Vanguard Pro Vault',
          display_name: 'Vanguard Gaming',
          store_description: 'Top Tier Verified Game Accounts',
          payout_method: 'bakong_qr',
          email_orders: true,
          push_orders: true
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // --- Admin Endpoints ---
  if (url === '/admin/dashboard' && method === 'get') {
    return {
      data: {
        success: true,
        stats: {
          totalUsers: 1420,
          totalSellers: 85,
          pendingSellers: 3,
          totalProducts: 420,
          totalOrders: 980,
          totalRevenue: 45200.00
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/admin/seller-requests' && method === 'get') {
    return {
      data: {
        success: true,
        data: [
          { id: 1, name: 'Pro Vault KH', email: 'provault@gmail.com', status: 'pending', created_at: '2026-08-01' }
        ]
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  if (url === '/admin/users' && method === 'get') {
    return {
      data: {
        success: true,
        data: [
          DEMO_USERS.customer,
          DEMO_USERS.seller,
          DEMO_USERS.admin
        ]
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // Safe Default Response Handler for any unhandled routes
  return {
    data: {
      success: true,
      message: 'Demo Mode endpoint response',
      data: [],
      items: []
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config
  };
};
