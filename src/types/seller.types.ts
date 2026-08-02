export interface ProductCredentials {
  login_email?: string;
  username?: string;
  password?: string;
  two_factor_code?: string;
  backup_codes?: string;
  recovery_email?: string;
  recovery_phone?: string;
  extra_information?: string;
  extra_notes?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  seller_id: number;
  category_id: number;
  title: string;
  short_description?: string;
  long_description?: string;
  price: number;
  discount?: number;
  cover_image?: string;
  gallery_images?: string[];
  server?: string;
  region?: string;
  platform?: string;
  rank?: string;
  level?: string;
  character?: string;
  skin_count?: number;
  item_count?: number;
  stock?: number;
  auto_delivery: boolean;
  manual_delivery: boolean;
  instant_delivery: boolean;
  delivery_time?: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  status: 'available' | 'hidden' | 'draft' | 'archived' | 'sold';
  credentials?: ProductCredentials;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  price: number;
  quantity: number;
  product?: Product;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Order {
  id: number;
  order_number: string;
  buyer_id: number;
  seller_id: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'delivering' | 'completed' | 'cancelled' | 'refunded';
  delivery_method: 'auto' | 'manual';
  created_at: string;
  updated_at: string;
  buyer?: User;
  items?: OrderItem[];
}

export interface DashboardStats {
  totalSales: number;
  todayRevenue: number;
  totalProducts: number;
  activeProducts: number;
  pendingOrders: number;
  completedOrders: number;
  totalOrders: number;
  averageRating: number;
  totalReviews: number;
  walletBalance: number;
  conversionRate: number;
  unreadMessages: number;
}

export interface SellerSettings {
  store_logo?: string;
  store_banner?: string;
  display_name?: string;
  description?: string;
  country?: string;
  languages?: string[];
  social_links?: any;
  notification_settings?: any;
}
