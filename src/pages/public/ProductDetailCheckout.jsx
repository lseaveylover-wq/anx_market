import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShare2,
  FiThumbsUp,
  FiMessageSquare,
  FiUserPlus,
  FiCheckCircle,
  FiShield,
  FiZap,
  FiLock,
  FiPlus,
  FiMinus,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiSearch
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { SkeletonBox } from '../../components/common/Skeleton';
import './ProductDetailCheckout.css';

import PaymentModal from '../../components/payment/PaymentModal';
import AuthModal from '../../components/auth/AuthModal';

const ProductDetailCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [usePoints, setUsePoints] = useState(false);
  const [buying, setBuying] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data || data);
    } catch (err) {
      console.error('Failed to load product details', err);
      toast.error('Product not found or unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    setBuying(true);
    try {
      const { data } = await api.post('/orders', {
        product_ids: [product.id],
        quantity: quantity,
        payment_method: 'Bakong KHQR',
      });

      const orderObj = data.data || data.order || data;
      setCreatedOrder(orderObj);
      setShowPaymentModal(true);
      toast.success('Order created! Scan Bakong KHQR to pay.');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to process checkout.');
    } finally {
      setBuying(false);
    }
  };

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

  if (!product) {
    return (
      <div className="product-checkout-page" style={{ paddingTop: '8rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>This product listing may have been sold or removed.</p>
        <button className="anx-view-btn" onClick={() => navigate('/products')}>
          Back to Marketplace
        </button>
      </div>
    );
  }

  const seller = product.seller || {};
  const sellerName = seller.name || 'Verified Seller';
  const sellerAvatar = seller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=B62A2D&color=fff`;
  const sellerLevel = seller.level || 109;
  const sellerSold = seller.sold_count || product.sold_count || 12;
  const unitPrice = Number(product.price || 0);
  const totalPrice = (unitPrice * quantity).toFixed(2);

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

        {/* Breadcrumb Navigation */}
        <div className="checkout-breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight className="breadcrumb-arrow" />
          <Link to="/products">Game Accounts</Link>
          <FiChevronRight className="breadcrumb-arrow" />
          <Link to={`/products?category=${product.category_id}`}>{product.category?.name || 'Category'}</Link>
          <FiChevronRight className="breadcrumb-arrow" />
          <span className="current">{product.title}</span>
        </div>

        <div className="checkout-layout">
          
          {/* Left Column: Product Info & Seller Details */}
          <div className="checkout-main-content">
            
            {/* Title & Top Badges Header */}
            <div className="product-header-card">
              <div className="title-row">
                <h1 className="product-main-title">{product.title}</h1>
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
                      <strong style={{ color: '#ffffff' }}>99.64%</strong> 3.9k Completed
                    </span>
                    <span className="rep-divider">•</span>
                    <span className="rep-item" style={{ color: '#22c55e' }}>
                      <FiThumbsUp /> 100% Last 90 Days
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
                    <span className="spec-val-highlight">{product.delivery_time || 'Instant'}</span>
                  </div>
                  <div className="spec-info-card">
                    <span className="spec-key">Delivery method</span>
                    <span className="spec-val-underlined">{product.auto_delivery ?? true ? 'Auto delivery' : 'Manual delivery'}</span>
                  </div>
                  <div className="spec-info-card">
                    <span className="spec-key">Platform</span>
                    <span className="spec-val">{product.platform || 'PC'}</span>
                  </div>
                </div>
              </div>

              <div className="spec-card-divider" />

              {/* Product Description Details */}
              <div className="product-description-section">
                <h3 className="section-heading">Details</h3>
                <div className={`description-text-body ${showFullDesc ? 'expanded' : ''}`}>
                  <p className="details-subheading">
                    {product.category?.name || 'STEAM'} ACCOUNT DETAILS
                  </p>
                  <p className="details-receive-label">
                    What You Will Receive:
                  </p>
                  <p className="details-body-text">
                    {product.long_description || product.short_description || product.description || 
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
                {product.stock || 5} Available
              </div>

              {/* Quantity Stepper */}
              <div className="quantity-stepper-box">
                <button
                  type="button"
                  className="step-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  type="button"
                  className="step-btn step-plus"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= (product.stock || 10)}
                >
                  <FiPlus />
                </button>
              </div>

              {/* Total Amount Row */}
              <div className="checkout-total-row">
                <span className="total-label">Total Amount</span>
                <div className="total-price-val">
                  <span className="price-big">{totalPrice}</span>
                  <span className="price-currency">USD</span>
                </div>
              </div>

              {/* Red Checkout CTA Button */}
              <button
                type="button"
                className="main-checkout-btn"
                onClick={handleCheckout}
                disabled={buying}
              >
                {buying ? 'Processing Order...' : 'Checkout'}
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
                <span>Offer ID #G{product.id}762253053024FH</span>
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
              <span className="mobile-price-num">{totalPrice}</span>
              <span className="mobile-price-curr">USD</span>
            </div>
          </div>
          <button
            type="button"
            className="mobile-checkout-btn"
            onClick={handleCheckout}
            disabled={buying}
          >
            {buying ? 'Processing...' : 'Checkout'}
          </button>
        </div>,
        document.body
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        order={createdOrder}
        onSuccess={(result) => {
          navigate(`/payment/success?order_id=${createdOrder?.order_number || createdOrder?.id}`);
        }}
      />

      {/* Auth / Login Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
};

export default ProductDetailCheckout;
