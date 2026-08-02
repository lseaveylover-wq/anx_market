import React from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  FiDollarSign, FiShoppingCart, FiPackage, FiStar,
  FiClock, FiCheckCircle, FiCreditCard, FiTrendingUp,
  FiActivity, FiPlus, FiEye, FiArrowUpRight
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useSellerStore } from '../../../store/useSellerStore';
import { SkeletonBox } from '../../../components/common/Skeleton';
import '../SellerHub.css';

// ─── Skeleton Components ───────────────────────────────────────────────────
const SkeletonStatCard = () => (
  <div className="seller-stat-card seller-skeleton-stat" style={{ pointerEvents: 'none' }}>
    <div className="seller-stat-card-header">
      <SkeletonBox width="50px" height="50px" radius="15px" />
      <SkeletonBox width="70px" height="28px" radius="20px" />
    </div>
    <div className="seller-stat-card-body" style={{ marginTop: '1.5rem' }}>
      <SkeletonBox width="55%" height="2rem" radius="6px" />
      <SkeletonBox width="75%" height="0.9rem" radius="6px" style={{ marginTop: '0.5rem' }} />
    </div>
  </div>
);

const SkeletonActivityRow = () => (
  <div className="seller-activity-item" style={{ pointerEvents: 'none' }}>
    <SkeletonBox width="40px" height="40px" radius="10px" style={{ flexShrink: 0 }} />
    <div className="seller-activity-content">
      <SkeletonBox width="80%" height="0.9rem" radius="6px" />
      <SkeletonBox width="40%" height="0.75rem" radius="6px" style={{ marginTop: '0.4rem' }} />
    </div>
  </div>
);

const SkeletonActionRow = () => (
  <div className="seller-action-btn" style={{ pointerEvents: 'none' }}>
    <SkeletonBox width="24px" height="24px" radius="6px" style={{ flexShrink: 0 }} />
    <SkeletonBox width="55%" height="0.9rem" radius="6px" />
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const { user } = useAuth() as { user: any };
  const navigate = useNavigate();
  const { stats, isLoading } = useSellerStore();

  const fmt = (v: number) => `$${(v || 0).toFixed(2)}`;
  const num = (v: number) => new Intl.NumberFormat('en-US').format(v || 0);

  // ── Stat cards definition (mirrors AdminDashboard statCards) ──────────────
  const statCards = stats ? [
    { title: 'Total Revenue',     value: fmt(stats.totalSales),       icon: <FiDollarSign />,  color: '#B62A2D', change: '+12%' },
    { title: "Today's Revenue",   value: fmt(stats.todayRevenue),     icon: <FiTrendingUp />,  color: '#667eea', change: '+8%' },
    { title: 'Active Products',   value: num(stats.activeProducts),   icon: <FiPackage />,     color: '#f59e0b', change: '+23%' },
    { title: 'Pending Orders',    value: num(stats.pendingOrders),    icon: <FiClock />,       color: '#ec4899', change: stats.pendingOrders > 0 ? 'Action Needed' : 'All Clear' },
    { title: 'Completed Orders',  value: num(stats.completedOrders),  icon: <FiCheckCircle />, color: '#10b981', change: '+15%' },
    { title: 'Average Rating',    value: `${stats.averageRating || '–'}/5.0`, icon: <FiStar />, color: '#f59e0b', change: '★ Top Seller' },
    { title: 'Wallet Balance',    value: fmt(stats.walletBalance),    icon: <FiCreditCard />,  color: '#B62A2D', change: 'Available' },
    { title: 'Conversion Rate',   value: `${stats.conversionRate || 0}%`, icon: <FiShoppingCart />, color: '#10b981', change: '+3.4%' },
  ] : [];

  // ── Framer Motion variants (identical to AdminDashboard) ──────────────────
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading || !stats) {
    return (
      <>
        {/* Header skeleton */}
        <div className="seller-header" style={{ pointerEvents: 'none' }}>
          <div className="seller-header-content">
            <SkeletonBox width="260px" height="2rem" radius="8px" />
            <SkeletonBox width="180px" height="1rem" radius="6px" style={{ marginTop: '0.6rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <SkeletonBox width="45px" height="45px" radius="50%" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', justifyContent: 'center' }}>
              <SkeletonBox width="100px" height="0.9rem" radius="6px" />
              <SkeletonBox width="70px"  height="0.75rem" radius="6px" />
            </div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="seller-stats-grid">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>

        {/* Panels skeleton */}
        <div className="seller-dashboard-grid">
          {[0, 1].map(i => (
            <div key={i} className="seller-panel">
              <div className="seller-panel-header">
                <SkeletonBox width="140px" height="1.25rem" radius="6px" />
              </div>
              <div className="seller-panel-body">
                <div className="seller-activity-list">
                  {Array.from({ length: 4 }).map((_, j) => <SkeletonActivityRow key={j} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── Page Header (mirrors AdminDashboard header) ── */}
      <motion.div
        className="seller-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="seller-header-content">
          <h1>Dashboard Overview</h1>
          <p className="seller-subtitle">Welcome back, {user?.name}!</p>
        </div>
        <div className="seller-header-actions">
          <motion.div className="seller-user-badge" whileHover={{ scale: 1.05 }}>
            <div className="seller-user-avatar">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} />
                : user?.name?.charAt(0).toUpperCase()
              }
            </div>
            <div className="seller-user-info">
              <span className="seller-user-name">{user?.name}</span>
              <span className="seller-user-role">Seller</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Stats Grid (mirrors AdminDashboard stats grid exactly) ── */}
      <motion.div
        className="seller-stats-grid"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            className="seller-stat-card"
            variants={item}
            whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}
          >
            <div className="seller-stat-card-header">
              <div
                className="seller-stat-icon"
                style={{ background: `${card.color}20`, color: card.color }}
              >
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

      {/* ── Bottom Panels (mirrors AdminDashboard dashboard-grid) ── */}
      <div className="seller-dashboard-grid">

        {/* Recent Activity */}
        <motion.div
          className="seller-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="seller-panel-header">
            <h2 className="seller-panel-title">
              <FiActivity /> Recent Activity
            </h2>
          </div>
          <div className="seller-panel-body">
            <div className="seller-activity-list">
              {[
                { icon: <FiShoppingCart />, text: 'New order received for a product', time: '10 minutes ago' },
                { icon: <FiStar />,         text: 'You received a 5-star review',     time: '1 hour ago' },
                { icon: <FiPackage />,      text: 'Product stock updated',            time: '3 hours ago' },
                { icon: <FiCreditCard />,   text: 'Wallet credited from sale',        time: 'Yesterday' },
                { icon: <FiCheckCircle />,  text: 'Order marked as completed',        time: '2 days ago' },
              ].map((act, i) => (
                <div key={i} className="seller-activity-item">
                  <div className="seller-activity-icon">{act.icon}</div>
                  <div className="seller-activity-content">
                    <p className="seller-activity-text">{act.text}</p>
                    <span className="seller-activity-time">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="seller-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="seller-panel-header">
            <h2 className="seller-panel-title">
              <FiTrendingUp /> Quick Actions
            </h2>
          </div>
          <div className="seller-panel-body">
            <div className="seller-quick-actions">
              {[
                { icon: <FiPlus />,       label: 'Create New Product',  path: '/seller/products/create' },
                { icon: <FiShoppingCart />,label: 'Manage Orders',       path: '/seller/orders' },
                { icon: <FiPackage />,    label: 'View Inventory',      path: '/seller/inventory' },
                { icon: <FiCreditCard />, label: 'Withdraw Funds',      path: '/seller/wallet' },
                { icon: <FiArrowUpRight />,label: 'View Analytics',     path: '/seller/analytics' },
                { icon: <FiEye />,        label: 'Customer Reviews',    path: '/seller/reviews' },
              ].map((action, i) => (
                <motion.button
                  key={i}
                  className="seller-action-btn"
                  onClick={() => navigate(action.path)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </>
  );
};

export default Dashboard;
