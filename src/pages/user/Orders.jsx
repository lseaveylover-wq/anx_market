import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiShare2,
  FiSearch,
  FiThumbsUp,
  FiMessageSquare,
  FiUserPlus,
  FiCheckCircle,
  FiShield,
  FiZap,
  FiLock,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiTrash2,
  FiClock,
  FiCheck
} from 'react-icons/fi';
import api from '../../services/api';
import { SkeletonBox } from '../../components/common/Skeleton';
import toast from 'react-hot-toast';
import PaymentModal from '../../components/payment/PaymentModal';
import '../public/ProductDetailCheckout.css';
import './OrdersPage.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [selectedPaymentOrder, setSelectedPaymentOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [usePoints, setUsePoints] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      const all = res.data.data || (Array.isArray(res.data) ? res.data : []);
      // Orders page displays orders with pending payment status
      const pending = all.filter(
        (o) => o.status === 'pending' || o.status === 'pending_payment' || o.status === 'unpaid'
      );
      setOrders(pending.length > 0 ? pending : all.slice(0, 1));
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const currentOrder = orders[selectedOrderIndex] || orders[0] || null;
  const firstItem = currentOrder?.items?.[0] || currentOrder?.product || {};
  const currentProduct = firstItem?.product || firstItem || {};

  const productTitle = currentProduct?.title || firstItem?.title || `Order #${currentOrder?.order_number || currentOrder?.id}`;
  const seller = currentProduct?.seller || currentOrder?.seller || {};
  const sellerName = seller?.name || 'Verified Seller';
  const sellerAvatar = seller?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=B62A2D&color=fff`;
  const sellerLevel = seller?.level || 111;
  const sellerSold = seller?.sold_count || currentProduct?.sold_count || 6;
  const unitPrice = Number(firstItem?.price || currentProduct?.price || currentOrder?.total_amount || 0);
  const quantity = Number(firstItem?.quantity || currentOrder?.quantity || 1);
  const totalAmount = Number(currentOrder?.total_amount || currentOrder?.total_price || unitPrice * quantity || 0).toFixed(2);

  if (loading) {
    return (
      <div className="product-checkout-page" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
        <div className="checkout-container">
          <div className="checkout-layout">
            <div className="checkout-main-content">
              <SkeletonBox width="60%" height="2rem" radius="8px" style={{ marginBottom: '1rem' }} />
              <SkeletonBox width="100%" height="120px" radius="16px" style={{ marginBottom: '1.5rem' }} />
              <SkeletonBox width="100%" height="200px" radius="16px" />
            </div>
            <div className="checkout-sidebar">
              <SkeletonBox width="100%" height="380px" radius="20px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrder || orders.length === 0) {
    return (
      <div className="product-checkout-page" style={{ paddingTop: '8rem', textAlign: 'center' }}>
        <div className="checkout-container">
          <motion.div
            className="orders-empty-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ maxWidth: '500px', margin: '0 auto', background: 'var(--bg-surface)', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(182, 42, 45, 0.15)', color: '#D5575E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', fontSize: '1.8rem' }}>
              <FiShoppingBag />
            </div>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Pending Orders</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You have no orders awaiting payment. Browse available games and accounts to place an order.</p>
            <button className="anx-view-btn" onClick={() => navigate('/products')}>
              Explore Marketplace
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-checkout-page">
      <div className="checkout-container">

        {/* Mobile Top Nav Bar (Matching Screen 3) */}
        <div className="mobile-top-bar">
          <button type="button" className="mobile-top-btn" onClick={() => navigate(-1)} title="Back">
            <FiChevronLeft />
          </button>
          <div className="mobile-top-actions">
            <button type="button" className="mobile-top-btn" onClick={() => navigate('/search')} title="Search">
              <FiSearch />
            </button>
            <button type="button" className="mobile-top-btn" onClick={handleShare} title="Share">
              <FiShare2 />
            </button>
          </div>
        </div>

        {/* Multiple Orders Tabs (if customer has more than 1 pending order) */}
        {orders.length > 1 && (
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
            {orders.map((ord, idx) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => setSelectedOrderIndex(idx)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '20px',
                  border: selectedOrderIndex === idx ? 'none' : '1px solid var(--border-color)',
                  background: selectedOrderIndex === idx ? 'linear-gradient(135deg, #B62A2D 0%, #D5575E 100%)' : 'var(--bg-surface)',
                  color: selectedOrderIndex === idx ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Order #{ord.order_number || ord.id} (${Number(ord.total_amount || 0).toFixed(2)})
              </button>
            ))}
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <div className="checkout-breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight className="breadcrumb-arrow" />
          <Link to="/products">Game Accounts</Link>
          <FiChevronRight className="breadcrumb-arrow" />
          <span className="current">{currentProduct?.category?.name || 'Steam'}</span>
        </div>

        <div className="checkout-layout">

          {/* Left Column: Product Info & Seller Details */}
          <div className="checkout-main-content">

            {/* Title & Top Badges Header */}
            <div className="product-header-card">
              <div className="title-row">
                <h1 className="product-main-title">{productTitle}</h1>
                <button type="button" onClick={handleShare} className="share-btn" title="Share Offer">
                  <FiShare2 /> Share
                </button>
              </div>

              {/* Header Rating Badges */}
              <div className="product-header-badges">
                <span className="badge-green-rating">
                  <FiThumbsUp /> 100.00% <span className="review-count">(5 reviews)</span>
                </span>
                <span className="badge-dark-sold">{sellerSold} sold</span>
              </div>
            </div>

            {/* Seller Information Panel */}
            <div className="seller-profile-panel">
              <div className="seller-profile-left">
                <div className="seller-avatar-wrapper">
                  <img src={sellerAvatar} alt={sellerName} className="seller-profile-avatar" />
                  <span className="seller-status-dot" />
                </div>

                <div className="seller-details-meta">
                  <div className="seller-name-row">
                    <span className="seller-display-name">{sellerName}</span>
                    <span className="seller-lvl-tag">Lvl {sellerLevel}</span>
                  </div>

                  <div className="seller-reputation-row">
                    <span className="rep-item">
                      <strong style={{ color: '#ffffff' }}>96.7%</strong> 3.2k Completed
                    </span>
                    <span className="rep-divider">•</span>
                    <span className="rep-item" style={{ color: '#22c55e' }}>
                      <FiThumbsUp /> 97.03% Last 90 Days
                    </span>
                    <span className="rep-divider">•</span>
                    <span className="seller-rank-badge">Uncommon Seller</span>
                  </div>
                </div>
              </div>

              <div className="seller-profile-actions">
                <button
                  type="button"
                  className={`seller-action-btn ${isFollowing ? 'following' : ''}`}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  <FiUserPlus /> {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>

            {/* Unified Product Info & Details Card (Matching Screenshot) */}
            <div className="product-info-details-card">
              {/* Product Info Section */}
              <div className="product-spec-section">
                <h3 className="section-heading">Product Info</h3>
                <div className="spec-grid-layout">
                  <div className="spec-info-card">
                    <span className="spec-key">Delivery speed</span>
                    <span className="spec-val-highlight">{currentProduct?.delivery_time || 'Instant'}</span>
                  </div>
                  <div className="spec-info-card">
                    <span className="spec-key">Delivery method</span>
                    <span className="spec-val-underlined">{currentProduct?.auto_delivery ?? true ? 'Auto delivery' : 'Manual delivery'}</span>
                  </div>
                  <div className="spec-info-card">
                    <span className="spec-key">Platform</span>
                    <span className="spec-val">{currentProduct?.platform || 'PC'}</span>
                  </div>
                </div>
              </div>

              <div className="spec-card-divider" />

              {/* Product Description Details */}
              <div className="product-description-section">
                <h3 className="section-heading">Details</h3>
                <div className={`description-text-body ${showFullDesc ? 'expanded' : ''}`}>
                  <p className="details-subheading">
                    {currentProduct?.category?.name || 'STEAM'} ACCOUNT DETAILS
                  </p>
                  <p className="details-receive-label">
                    What You Will Receive:
                  </p>
                  <p className="details-body-text">
                    {currentProduct?.long_description || currentProduct?.short_description || currentProduct?.description ||
                      'Instant automated delivery upon payment confirmation. High reputation account with clean credentials, email access, and full warranty protection.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="view-more-toggle"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                >
                  {showFullDesc ? 'Show less' : 'View more'}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Checkout Sidebar Card */}
          <div className="checkout-sidebar">
            <motion.div
              className="checkout-box-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Stock Available */}
              <div className="stock-header-tag">
                {currentProduct?.stock || 1} Available
              </div>

              {/* Quantity Stepper */}
              <div className="quantity-stepper-box">
                <button
                  type="button"
                  className="step-btn"
                  disabled
                >
                  <FiMinus />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  type="button"
                  className="step-btn step-plus"
                  disabled
                >
                  <FiPlus />
                </button>
              </div>

              {/* Total Amount Row */}
              <div className="checkout-total-row">
                <span className="total-label">Total Amount</span>
                <div className="total-price-val">
                  <span className="price-big">{totalAmount}</span>
                  <span className="price-currency">USD</span>
                </div>
              </div>

              {/* Red Checkout CTA Button */}
              <button
                type="button"
                className="main-checkout-btn"
                onClick={() => handlePayNow(currentOrder)}
              >
                Checkout
              </button>

              {/* Trust & Guarantee Badges */}
              <div className="trust-badges-container">
                <div className="trust-item">
                  <FiShield className="trust-icon" />
                  <div>
                    <strong>ANX Escrow Protection</strong>
                    <p>Payment Released Only After Confirmation.</p>
                  </div>
                </div>

                <div className="trust-item">
                  <FiZap className="trust-icon" />
                  <div>
                    <strong>Instant Delivery</strong>
                    <p>Automated Delivery System Active.</p>
                  </div>
                </div>

                <div className="trust-item">
                  <FiLock className="trust-icon" />
                  <div>
                    <strong>14-Day Coverage</strong>
                    <p>Insured For 14 Days From Delivery</p>
                  </div>
                </div>
              </div>

              {/* Offer ID & Report Link */}
              <div className="offer-footer-meta">
                <span>Offer ID #{currentOrder?.order_number || `ORD-${currentOrder?.id}`}</span>
                <button type="button" className="report-offer-btn" onClick={() => toast.success('Report submitted to moderation')}>
                  Report This Offer
                </button>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Bottom Checkout Bar (Rendered on document.body to guarantee fixed viewport positioning) */}
      {typeof document !== 'undefined' && createPortal(
        <div className="mobile-checkout-sticky-bar">
          <div className="mobile-total-info">
            <span className="mobile-total-label">Total Amount</span>
            <div className="mobile-total-val">
              <span className="mobile-price-num">{totalAmount}</span>
              <span className="mobile-price-curr">USD</span>
            </div>
          </div>
          <button
            type="button"
            className="mobile-checkout-btn"
            onClick={() => handlePayNow(currentOrder)}
          >
            Checkout
          </button>
        </div>,
        document.body
      )}

      {/* Payment Modal (Bakong KHQR Exclusive) */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        order={selectedPaymentOrder}
        onSuccess={(result) => {
          navigate(`/payment/success?order_id=${selectedPaymentOrder?.order_number || selectedPaymentOrder?.id}`);
        }}
      />
    </div>
  );
};

export default Orders;
