import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RegionProvider } from './contexts/RegionContext';
import DynamicIslandNav from './components/layouts/DynamicIslandNav';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ProductsCatalog from './pages/public/ProductsCatalog';
import ProductDetailCheckout from './pages/public/ProductDetailCheckout';
import PaymentSuccess from './pages/public/PaymentSuccess';
import PaymentFailed from './pages/public/PaymentFailed';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import SearchPage from './pages/public/SearchPage';
import RegionSelectPage from './pages/public/RegionSelectPage';
import GoogleCallback from './pages/auth/GoogleCallback';
import AdminDashboard from './pages/admin/AdminDashboard';
import SellerRequests from './pages/admin/SellerRequests';
import Users from './pages/admin/Users';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Testimonials from './pages/admin/Testimonials';
import Settings from './pages/admin/Settings';

// User Pages
import UserProfile from './pages/user/Profile';
import UserOrders from './pages/user/Orders';
import UserSettings from './pages/user/Settings';
import PurchaseHistory from './pages/user/PurchaseHistory';

// Seller Pages
import SellerLayout from './components/seller/SellerLayout';
import SellerDashboard from './pages/seller/Dashboard/Dashboard';
import SellerProducts from './pages/seller/Products/ProductsList';
import SellerProductForm from './pages/seller/Products/ProductForm';
import SellerInventory from './pages/seller/Inventory/Inventory';
import SellerOrders from './pages/seller/Orders/OrdersList';
import SellerOrderDetails from './pages/seller/Orders/OrderDetails';
import SellerDeliveries from './pages/seller/Deliveries/Deliveries';
import SellerAnalytics from './pages/seller/Analytics/Analytics';
import SellerWallet from './pages/seller/Wallet/Wallet';
import SellerReviews from './pages/seller/Reviews/Reviews';
import SellerMessages from './pages/seller/Messages/Messages';
import SellerNotifications from './pages/seller/Notifications/Notifications';
import SellerSettings from './pages/seller/Settings/Settings';
import DemoModeBadge from './components/common/DemoModeBadge';

import './App.css';

function MainLayout() {
  return (
    <main className="main-content">
      <Outlet />
    </main>
  );
}

function App() {
  return (
    <ThemeProvider>
      <RegionProvider>
        <AuthProvider>
          <Router>
            <div className="app">
              <DynamicIslandNav />
              <DemoModeBadge />
              
              <Routes>
                {/* Main Site Routes wrapped in .main-content */}
                <Route element={<MainLayout />}>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductsCatalog />} />
                  <Route path="/products/:id" element={<ProductDetailCheckout />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/failed" element={<PaymentFailed />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/select-region" element={<RegionSelectPage />} />
                  <Route path="/auth/google/callback" element={<GoogleCallback />} />

                {/* Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/seller-requests" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <SellerRequests />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Users />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Products />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Orders />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/testimonials" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Testimonials />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />

                {/* Protected User Routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <UserOrders />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/purchase-history" 
                  element={
                    <ProtectedRoute>
                      <PurchaseHistory />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <UserSettings />
                    </ProtectedRoute>
                  } 
                />
              </Route>

              {/* Seller Hub Layout */}
              <Route path="/seller" element={<SellerLayout />}>
                <Route path="dashboard" element={<SellerDashboard />} />
                <Route path="products" element={<SellerProducts />} />
                <Route path="products/create" element={<SellerProductForm />} />
                <Route path="products/edit/:id" element={<SellerProductForm />} />
                <Route path="inventory" element={<SellerInventory />} />
                <Route path="orders" element={<SellerOrders />} />
                <Route path="orders/:id" element={<SellerOrderDetails />} />
                <Route path="deliveries" element={<SellerDeliveries />} />
                <Route path="analytics" element={<SellerAnalytics />} />
                <Route path="wallet" element={<SellerWallet />} />
                <Route path="reviews" element={<SellerReviews />} />
                <Route path="messages" element={<SellerMessages />} />
                <Route path="notifications" element={<SellerNotifications />} />
                <Route path="settings" element={<SellerSettings />} />
              </Route>
            </Routes>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--surface-color)',
                  color: 'var(--text-color)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </RegionProvider>
  </ThemeProvider>
);
}

export default App;
