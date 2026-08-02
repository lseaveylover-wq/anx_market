import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiTruck, FiDollarSign } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Seller.css';
import { SkeletonBox } from '../../components/common/Skeleton';

const StoreSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      // Backend /api/orders returns orders where user is buyer or seller.
      // We will filter only the ones where user is the seller.
      const res = await api.get('/orders');
      const allOrders = res.data.data || res.data || [];
      
      // Get current user from localStorage to check ID
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (user) {
        const mySales = allOrders.filter(order => order.seller_id === user.id);
        setSales(mySales);
      } else {
        setSales([]);
      }
    } catch (error) {
      toast.error('Failed to load store sales');
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivering = async (orderId) => {
    if (!window.confirm('Are you sure you want to mark this order as Delivering? This means you have provided the service or credentials to the buyer.')) {
      return;
    }
    
    try {
      await api.post(`/orders/${orderId}/mark-delivering`);
      toast.success('Order marked as delivering!');
      fetchSales(); // refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid': return <span className="badge-paid">Paid (Needs Fulfillment)</span>;
      case 'delivering': return <span className="badge-delivering">Delivering (Waiting for Buyer)</span>;
      case 'completed': return <span className="badge-completed">Completed</span>;
      default: return <span className="badge-paid" style={{textTransform:'capitalize'}}>{status}</span>;
    }
  };

  return (
    <div className="seller-page-container">
      <div className="seller-page-header">
        <div>
          <h1>Store Sales</h1>
          <p>Manage orders placed by customers for your products</p>
        </div>
      </div>

      <div className="seller-content-card">
        {loading ? (
          <div className="sales-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="sale-item" style={{ padding: '1.5rem', display: 'block' }}>
                <SkeletonBox height="24px" width="30%" radius="4px" style={{ marginBottom: '1rem' }} />
                <SkeletonBox height="20px" width="60%" radius="4px" style={{ marginBottom: '0.5rem' }} />
                <SkeletonBox height="30px" width="20%" radius="6px" />
              </div>
            ))}
          </div>
        ) : sales.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <FiDollarSign style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.2)', marginBottom: '1rem' }} />
            <h3>No sales yet</h3>
            <p style={{ color: 'var(--neutral-color)' }}>When customers buy your products, they will appear here.</p>
          </div>
        ) : (
          <div className="sales-list">
            <AnimatePresence>
              {sales.map((sale, idx) => (
                <motion.div 
                  key={sale.id}
                  className="sale-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="sale-info">
                    <span className="sale-id">
                      <FiPackage style={{ marginRight: '0.5rem', color: 'var(--neutral-color)' }} />
                      Order #{sale.id}
                    </span>
                    <span className="sale-date">
                      Purchased on {new Date(sale.created_at).toLocaleDateString()}
                    </span>
                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--neutral-color)' }}>Buyer: </span>
                      <strong style={{ color: 'var(--text-color)' }}>{sale.buyer?.name}</strong>
                    </div>
                  </div>
                  
                  <div className="sale-actions">
                    <div className="sale-price">
                      ${parseFloat(sale.total_amount).toFixed(2)}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      {getStatusBadge(sale.status)}
                      
                      {sale.status === 'paid' && (
                        <button 
                          className="btn-deliver"
                          onClick={() => markAsDelivering(sale.id)}
                        >
                          <FiTruck /> Mark as Delivering
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreSales;
