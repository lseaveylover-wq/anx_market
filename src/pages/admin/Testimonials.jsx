import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiCheck, FiX, FiStar } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { SkeletonBox } from '../../components/common/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Testimonials.css';

const TestimonialsSkeleton = () => (
  <div className="testimonials-grid">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="testimonial-card" style={{ pointerEvents: 'none' }}>
        <div className="testimonial-header">
          <div className="user-info">
            <SkeletonBox width="45px" height="45px" radius="50%" style={{ flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <SkeletonBox width="120px" height="1rem" radius="6px" />
              <SkeletonBox width="80px" height="0.8rem" radius="6px" />
            </div>
          </div>
          <div className="badges">
            <SkeletonBox width="70px" height="24px" radius="20px" />
          </div>
        </div>
        <div className="testimonial-body">
          <SkeletonBox width="100%" height="0.9rem" radius="6px" style={{ marginBottom: '0.5rem' }} />
          <SkeletonBox width="100%" height="0.9rem" radius="6px" style={{ marginBottom: '0.5rem' }} />
          <SkeletonBox width="60%" height="0.9rem" radius="6px" />
        </div>
        <div className="testimonial-actions">
          <SkeletonBox height="38px" radius="8px" style={{ flex: 1 }} />
          <SkeletonBox height="38px" radius="8px" style={{ flex: 1 }} />
        </div>
      </div>
    ))}
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(''); // approve, reject, feature

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/testimonials');
      const data = response.data.data || response.data;
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (testimonial, action) => {
    setSelectedTestimonial(testimonial);
    setModalAction(action);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTestimonial(null);
    setModalAction('');
  };

  const handleAction = async () => {
    try {
      await api.put(`/admin/testimonials/${selectedTestimonial.id}/action`, { action: modalAction });
      toast.success(`Testimonial ${modalAction}d successfully`);
      closeModal();
      fetchTestimonials();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${modalAction} testimonial`);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={i < rating ? 'star-filled' : 'star-empty'}
      />
    ));
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
              <FiMessageSquare /> Testimonials Management
            </h1>
            <p className="admin-subtitle">Moderate customer testimonials</p>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        {loading ? (
          <TestimonialsSkeleton />
        ) : testimonials.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiMessageSquare />
            <p>No testimonials found</p>
          </motion.div>
        ) : (
          <motion.div
            className="testimonials-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <div className="testimonial-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {testimonial.avatar ? (
                        <img src={testimonial.avatar} alt={testimonial.name} />
                      ) : (
                        testimonial.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="user-name">{testimonial.name}</div>
                      <div className="rating">{renderStars(testimonial.rating)}</div>
                    </div>
                  </div>
                  <div className="badges">
                    {testimonial.is_featured && (
                      <span className="badge featured">Featured</span>
                    )}
                    {testimonial.is_approved && (
                      <span className="badge approved">Approved</span>
                    )}
                  </div>
                </div>

                <div className="testimonial-body">
                  <p className="testimonial-message">"{testimonial.message}"</p>
                </div>

                <div className="testimonial-actions">
                  {!testimonial.is_featured && (
                    <motion.button
                      className="action-btn feature-btn"
                      onClick={() => openModal(testimonial, 'feature')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiStar /> Feature
                    </motion.button>
                  )}
                  {testimonial.is_approved ? (
                    <motion.button
                      className="action-btn remove-btn"
                      onClick={() => openModal(testimonial, 'unapprove')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiX /> Remove
                    </motion.button>
                  ) : (
                    <motion.button
                      className="action-btn approve-btn"
                      onClick={() => openModal(testimonial, 'approve')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiCheck /> Approve
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>
                    {modalAction === 'feature' && 'Feature Testimonial'}
                    {modalAction === 'approve' && 'Approve Testimonial'}
                    {modalAction === 'unapprove' && 'Remove Testimonial'}
                  </h2>
                  <button className="close-btn" onClick={closeModal}>
                    <FiX />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="testimonial-preview">
                    <p><strong>From:</strong> {selectedTestimonial?.name}</p>
                    <p><strong>Message:</strong> "{selectedTestimonial?.message}"</p>
                  </div>
                  <p className="confirmation-text">
                    Are you sure you want to {modalAction} this testimonial?
                  </p>
                </div>

                <div className="modal-footer">
                  <button className="cancel-btn" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    className={`submit-btn ${modalAction}-btn`}
                    onClick={handleAction}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Testimonials;
