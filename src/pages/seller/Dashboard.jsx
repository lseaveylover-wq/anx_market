import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiPackage, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Seller.css';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // We will aggregate stats from existing endpoints (products and orders)
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products/my-products'),
        api.get('/orders')
      ]);

      const myProducts = productsRes.data.data || productsRes.data || [];
      const myOrders = ordersRes.data.data || ordersRes.data || [];

      // A seller's orders include items they sold.
      // We need to count sales (completed/delivering/paid) and pending fulfillment
      let totalSales = 0;
      let pendingOrders = 0;

      // Ensure we only count orders where the user is the seller 
      // (OrderController index returns both bought and sold, but for stats we should filter if needed. 
      // Assuming OrderController already returns the seller's orders).
      // For a quick approximation:
      myOrders.forEach(order => {
        // Assuming we are calculating total sales from completed/paid orders
        if (['completed', 'delivering', 'paid'].includes(order.status)) {
          totalSales += parseFloat(order.total_amount);
        }
        if (order.status === 'paid') {
          pendingOrders++;
        }
      });

      setStats({
        totalSales,
        totalProducts: myProducts.length,
        pendingOrders
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-page-container">
      <motion.div 
        className="seller-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>Seller Dashboard</h1>
          <p>Overview of your store's performance</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/seller/products" className="seller-primary-btn" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <FiPackage /> Manage Products
          </Link>
          <Link to="/seller/sales" className="seller-primary-btn">
            <FiDollarSign /> View Sales
          </Link>
        </div>
      </motion.div>

      <div className="seller-stats-grid">
        <motion.div className="stat-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="stat-icon sales"><FiDollarSign /></div>
          <div className="stat-info">
            <span className="stat-label">Total Earnings</span>
            <span className="stat-value">
              {loading ? '...' : `$${stats.totalSales.toFixed(2)}`}
            </span>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon products"><FiPackage /></div>
          <div className="stat-info">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">
              {loading ? '...' : stats.totalProducts}
            </span>
          </div>
        </motion.div>

        <motion.div className="stat-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon pending"><FiClock /></div>
          <div className="stat-info">
            <span className="stat-label">Pending Fulfillment</span>
            <span className="stat-value">
              {loading ? '...' : stats.pendingOrders}
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* Additional dashboard widgets can go here */}
      <div className="seller-content-card">
        <h3>Welcome to your Seller Portal!</h3>
        <p style={{ color: 'var(--neutral-color)', marginTop: '1rem' }}>
          Use the navigation buttons above to manage your inventory and fulfill customer orders. Ensure you mark paid orders as "Delivering" so customers can confirm receipt.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
