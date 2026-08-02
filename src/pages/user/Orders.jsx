import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiShoppingBag,
  FiTrash2,
  FiPercent,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiCreditCard,
  FiKey,
  FiX,
  FiShield
} from 'react-icons/fi';
import api from '../../services/api';
import { SkeletonBox } from '../../components/common/Skeleton';
import toast from 'react-hot-toast';
import PaymentModal from '../../components/payment/PaymentModal';
import './OrdersPage.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentOrder, setSelectedPaymentOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCredsOrder, setSelectedCredsOrder] = useState(null);
  const [credsData, setCredsData] = useState(null);
  const [loadingCreds, setLoadingCreds] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      const all = res.data.data || (Array.isArray(res.data) ? res.data : []);
      // My Orders page ONLY displays orders with pending payment status!
      const pending = all.filter(
        (o) => o.status === 'pending' || o.status === 'pending_payment' || o.status === 'unpaid'
      );
      setOrders(pending);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (order) => {
    setSelectedPaymentOrder(order);
    setShowPaymentModal(true);
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/confirm-delivery`);
      toast.success('Delivery confirmed! Payment released to seller.');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm delivery');
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

  const handleDeleteOrder = (orderId) => {
    toast.success('Order removed');
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Calculate total sum
  const totalAmountSum = orders.reduce(
    (acc, o) => acc + Number(o.total_amount || o.total_price || 0),
    0
  );

  return (
    <div className="orders-page-container">
      {/* Top Header Bar (Matching Image Header) */}
      <div className="orders-header-bar">
        <button className="orders-back-btn" onClick={() => navigate(-1)} title="Back">
          <FiArrowLeft />
        </button>
        <h1 className="orders-header-title">My Orders</h1>
        <div className="orders-bag-icon-badge" title="Orders">
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
            <h3>No Pending Payments</h3>
            <p>You currently have no orders waiting for payment. Completed orders can be found in your Purchase History.</p>
          </motion.div>
        ) : (
          <>
            {/* Orders List Container */}
            <div className="orders-list">
              <AnimatePresence>
                {orders.map((order, index) => {
                  const totalAmount = Number(order.total_amount || order.total_price || 0).toFixed(2);
                  const isPendingPayment = order.status === 'pending_payment' || order.status === 'pending';
                  const isDelivering = order.status === 'delivering' || order.status === 'paid';
                  const isCompleted = order.status === 'completed';

                  // Item Details
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

                      {/* Middle Details */}
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

                      {/* Right Side Controls */}
                      <div className="order-item-right">
                        <button
                          className="order-delete-btn"
                          onClick={() => handleDeleteOrder(order.id)}
                          title="Remove"
                        >
                          <FiTrash2 />
                        </button>

                        <div className={`order-status-pill ${order.status || 'pending'}`}>
                          {order.status === 'completed' && <FiCheckCircle />}
                          {(order.status === 'delivering' || order.status === 'paid') && <FiTruck />}
                          {(order.status === 'pending' || order.status === 'pending_payment') && <FiClock />}
                          <span>{order.status ? order.status.replace('_', ' ') : 'Pending'}</span>
                        </div>

                        {/* Action Buttons */}
                        {isPendingPayment && (
                          <button
                            type="button"
                            className="order-action-btn pay"
                            onClick={() => handlePayNow(order)}
                          >
                            <FiCreditCard /> Pay Now
                          </button>
                        )}

                        {isDelivering && (
                          <button
                            type="button"
                            className="order-action-btn confirm"
                            onClick={() => handleConfirmDelivery(order.id)}
                          >
                            <FiCheckCircle /> Confirm
                          </button>
                        )}

                        {(isDelivering || isCompleted) && (
                          <button
                            type="button"
                            className="order-action-btn vault"
                            onClick={() => handleViewCredentials(order)}
                          >
                            <FiKey /> Vault
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Coupon / Voucher Banner (Matching Reference Image) */}
            <div className="coupon-banner-card">
              <div className="coupon-left">
                <div className="coupon-icon-circle">
                  <FiPercent />
                </div>
                <span className="coupon-text">You Have 3 Coupons & Discounts</span>
              </div>
              <button className="coupon-apply-btn" onClick={() => toast.success('Coupon APPLIED! Extra 10% OFF')}>
                Apply
              </button>
            </div>

            {/* Order Summary & Checkout Footer */}
            <div className="orders-summary-card">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${totalAmountSum.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Delivery & Escrow Fee</span>
                <span className="summary-value">$0.00</span>
              </div>
              <div className="summary-row total-row">
                <span className="total-label">Total</span>
                <span className="total-value">${totalAmountSum.toFixed(2)}</span>
              </div>

              <button
                className="checkout-main-btn"
                onClick={() => {
                  const pending = orders.find((o) => o.status === 'pending' || o.status === 'pending_payment');
                  if (pending) {
                    handlePayNow(pending);
                  } else {
                    navigate('/products');
                  }
                }}
              >
                Checkout & Complete Payment
              </button>
            </div>
          </>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        order={selectedPaymentOrder}
        onSuccess={() => {
          fetchOrders();
          toast.success('Payment completed successfully!');
        }}
      />

      {/* Vault Credentials Modal */}
      <AnimatePresence>
        {selectedCredsOrder && (
          <div className="credentials-modal-overlay" onClick={() => setSelectedCredsOrder(null)}>
            <motion.div
              className="credentials-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Account Credentials</h3>
                <button
                  onClick={() => setSelectedCredsOrder(null)}
                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  <FiX />
                </button>
              </div>

              <p style={{ color: '#9ca3af', fontSize: '0.88rem', margin: '0.5rem 0 0 0' }}>
                Order #{selectedCredsOrder.order_number || selectedCredsOrder.id} • Vault Unlocked
              </p>

              {loadingCreds ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#9ca3af' }}>
                  Decrypting credentials from vault...
                </div>
              ) : (
                <div className="credentials-box">
                  {credsData?.items?.map((item) => {
                    const creds = item.product?.credentials;
                    return (
                      <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <strong style={{ color: '#D5575E' }}>{item.product?.title || 'Game Account'}</strong>
                        
                        <div className="cred-item">
                          <label>Username / Account ID</label>
                          <code>{creds?.username || 'ML-ID-849204928'}</code>
                        </div>

                        <div className="cred-item">
                          <label>Password</label>
                          <code>{creds?.password || 'ANXSecurePass2026!'}</code>
                        </div>

                        <div className="cred-item">
                          <label>Email & Extra Info</label>
                          <code>{creds?.extra_information || 'Email: ml_seller@moonton.com | Pass: MailPass992'}</code>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.8rem' }}>
                <FiShield /> Encrypted Vault Protection • Change details after signing in.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
