import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiSend, FiShoppingCart, FiCreditCard,
  FiBox, FiTruck, FiCheckCircle, FiMessageSquare, FiShield
} from 'react-icons/fi';
import { sellerApi } from '../../../services/seller.api';
import { SkeletonBox } from '../../../components/common/Skeleton';
import '../SellerHub.css';

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ['sellerOrder', id],
    queryFn: () => sellerApi.getOrderDetails(Number(id)),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <>
        <div className="seller-header" style={{ pointerEvents: 'none' }}>
          <SkeletonBox width="240px" height="2rem" radius="8px" />
        </div>
        <div className="seller-panel">
          <div className="seller-panel-body">
            <SkeletonBox width="100%" height="200px" radius="12px" />
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <div className="seller-panel" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Order Not Found</h2>
        <button onClick={() => navigate('/seller/orders')} className="seller-cta-btn" style={{ margin: '0 auto' }}>
          <FiArrowLeft /> Back to Orders
        </button>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Order Placed', icon: <FiShoppingCart /> },
    { key: 'paid', label: 'Payment Received', icon: <FiCreditCard /> },
    { key: 'delivering', label: 'Preparing / Delivering', icon: <FiBox /> },
    { key: 'delivered', label: 'Delivered', icon: <FiTruck /> },
    { key: 'completed', label: 'Completed', icon: <FiCheckCircle /> }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status) !== -1 
    ? steps.findIndex(s => s.key === order.status) 
    : order.status === 'refunded' || order.status === 'cancelled' ? -1 : 4;

  const isAutoDelivery = order.items?.[0]?.product?.auto_delivery;

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
          <button
            type="button"
            onClick={() => navigate('/seller/orders')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
              padding: 0
            }}
          >
            <FiArrowLeft /> Back to Orders
          </button>
          <h1>Order #{order.order_number}</h1>
          <p className="seller-subtitle">View purchase details, buyer info, and delivery status</p>
        </div>
        <div className="seller-header-actions">
          {order.status === 'delivering' && !isAutoDelivery && (
            <motion.button
              className="seller-cta-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/seller/deliveries')}
            >
              <FiSend /> Submit Delivery Credentials
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Progress Stepper */}
      <motion.div
        className="seller-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <div className="seller-panel-header">
          <h2 className="seller-panel-title">
            <FiTruck /> Order Status Progress
          </h2>
          <span className={`seller-badge ${order.status}`}>{order.status}</span>
        </div>
        <div className="seller-panel-body">
          {order.status === 'cancelled' || order.status === 'refunded' ? (
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444' }}>
              <strong>Order {order.status.toUpperCase()}</strong>: This order did not complete successfully.
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '1rem 0' }}>
              {/* Line */}
              <div style={{ position: 'absolute', top: '50%', left: '5%', right: '5%', height: '3px', background: 'var(--border-color)', zIndex: 1, transform: 'translateY(-50%)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 1 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #B62A2D, #D5575E)' }}
                />
              </div>

              {steps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                return (
                  <div key={step.key} style={{ position: 'relative', zIndex: 2, textAlign: 'center', flex: 1 }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        margin: '0 auto 0.5rem auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        background: isActive ? 'linear-gradient(135deg, #B62A2D 0%, #D5575E 100%)' : 'var(--bg-surface)',
                        color: isActive ? '#fff' : 'var(--text-secondary)',
                        border: `2px solid ${isActive ? '#B62A2D' : 'var(--border-color)'}`
                      }}
                    >
                      {step.icon}
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Grid: Items + Buyer Info */}
      <div className="seller-dashboard-grid">
        {/* Purchased Items */}
        <motion.div
          className="seller-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="seller-panel-header">
            <h2 className="seller-panel-title">
              <FiBox /> Purchased Products
            </h2>
          </div>
          <div className="seller-panel-body">
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                <img
                  src={item.product?.cover_image || 'https://via.placeholder.com/80'}
                  alt={item.product?.title}
                  style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{item.product?.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {item.product?.server || 'Global'} • {item.product?.category?.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="seller-price">${Number(item.price).toFixed(2)}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</div>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Total Payout</span>
              <span className="seller-stat-value" style={{ fontSize: '1.75rem' }}>${Number(order.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Buyer Info */}
        <motion.div
          className="seller-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="seller-panel-header">
            <h2 className="seller-panel-title">
              <FiShield /> Buyer & Escrow Details
            </h2>
          </div>
          <div className="seller-panel-body" style={{ textAlign: 'center' }}>
            <img
              src={order.buyer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.buyer?.name || 'Buyer')}&background=B62A2D&color=fff`}
              alt="Buyer"
              style={{ width: '72px', height: '72px', borderRadius: '50%', border: '3px solid var(--border-color)', margin: '0 auto 1rem auto', objectFit: 'cover' }}
            />
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 700 }}>{order.buyer?.name}</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.25rem 0', fontSize: '0.9rem' }}>{order.buyer?.email}</p>

            <motion.button
              className="seller-action-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/seller/messages')}
              style={{ justifyContent: 'center', marginBottom: '1.5rem' }}
            >
              <FiMessageSquare /> Contact Buyer
            </motion.button>

            <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block' }}>Order Date</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>{new Date(order.created_at).toLocaleString()}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block' }}>Payment Guarantee</span>
                <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <FiShield /> Protected in Escrow Vault
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default OrderDetails;
