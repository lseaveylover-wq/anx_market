import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  FiCreditCard, FiDollarSign, FiTrendingUp,
  FiArrowUpRight, FiCheckCircle, FiX, FiClock
} from 'react-icons/fi';
import { useSellerStore } from '../../../store/useSellerStore';
import { SkeletonBox } from '../../../components/common/Skeleton';
import toast from 'react-hot-toast';
import '../SellerHub.css';

const Wallet: React.FC = () => {
  const { stats, isLoading } = useSellerStore();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const walletBalance = stats?.walletBalance || 0;
  const totalEarnings  = stats?.totalSales    || 0;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { toast.error('Enter a valid amount'); return; }
    if (amt > walletBalance)    { toast.error('Exceeds available balance'); return; }
    setSubmitting(true);
    setTimeout(() => {
      toast.success(`Withdrawal of $${amt.toFixed(2)} submitted!`);
      setSubmitting(false);
      setShowModal(false);
      setAmount('');
    }, 1000);
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
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
          <h1>Wallet</h1>
          <p className="seller-subtitle">Manage your earnings and withdrawals</p>
        </div>
        <div className="seller-header-actions">
          <motion.button
            className="seller-cta-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
          >
            <FiArrowUpRight /> Withdraw Funds
          </motion.button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        className="seller-stats-grid"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="seller-skeleton-stat" style={{ height: 160 }} />
          ))
        ) : [
          {
            title: 'Available Balance',
            value: `$${walletBalance.toFixed(2)}`,
            icon: <FiCreditCard />,
            color: '#B62A2D',
            change: 'Ready to withdraw',
          },
          {
            title: 'Total Earnings',
            value: `$${totalEarnings.toFixed(2)}`,
            icon: <FiDollarSign />,
            color: '#10b981',
            change: '+12% this month',
          },
          {
            title: "Today's Revenue",
            value: `$${(stats?.todayRevenue || 0).toFixed(2)}`,
            icon: <FiTrendingUp />,
            color: '#667eea',
            change: 'Live',
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            className="seller-stat-card"
            variants={item}
            whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}
          >
            <div className="seller-stat-card-header">
              <div className="seller-stat-icon" style={{ background: `${card.color}20`, color: card.color }}>
                {card.icon}
              </div>
              <span className="seller-stat-change">{card.change}</span>
            </div>
            <div className="seller-stat-card-body">
              <h3 className="seller-stat-value">{card.value}</h3>
              <p className="seller-stat-label">{card.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Transaction History (placeholder activity list) */}
      <motion.div
        className="seller-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="seller-panel-header">
          <h2 className="seller-panel-title">
            <FiClock /> Transaction History
          </h2>
        </div>
        <div className="seller-panel-body">
          {isLoading ? (
            <div className="seller-activity-list">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="seller-activity-item" style={{ pointerEvents: 'none' }}>
                  <SkeletonBox width="40px" height="40px" radius="10px" style={{ flexShrink: 0 }} />
                  <div className="seller-activity-content">
                    <SkeletonBox width="75%" height="0.9rem" radius="6px" />
                    <SkeletonBox width="40%" height="0.75rem" radius="6px" style={{ marginTop: '0.4rem' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="seller-activity-list">
              {[
                { icon: <FiCheckCircle />, text: 'Order sale credited — $25.00', time: '2 hours ago', positive: true },
                { icon: <FiArrowUpRight />, text: 'Withdrawal processed — $100.00', time: 'Yesterday', positive: false },
                { icon: <FiCheckCircle />, text: 'Order sale credited — $47.50', time: '3 days ago', positive: true },
                { icon: <FiCheckCircle />, text: 'Order sale credited — $15.00', time: '1 week ago', positive: true },
              ].map((t, i) => (
                <div key={i} className="seller-activity-item">
                  <div className="seller-activity-icon" style={{ color: t.positive ? '#10b981' : '#ef4444', background: `${t.positive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}` }}>
                    {t.icon}
                  </div>
                  <div className="seller-activity-content">
                    <p className="seller-activity-text">{t.text}</p>
                    <span className="seller-activity-time">{t.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)',
              zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 20,
                width: '100%',
                maxWidth: 480,
                overflow: 'hidden',
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FiArrowUpRight style={{ color: '#D5575E' }} /> Withdraw Funds
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.25rem', display: 'flex', alignItems: 'center' }}
                >
                  <FiX />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleWithdraw} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{
                  padding: '1rem 1.5rem',
                  background: 'linear-gradient(135deg, rgba(182,42,45,0.08) 0%, rgba(213,87,94,0.08) 100%)',
                  border: '1px solid rgba(182,42,45,0.2)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Available Balance</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(135deg,#B62A2D,#D5575E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ${walletBalance.toFixed(2)}
                  </span>
                </div>

                <div>
                  <label className="seller-form-label">Withdrawal Amount (USD)</label>
                  <input
                    type="number"
                    className="seller-form-input"
                    placeholder="0.00"
                    min="0.01"
                    max={walletBalance}
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ padding: '0.875rem 1.5rem', borderRadius: 12, border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    className="seller-cta-btn"
                    disabled={submitting}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {submitting ? 'Processing…' : 'Confirm Withdrawal'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Wallet;
