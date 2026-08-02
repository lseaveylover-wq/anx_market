import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiXCircle, FiRefreshCw, FiArrowLeft, FiHelpCircle } from 'react-icons/fi';
import './PaymentPages.css';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id') || 'Order';

  return (
    <div className="payment-status-page">
      <motion.div
        className="payment-status-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="status-icon-badge failed">
          <FiXCircle />
        </div>

        <h1>Payment Could Not Be Verified</h1>
        <p className="status-subtitle">
          The payment attempt for Order <strong>#{orderId}</strong> failed or was cancelled before completion.
        </p>

        <div className="status-actions-row">
          <button className="primary-action-btn" onClick={() => navigate('/products')}>
            <FiRefreshCw /> Retry Checkout
          </button>

          <Link to="/contact" className="secondary-action-btn">
            <FiHelpCircle /> Contact 24/7 Support
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
