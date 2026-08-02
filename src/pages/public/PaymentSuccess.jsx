import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShield, FiArrowRight, FiPackage } from 'react-icons/fi';
import './PaymentPages.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id') || searchParams.get('id') || 'Order';

  return (
    <div className="payment-status-page">
      <motion.div
        className="payment-status-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="status-icon-badge success">
          <FiCheckCircle />
        </div>

        <h1>Payment Authorized!</h1>
        <p className="status-subtitle">
          Your payment for Order <strong>#{orderId}</strong> has been verified and securely held in ANX Escrow Protection.
        </p>

        <div className="escrow-notice-banner">
          <FiShield style={{ color: '#10b981', fontSize: '1.25rem' }} />
          <div>
            <strong>Automated Credentials Dispatched</strong>
            <p>Your account login credentials and 2FA recovery details are now unlocked in your dashboard.</p>
          </div>
        </div>

        <div className="status-actions-row">
          <button className="primary-action-btn" onClick={() => navigate('/orders')}>
            <FiPackage /> View My Purchased Credentials
          </button>

          <Link to="/products" className="secondary-action-btn">
            Browse More Accounts <FiArrowRight />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
