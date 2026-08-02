import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTruck, FiCheckCircle, FiClock, FiShield, FiSend, FiX, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { sellerApi } from '../../../services/seller.api';
import { SkeletonBox } from '../../../components/common/Skeleton';
import '../SellerHub.css';

const Deliveries: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [deliveryText, setDeliveryText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [proofUrl, setProofUrl] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['sellerDeliveries'],
    queryFn: () => sellerApi.getDeliveries(),
  });

  const submitMutation = useMutation({
    mutationFn: ({ orderId, payload }: { orderId: number; payload: any }) =>
      sellerApi.submitDelivery(orderId, payload),
    onSuccess: () => {
      toast.success('Delivery details submitted successfully!');
      setSelectedOrder(null);
      setDeliveryText('');
      setInstructions('');
      setProofUrl('');
      queryClient.invalidateQueries({ queryKey: ['sellerDeliveries'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to submit delivery details.');
    },
  });

  if (isLoading) {
    return (
      <>
        <div className="seller-header" style={{ pointerEvents: 'none' }}>
          <SkeletonBox width="220px" height="2rem" radius="8px" />
        </div>
        <div className="seller-panel">
          <div className="seller-panel-body">
            <SkeletonBox width="100%" height="300px" radius="12px" />
          </div>
        </div>
      </>
    );
  }

  const orders = data?.orders?.data || [];
  const deliveries = data?.deliveries || {};

  const handleOpenDeliveryModal = (order: any) => {
    setSelectedOrder(order);
    const existing = deliveries[order.id];
    if (existing) {
      setDeliveryText(existing.delivery_text || '');
      setInstructions(existing.instructions || '');
      setProofUrl(existing.proof_files?.[0] || '');
    } else {
      setDeliveryText('');
      setInstructions('');
      setProofUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryText.trim()) {
      toast.error('Delivery text / credentials details are required.');
      return;
    }

    submitMutation.mutate({
      orderId: selectedOrder.id,
      payload: {
        delivery_text: deliveryText,
        instructions: instructions,
        proof_files: proofUrl ? [proofUrl] : [],
      },
    });
  };

  return (
    <>
      {/* Header */}
      <motion.div
        className="seller-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="seller-header-content">
          <h1>Manual Deliveries</h1>
          <p className="seller-subtitle">Upload credentials, files, and proof of delivery for non-automated orders</p>
        </div>
      </motion.div>

      {/* Content Table */}
      <motion.div
        className="seller-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table className="seller-table" style={{ minWidth: 800 }}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Buyer</th>
                <th>Product</th>
                <th>Order Status</th>
                <th>Delivery Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="seller-empty">
                      <FiTruck />
                      <p>No active manual deliveries found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => {
                  const delivery = deliveries[order.id];
                  return (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>#{order.order_number}</td>
                      <td>{order.buyer?.name || 'Customer'}</td>
                      <td>{order.items?.[0]?.product?.title || 'Game Account'}</td>
                      <td>
                        <span className={`seller-badge ${order.status}`}>{order.status}</span>
                      </td>
                      <td>
                        {delivery ? (
                          <span className="seller-badge available" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <FiCheckCircle /> Delivered
                          </span>
                        ) : (
                          <span className="seller-badge draft" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <FiClock /> Pending Submission
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <motion.button
                          onClick={() => handleOpenDeliveryModal(order)}
                          className="seller-cta-btn"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          style={{
                            padding: '0.45rem 1rem',
                            fontSize: '0.85rem',
                            marginLeft: 'auto',
                            background: delivery ? 'var(--bg-surface)' : 'linear-gradient(135deg, #B62A2D 0%, #D5575E 100%)',
                            border: delivery ? '1px solid var(--border-color)' : 'none',
                            color: delivery ? 'var(--text-primary)' : '#fff'
                          }}
                        >
                          <FiSend /> {delivery ? 'View / Edit Delivery' : 'Upload Proof'}
                        </motion.button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delivery Submission Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              backgroundColor: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="seller-panel"
              style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div className="seller-panel-header">
                <h2 className="seller-panel-title">
                  <FiShield /> Delivery Credentials - Order #{selectedOrder.order_number}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.25rem', cursor: 'pointer' }}
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="seller-panel-body">
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: 'rgba(182, 42, 45, 0.1)',
                      border: '1px solid rgba(182, 42, 45, 0.25)',
                      color: 'var(--text-primary)',
                      marginBottom: '1.25rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <strong>Encrypted Delivery Transfer</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Credentials entered here will be encrypted and released directly to buyer #{selectedOrder.order_number}.
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="seller-form-label">
                      Account Credentials / Info <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      className="seller-form-textarea"
                      rows={4}
                      placeholder="Username, password, email details, secret keys..."
                      value={deliveryText}
                      onChange={(e) => setDeliveryText(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="seller-form-label">Special Instructions for Buyer (Optional)</label>
                    <textarea
                      className="seller-form-textarea"
                      rows={2}
                      placeholder="e.g. Log in via VPN or verify email link..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="seller-form-label">Proof Screenshot / URL (Optional)</label>
                    <input
                      type="url"
                      className="seller-form-input"
                      placeholder="https://example.com/screenshot.png"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="seller-page-btn"
                      onClick={() => setSelectedOrder(null)}
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="seller-cta-btn"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <FiSend /> {submitMutation.isPending ? 'Submitting...' : 'Submit Delivery'}
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Deliveries;
