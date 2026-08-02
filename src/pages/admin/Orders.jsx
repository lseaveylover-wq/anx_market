import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { SkeletonBox } from '../../components/common/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Orders.css';

const OrdersTableSkeleton = () => (
  <div className="table-container">
    <table className="orders-table">
      <thead>
        <tr>
          {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }).map((_, i) => (
          <tr key={i} style={{ pointerEvents: 'none' }}>
            <td className="order-id"><SkeletonBox width="80px" height="0.9rem" radius="6px" /></td>
            <td>
              <div className="customer-cell">
                <SkeletonBox width="36px" height="36px" radius="50%" style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <SkeletonBox width="110px" height="0.85rem" radius="6px" />
                  <SkeletonBox width="140px" height="0.75rem" radius="6px" />
                </div>
              </div>
            </td>
            <td><SkeletonBox width="150px" height="0.9rem" radius="6px" /></td>
            <td className="amount-cell"><SkeletonBox width="70px" height="0.9rem" radius="6px" /></td>
            <td><SkeletonBox width="100px" height="28px" radius="20px" /></td>
            <td><SkeletonBox width="90px" height="0.9rem" radius="6px" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, paid, delivering, completed, cancelled

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      const data = response.data.data || response.data;
      const ordersArray = Array.isArray(data) ? data : [];
      
      // Filter orders by status if needed
      const filtered = filter === 'all' 
        ? ordersArray 
        : ordersArray.filter(order => order.status === filter);
      
      setOrders(filtered);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock />;
      case 'paid': return <FiCheck />;
      case 'delivering': return <FiTruck />;
      case 'completed': return <FiCheck />;
      case 'cancelled': return <FiX />;
      default: return <FiClock />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'paid': return '#3b82f6';
      case 'delivering': return '#667eea';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <motion.div
          className="admin-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="admin-header-content">
            <h1 className="admin-title">
              <FiShoppingCart /> Orders Management
            </h1>
            <p className="admin-subtitle">Monitor and manage all orders</p>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="filter-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {['all', 'pending', 'paid', 'delivering', 'completed', 'cancelled'].map((status) => (
            <motion.button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Orders Table */}
        {loading ? (
          <OrdersTableSkeleton />
        ) : orders.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiShoppingCart />
            <p>No {filter !== 'all' ? filter : ''} orders found</p>
          </motion.div>
        ) : (
          <motion.div
            className="table-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: 'rgba(182, 42, 45, 0.05)' }}
                  >
                    <td className="order-id">#{order.id}</td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {order.customer?.avatar ? (
                            <img src={order.customer.avatar} alt={order.customer.name} />
                          ) : (
                            order.customer?.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="customer-name">{order.customer?.name}</div>
                          <div className="customer-email">{order.customer?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{order.items?.[0]?.product?.title || 'N/A'}</td>
                    <td className="amount-cell">${order.total_amount}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                        }}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;
