import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUserCheck, FiX, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { SkeletonBox, SkeletonGrid } from '../../components/common/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './SellerRequests.css';

/* ── Seller request card skeleton ───────────────────────────────────────── */
const SkeletonRequestCard = () => (
  <div className="request-card" style={{ pointerEvents: 'none' }}>
    {/* Header: avatar + name/email + status badge */}
    <div className="request-header">
      <div className="user-info">
        <SkeletonBox width="50px" height="50px" radius="50%" style={{ flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <SkeletonBox width="130px" height="1rem" radius="6px" />
          <SkeletonBox width="160px" height="0.8rem" radius="6px" />
        </div>
      </div>
      <SkeletonBox width="90px" height="32px" radius="20px" style={{ flexShrink: 0 }} />
    </div>

    {/* Body: 4 info rows */}
    <div className="request-body">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="info-row">
          <SkeletonBox width="110px" height="0.85rem" radius="6px" style={{ flexShrink: 0 }} />
          <SkeletonBox width={`${45 + i * 10}%`} height="0.85rem" radius="6px" />
        </div>
      ))}
    </div>

    {/* Actions: two buttons */}
    <div className="request-actions">
      <SkeletonBox height="46px" radius="12px" style={{ flex: 1 }} />
      <SkeletonBox height="46px" radius="12px" style={{ flex: 1 }} />
    </div>

    {/* Footer */}
    <div className="request-footer">
      <SkeletonBox width="140px" height="0.8rem" radius="6px" />
    </div>
  </div>
);


const SellerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(''); // approve or reject
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/seller-requests?status=${filter === 'all' ? '' : filter}`);
      // Handle both paginated and non-paginated responses
      const data = response.data.data || response.data;
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching seller requests:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch seller requests');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (request, action) => {
    setSelectedRequest(request);
    setModalAction(action);
    setAdminNote('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setModalAction('');
    setAdminNote('');
  };

  const handleAction = async () => {
    if (modalAction === 'reject' && !adminNote.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(true);
      const endpoint = `/admin/seller-requests/${selectedRequest.id}/${modalAction}`;
      await api.post(endpoint, { admin_note: adminNote });
      
      toast.success(`Seller request ${modalAction}d successfully`);
      closeModal();
      fetchRequests();
    } catch (error) {
      console.error(`Error ${modalAction}ing request:`, error);
      toast.error(error.response?.data?.message || `Failed to ${modalAction} request`);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock />;
      case 'approved': return <FiCheck />;
      case 'rejected': return <FiX />;
      default: return <FiAlertCircle />;
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
              <FiUserCheck /> Seller Requests
            </h1>
            <p className="admin-subtitle">Review and manage seller applications</p>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="filter-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
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

        {/* Requests List */}
        {loading ? (
          <div className="requests-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRequestCard key={i} />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiUserCheck />
            <p>No {filter !== 'all' ? filter : ''} seller requests found</p>
          </motion.div>
        ) : (
          <motion.div
            className="requests-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {requests.map((request) => (
              <motion.div
                key={request.id}
                className="request-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <div className="request-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {request.user?.avatar ? (
                        <img src={request.user.avatar} alt={request.user.name} />
                      ) : (
                        request.user?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="user-details">
                      <h3>{request.user?.name}</h3>
                      <p>{request.user?.email}</p>
                    </div>
                  </div>
                  <span
                    className="status-badge"
                    style={{
                      background: `${getStatusColor(request.status)}20`,
                      color: getStatusColor(request.status),
                    }}
                  >
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>
                </div>

                <div className="request-body">
                  <div className="info-row">
                    <span className="label">Business Name:</span>
                    <span className="value">{request.business_name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Business Email:</span>
                    <span className="value">{request.business_email}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{request.phone_number}</span>
                  </div>
                  <div className="info-row full">
                    <span className="label">Description:</span>
                    <p className="description">{request.reason}</p>
                  </div>
                  {request.admin_note && (
                    <div className="admin-note">
                      <strong>Admin Note:</strong> {request.admin_note}
                    </div>
                  )}
                </div>

                {request.status === 'pending' && (
                  <div className="request-actions">
                    <motion.button
                      className="action-btn approve-btn"
                      onClick={() => openModal(request, 'approve')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiCheck /> Approve
                    </motion.button>
                    <motion.button
                      className="action-btn reject-btn"
                      onClick={() => openModal(request, 'reject')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiX /> Reject
                    </motion.button>
                  </div>
                )}

                <div className="request-footer">
                  <span className="timestamp">
                    Applied {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Action Modal */}
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
                    {modalAction === 'approve' ? (
                      <>
                        <FiCheck /> Approve Seller Request
                      </>
                    ) : (
                      <>
                        <FiX /> Reject Seller Request
                      </>
                    )}
                  </h2>
                  <button className="close-btn" onClick={closeModal}>
                    <FiX />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="request-summary">
                    <p>
                      <strong>User:</strong> {selectedRequest?.user?.name}
                    </p>
                    <p>
                      <strong>Business:</strong> {selectedRequest?.business_name}
                    </p>
                  </div>

                  <div className="form-group">
                    <label>
                      {modalAction === 'approve' ? 'Approval Note (Optional)' : 'Rejection Reason (Required)'}
                    </label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder={
                        modalAction === 'approve'
                          ? 'Add a note for the seller...'
                          : 'Explain why this request is being rejected...'
                      }
                      rows="4"
                      required={modalAction === 'reject'}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="cancel-btn" onClick={closeModal} disabled={processing}>
                    Cancel
                  </button>
                  <button
                    className={`submit-btn ${modalAction}-btn`}
                    onClick={handleAction}
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : modalAction === 'approve' ? 'Approve' : 'Reject'}
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

export default SellerRequests;
