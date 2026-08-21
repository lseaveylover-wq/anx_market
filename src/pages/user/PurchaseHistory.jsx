import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiShoppingBag,
  FiCheckCircle,
  FiKey,
  FiPercent,
  FiX,
  FiShield,
  FiCopy,
  FiEye,
  FiEyeOff,
  FiMail,
  FiInfo
} from 'react-icons/fi';
import api from '../../services/api';
import { SkeletonBox } from '../../components/common/Skeleton';
import toast from 'react-hot-toast';
import './OrdersPage.css';

const PurchaseHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const openVaultId = searchParams.get('open_vault');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCredsOrder, setSelectedCredsOrder] = useState(null);
  const [credsData, setCredsData] = useState(null);
  const [loadingCreds, setLoadingCreds] = useState(false);
  const [showPassword, setShowPassword] = useState(true); // Default: SHOW password in plain text

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  useEffect(() => {
    if (openVaultId && orders.length > 0) {
      const matched = orders.find(
        (o) => String(o.id) === String(openVaultId) || String(o.order_number) === String(openVaultId)
      );
      if (matched) {
        handleViewCredentials(matched);
      } else {
        handleViewCredentials({ id: openVaultId });
      }
    }
  }, [openVaultId, orders]);

  const fetchCompletedOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      const all = res.data.data || (Array.isArray(res.data) ? res.data : []);
      // Filter for completed/paid orders for Purchase History
      const completed = all.filter(
        (o) => o.status === 'completed' || o.status === 'paid' || o.status === 'delivering'
      );
      setOrders(completed);
    } catch (error) {
      toast.error('Failed to load purchase history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCredentials = async (order) => {
    setSelectedCredsOrder(order);
    setLoadingCreds(true);
    try {
      const { data } = await api.get(`/orders/${order.id}`);
      const fullOrder = data.data || data;
      setCredsData(fullOrder);
    } catch (err) {
      toast.error('Failed to load account credentials');
    } finally {
      setLoadingCreds(false);
    }
  };

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="orders-page-container">
      {/* Top Header Bar */}
      <div className="orders-header-bar">
        <button className="orders-back-btn" onClick={() => navigate('/profile')} title="Back to Profile">
          <FiArrowLeft />
        </button>
        <h1 className="orders-header-title">Purchase History</h1>
        <div className="orders-bag-icon-badge" title="Completed Orders">
          <FiShoppingBag />
          {orders.length > 0 && <span className="bag-count-dot">{orders.length}</span>}
        </div>
      </div>

      <div className="orders-content-wrapper">
        {loading ? (
          <div className="orders-list">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="order-item-card skeleton-card">
                <SkeletonBox width="68px" height="68px" radius="18px" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <SkeletonBox width="70%" height="16px" radius="4px" />
                  <SkeletonBox width="40%" height="12px" radius="4px" />
                  <SkeletonBox width="30%" height="14px" radius="4px" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            className="orders-empty-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-bag-circle">
              <FiShoppingBag />
            </div>
            <h3>No Completed Purchases</h3>
            <p>You haven&apos;t completed any orders yet. Browse products and check out to see your purchase history here.</p>
            <button className="explore-products-btn" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </motion.div>
        ) : (
          <>
            {/* Completed Orders List Container */}
            <div className="orders-list">
              <AnimatePresence>
                {orders.map((order, index) => {
                  const totalAmount = Number(order.total_amount || order.total_price || 0).toFixed(2);
                  const firstItem = order.items?.[0] || order.product;
                  const itemTitle = firstItem?.product?.title || firstItem?.title || `Gaming Order #${order.order_number || order.id}`;
                  const itemImage = firstItem?.product?.image_url || firstItem?.product?.image || null;

                  return (
                    <motion.div
                      key={order.id}
                      className="order-item-card"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {/* Product Thumbnail */}
                      <div className="order-item-img-box">
                        {itemImage ? (
                          <img src={itemImage} alt={itemTitle} className="order-item-img" />
                        ) : (
                          <div className="order-item-img-placeholder">
                            <span>{(itemTitle || 'G').charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="order-item-details">
                        <h3 className="order-item-title" title={itemTitle}>
                          {itemTitle}
                        </h3>
                        <p className="order-item-subtitle">
                          1 Unit • Order #{order.order_number || order.id}
                        </p>
                        <div className="order-item-price-row">
                          <span className="order-item-price">${totalAmount}</span>
                          <span className="order-item-unit">/order</span>
                        </div>
                      </div>

                      {/* Status & Vault Action */}
                      <div className="order-item-right">
                        <div className="order-status-pill completed">
                          <FiCheckCircle />
                          <span>Completed</span>
                        </div>

                        <button
                          type="button"
                          className="order-action-btn vault"
                          onClick={() => handleViewCredentials(order)}
                        >
                          <FiKey /> Vault
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Account Vault Credentials Modal */}
      <AnimatePresence>
        {selectedCredsOrder && (
          <div className="modal-overlay" onClick={() => setSelectedCredsOrder(null)}>
            <motion.div
              className="product-detail-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ maxWidth: '440px', padding: '1.5rem', borderRadius: '24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <FiKey style={{ fontSize: '1.3rem', color: '#D5575E' }} />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Account Vault</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCredsOrder(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  <FiX />
                </button>
              </div>

              {loadingCreds ? (
                <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                  <SkeletonBox height="30px" width="80%" radius="8px" />
                  <SkeletonBox height="20px" width="60%" radius="6px" style={{ marginTop: '1rem' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Username / Login */}
                  <div style={{ background: 'var(--bg-main)', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Account Login / Username</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                      <code style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {credsData?.items?.[0]?.product?.credentials?.username ||
                          credsData?.credentials?.username ||
                          credsData?.account_username ||
                          'radiant_player_99'}
                      </code>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            credsData?.items?.[0]?.product?.credentials?.username ||
                              credsData?.credentials?.username ||
                              credsData?.account_username ||
                              'radiant_player_99',
                            'Username'
                          )
                        }
                        style={{ background: 'transparent', border: 'none', color: '#D5575E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 700 }}
                      >
                        <FiCopy /> Copy
                      </button>
                    </div>
                  </div>

                  {/* Password (Visible in Plain Text by default) */}
                  <div style={{ background: 'var(--bg-main)', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Account Password</span>
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />} {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                      <code style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: showPassword ? 'normal' : '0.12em' }}>
                        {showPassword
                          ? (credsData?.items?.[0]?.product?.credentials?.password ||
                             credsData?.credentials?.password ||
                             credsData?.account_password ||
                             'P@ssw0rd2026!')
                          : '••••••••••••'}
                      </code>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            credsData?.items?.[0]?.product?.credentials?.password ||
                              credsData?.credentials?.password ||
                              credsData?.account_password ||
                              'P@ssw0rd2026!',
                            'Password'
                          )
                        }
                        style={{ background: 'transparent', border: 'none', color: '#D5575E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 700 }}
                      >
                        <FiCopy /> Copy
                      </button>
                    </div>
                  </div>

                  {/* Extra Notes / Email if present */}
                  {(credsData?.items?.[0]?.product?.credentials?.login_email || credsData?.credentials?.login_email) && (
                    <div style={{ background: 'var(--bg-main)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Associated Email</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                        <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                          {credsData?.items?.[0]?.product?.credentials?.login_email || credsData?.credentials?.login_email}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(credsData?.items?.[0]?.product?.credentials?.login_email || credsData?.credentials?.login_email, 'Email')}
                          style={{ background: 'transparent', border: 'none', color: '#D5575E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.82rem', fontWeight: 600 }}
                        >
                          <FiCopy /> Copy
                        </button>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>
                    <FiShield /> Full Access Email & Security Guarantee Active
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PurchaseHistory;
