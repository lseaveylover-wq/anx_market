import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './BecomeSellerModal.css';

const BecomeSellerModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    business_name: '',
    business_email: '',
    phone_number: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.reason.length < 20) {
      toast.error('Reason must be at least 20 characters long');
      return;
    }

    setLoading(true);
    try {
      await api.post('/seller-requests', formData);
      setIsSuccess(true);
      toast.success('Seller request submitted successfully!');
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ business_name: '', business_email: '', phone_number: '', reason: '' });
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="modal-content become-seller-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: '90vh', overflowY: 'auto' }}
        >
          <button className="modal-close-btn" onClick={onClose}>
            <FiX />
          </button>

          {isSuccess ? (
            <div className="success-state">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <FiCheckCircle className="success-icon" />
              </motion.div>
              <h3>Request Submitted!</h3>
              <p>Our admin team will review your request shortly.</p>
            </div>
          ) : (
            <>
              <div className="modal-header">
                <h2>Become a Seller</h2>
                <p>Tell us about your business</p>
              </div>

              <form onSubmit={handleSubmit} className="become-seller-form">
                <div className="form-group">
                  <label htmlFor="business_name">Business Name</label>
                  <input
                    type="text"
                    id="business_name"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    placeholder="E.g., Pro Accounts Shop"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="business_email">Business Email</label>
                  <input
                    type="email"
                    id="business_email"
                    name="business_email"
                    value={formData.business_email}
                    onChange={handleChange}
                    placeholder="E.g., contact@proaccounts.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone_number">Phone Number</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="E.g., +1 234 567 8900"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reason">Description / Reason</label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="E.g., I have many premium game accounts to sell and I want to provide a great service..."
                    rows={4}
                    required
                    minLength={20}
                  />
                  <small className="char-count">
                    {formData.reason.length}/20 minimum characters
                  </small>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading || formData.reason.length < 20}
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default BecomeSellerModal;
