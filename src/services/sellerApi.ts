import api from './api';
import type {
  SellerStats,
  Product,
  CreateProductDto,
  Order,
  ProductReview,
  Conversation,
  SellerMessage,
  SellerSettings,
  AnalyticsData,
  PaginatedResponse,
  SellerPermission
} from '../types/seller';

const sellerApi = {
  // Permission check
  checkPermission: async (): Promise<SellerPermission> => {
    const response = await api.get('/seller/check-permission');
    return response.data;
  },

  // Dashboard
  getDashboardStats: async (): Promise<{ stats: SellerStats }> => {
    const response = await api.get('/seller/dashboard');
    return response.data;
  },

  getAnalytics: async (period: string = '30days'): Promise<AnalyticsData> => {
    const response = await api.get('/seller/analytics', { params: { period } });
    return response.data;
  },

  // Products
  getProducts: async (params?: {
    search?: string;
    status?: string;
    category_id?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get('/seller/products', { params });
    return response.data;
  },

  createProduct: async (data: CreateProductDto): Promise<{ message: string; product: Product }> => {
    const response = await api.post('/seller/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: Partial<CreateProductDto>): Promise<{ message: string; product: Product }> => {
    const response = await api.put(`/seller/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/seller/products/${id}`);
    return response.data;
  },

  bulkActions: async (action: 'hide' | 'show' | 'delete' | 'archive', productIds: number[]): Promise<{ message: string }> => {
    const response = await api.post('/seller/products/bulk-actions', {
      action,
      product_ids: productIds
    });
    return response.data;
  },

  // Orders
  getOrders: async (params?: {
    status?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await api.get('/seller/orders', { params });
    return response.data;
  },

  getOrderDetails: async (id: number): Promise<{ order: Order }> => {
    const response = await api.get(`/seller/orders/${id}`);
    return response.data;
  },

  // Reviews
  getReviews: async (params?: {
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<ProductReview>> => {
    const response = await api.get('/seller/reviews', { params });
    return response.data;
  },

  replyToReview: async (id: number, reply: string): Promise<{ message: string; review: ProductReview }> => {
    const response = await api.post(`/seller/reviews/${id}/reply`, { reply });
    return response.data;
  },

  // Messages
  getMessages: async (): Promise<{ conversations: Conversation[] }> => {
    const response = await api.get('/seller/messages');
    return response.data;
  },

  getConversation: async (userId: number): Promise<{ messages: SellerMessage[] }> => {
    const response = await api.get(`/seller/messages/${userId}`);
    return response.data;
  },

  sendMessage: async (recipientId: number, message: string, attachments?: string[]): Promise<{ message: string; data: SellerMessage }> => {
    const response = await api.post('/seller/messages', {
      recipient_id: recipientId,
      message,
      attachments
    });
    return response.data;
  },

  // Settings
  getSettings: async (): Promise<{ settings: SellerSettings }> => {
    const response = await api.get('/seller/settings');
    return response.data;
  },

  updateSettings: async (data: Partial<SellerSettings>): Promise<{ message: string; settings: SellerSettings }> => {
    const response = await api.put('/seller/settings', data);
    return response.data;
  },
};

export default sellerApi;
