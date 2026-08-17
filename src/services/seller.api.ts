import api from './api';
import { Product, Order, DashboardStats, SellerSettings } from '../types/seller.types';

export const sellerApi = {
  // Dashboard
  getDashboardStats: async () => {
    const { data } = await api.get<{ stats: DashboardStats }>('/seller/dashboard');
    return data.stats;
  },

  getAnalytics: async (period: string = '30days') => {
    const { data } = await api.get(`/seller/analytics?period=${period}`);
    return data;
  },

  // Products
  getProducts: async (params?: any) => {
    const { data } = await api.get('/seller/products', { params });
    return data; // Returns paginated data
  },

  createProduct: async (productData: any) => {
    if (productData instanceof FormData) {
      const { data } = await api.post('/seller/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
    const { data } = await api.post('/seller/products', productData);
    return data;
  },

  updateProduct: async (id: number, productData: any) => {
    if (productData instanceof FormData) {
      const { data } = await api.post(`/seller/products/${id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
    const { data } = await api.put(`/seller/products/${id}`, productData);
    return data;
  },

  deleteProduct: async (id: number) => {
    const { data } = await api.delete(`/seller/products/${id}`);
    return data;
  },

  bulkActionProducts: async (action: 'hide' | 'show' | 'delete' | 'archive', productIds: number[]) => {
    const { data } = await api.post('/seller/products/bulk-actions', { action, product_ids: productIds });
    return data;
  },

  // Orders
  getOrders: async (params?: any) => {
    const { data } = await api.get('/seller/orders', { params });
    return data; // Returns paginated data
  },

  getOrderDetails: async (id: number) => {
    const { data } = await api.get<{ order: Order }>(`/seller/orders/${id}`);
    return data.order;
  },

  // Reviews
  getReviews: async (params?: any) => {
    const { data } = await api.get('/seller/reviews', { params });
    return data; // Paginated data
  },

  replyToReview: async (id: number, reply: string) => {
    const { data } = await api.post(`/seller/reviews/${id}/reply`, { reply });
    return data;
  },

  // Messages
  getConversations: async () => {
    const { data } = await api.get('/seller/messages');
    return data.conversations;
  },

  getConversation: async (userId: number) => {
    const { data } = await api.get(`/seller/messages/${userId}`);
    return data.messages;
  },

  sendMessage: async (recipientId: number, message: string, attachments?: any[]) => {
    const { data } = await api.post('/seller/messages', { recipient_id: recipientId, message, attachments });
    return data;
  },

  // Settings
  getSettings: async () => {
    const { data } = await api.get<{ settings: SellerSettings }>('/seller/settings');
    return data.settings;
  },

  updateSettings: async (settingsData: any) => {
    if (settingsData instanceof FormData) {
      const { data } = await api.post('/seller/settings?_method=PUT', settingsData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }
    const { data } = await api.put('/seller/settings', settingsData);
    return data;
  },

  // Deliveries
  getDeliveries: async (page: number = 1) => {
    const { data } = await api.get(`/seller/deliveries?page=${page}`);
    return data;
  },

  submitDelivery: async (orderId: number, deliveryData: { delivery_text: string; instructions?: string; proof_files?: string[] }) => {
    const { data } = await api.post(`/seller/deliveries/${orderId}`, deliveryData);
    return data;
  },

  // Notifications
  getNotifications: async (page: number = 1) => {
    const { data } = await api.get(`/seller/notifications?page=${page}`);
    return data;
  },

  markNotificationRead: async (id: string) => {
    const { data } = await api.put(`/seller/notifications/${id}/read`);
    return data;
  },

  markAllNotificationsRead: async () => {
    const { data } = await api.put('/seller/notifications/read-all');
    return data;
  },

  // Permissions
  checkPermission: async () => {
    const { data } = await api.get('/seller/check-permission');
    return data;
  }
};
