// Seller Dashboard Types

export interface SellerStats {
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

export interface Product {
  id: number;
  seller_id: number;
  category_id: number;
  title: string;
  description?: string;
  short_description?: string;
  long_description?: string;
  price: number;
  discount: number;
  image?: string;
  cover_image?: string;
  gallery_images?: string[];
  server?: string;
  region?: string;
  platform?: string;
  rank?: string;
  level?: string;
  character?: string;
  skin_count: number;
  item_count: number;
  stock: number;
  auto_delivery: boolean;
  manual_delivery: boolean;
  instant_delivery: boolean;
  delivery_time: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  status: 'available' | 'hidden' | 'sold' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  category?: Category;
  credentials?: ProductCredential;
  order_items_count?: number;
}

export interface ProductCredential {
  id: number;
  product_id: number;
  login_email?: string;
  username?: string;
  password?: string;
  two_factor_code?: string;
  backup_codes?: string;
  recovery_email?: string;
  recovery_phone?: string;
  extra_information?: string;
  extra_notes?: string;
  is_delivered: boolean;
}

export interface CreateProductDto {
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
  auto_delivery?: boolean;
  manual_delivery?: boolean;
  instant_delivery?: boolean;
  delivery_time?: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  status?: string;
  credentials?: {
    login_email?: string;
    username?: string;
    password?: string;
    two_factor_code?: string;
    backup_codes?: string;
    recovery_email?: string;
    recovery_phone?: string;
    extra_information?: string;
    extra_notes?: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
}

export interface Order {
  id: number;
  order_number: string;
  buyer_id: number;
  seller_id: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'delivering' | 'completed' | 'cancelled' | 'refunded';
  created_at: string;
  updated_at: string;
  buyer?: User;
  seller?: User;
  items?: OrderItem[];
  payment?: Payment;
  status_history?: OrderStatusHistory[];
  escrow_transaction?: EscrowTransaction;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  price: number;
  product?: Product;
}

export interface Payment {
  id: number;
  user_id: number;
  order_id: number;
  amount: number;
  payment_method: string;
  status: string;
  transaction_id?: string;
  created_at: string;
}

export interface OrderStatusHistory {
  id: number;
  order_id: number;
  status: string;
  note?: string;
  created_at: string;
}

export interface EscrowTransaction {
  id: number;
  order_id: number;
  amount: number;
  status: string;
  released_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: string;
}

export interface ProductReview {
  id: number;
  product_id: number;
  user_id: number;
  order_id: number;
  rating: number;
  comment?: string;
  seller_reply?: string;
  replied_at?: string;
  is_reported: boolean;
  created_at: string;
  user?: User;
  product?: Product;
  order?: Order;
}

export interface SellerMessage {
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  attachments?: string[];
  is_read: boolean;
  read_at?: string;
  created_at: string;
  sender?: User;
  recipient?: User;
}

export interface Conversation {
  user: User;
  lastMessage?: SellerMessage;
  unreadCount: number;
}

export interface SellerSettings {
  id: number;
  seller_id: number;
  store_logo?: string;
  store_banner?: string;
  display_name?: string;
  description?: string;
  country?: string;
  languages?: string[];
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    discord?: string;
  };
  two_factor_enabled: boolean;
  notification_settings?: {
    email_orders: boolean;
    email_messages: boolean;
    email_reviews: boolean;
    push_orders: boolean;
    push_messages: boolean;
  };
}

export interface AnalyticsData {
  dailyRevenue: Array<{ date: string; revenue: number }>;
  topProducts: Product[];
  salesByCategory: Array<{ name: string; count: number }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface SellerPermission {
  isSeller: boolean;
  sellerRequest?: {
    id: number;
    status: string;
    created_at: string;
  };
  canAccess: boolean;
}
