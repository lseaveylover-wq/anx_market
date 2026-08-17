import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiPackage, 
  FiShoppingCart, 
  FiDollarSign,
  FiUserCheck,
  FiAlertCircle,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { SkeletonDashboard, SkeletonBox } from '../../components/common/Skeleton';
import './AdminDashboard.css';

// ─── Skeleton primitives ───────────────────────────────────────────────────────

// ─── Skeleton primitives ───────────────────────────────────────────────────────

const SkeletonStatCard = () => (
  <div className="stat-card skeleton-card">
    <div className="stat-card-header">
      <SkeletonBox width="50px" height="50px" radius="15px" />
      <SkeletonBox width="70px" height="28px" radius="20px" />
    </div>
    <div className="stat-card-body">
      <SkeletonBox width="60%" height="2rem" radius="6px" />
      <SkeletonBox width="80%" height="0.9rem" radius="6px" style={{ marginTop: '0.5rem' }} />
    </div>
  </div>
);

const SkeletonActivityItem = () => (
  <div className="activity-item skeleton-activity">
    <SkeletonBox width="40px" height="40px" radius="10px" style={{ flexShrink: 0 }} />
    <div className="activity-content">
      <SkeletonBox width="85%" height="0.9rem" radius="6px" />
      <SkeletonBox width="40%" height="0.75rem" radius="6px" style={{ marginTop: '0.4rem' }} />
    </div>
  </div>
);

const SkeletonActionButton = () => (
  <div className="action-button skeleton-action">
    <SkeletonBox width="24px" height="24px" radius="6px" style={{ flexShrink: 0 }} />
    <SkeletonBox width="60%" height="0.95rem" radius="6px" />
  </div>
);

// ─── Dashboard Skeleton ────────────────────────────────────────────────────────

const DashboardSkeleton = () => (
  <div className="admin-content">
    {/* Header skeleton */}
    <div className="admin-header skeleton-header">
      <div className="admin-header-content">
        <SkeletonBox width="260px" height="2rem" radius="8px" />
        <SkeletonBox width="180px" height="1rem" radius="6px" style={{ marginTop: '0.6rem' }} />
      </div>
      <div className="admin-user-badge" style={{ pointerEvents: 'none', gap: '1rem' }}>
        <SkeletonBox width="45px" height="45px" radius="50%" style={{ flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <SkeletonBox width="110px" height="0.9rem" radius="6px" />
          <SkeletonBox width="80px"  height="0.75rem" radius="6px" />
        </div>
      </div>
    </div>

    {/* Stats grid skeleton */}
    <div className="stats-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>

    {/* Bottom panels skeleton */}
    <div className="dashboard-grid">
      {/* Recent Activity panel */}
      <div className="dashboard-card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <SkeletonBox width="20px" height="20px" radius="4px" />
            <SkeletonBox width="140px" height="1.1rem" radius="6px" />
          </div>
        </div>
        <div className="card-body">
          <div className="activity-list">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonActivityItem key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions panel */}
      <div className="dashboard-card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <SkeletonBox width="20px" height="20px" radius="4px" />
            <SkeletonBox width="120px" height="1.1rem" radius="6px" />
          </div>
        </div>
        <div className="card-body">
          <div className="quick-actions">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonActionButton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingSellerRequests: 0,
    activeDisputes: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats || {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingSellerRequests: 0,
        activeDisputes: 0,
      });
      setRecentActivity(response.data.recentActivity || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FiUsers />,
      color: '#667eea',
      change: '+12%',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <FiPackage />,
      color: '#f59e0b',
      change: '+8%',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <FiShoppingCart />,
      color: '#10b981',
      change: '+23%',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <FiDollarSign />,
      color: '#B62A2D',
      change: '+15%',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingSellerRequests,
      icon: <FiUserCheck />,
      color: '#ec4899',
      change: stats.pendingSellerRequests > 0 ? 'Action Needed' : 'All Clear',
    },
    {
      title: 'Active Disputes',
      value: stats.activeDisputes,
      icon: <FiAlertCircle />,
      color: '#ef4444',
      change: stats.activeDisputes > 0 ? 'Needs Attention' : 'All Clear',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <motion.div
          className="admin-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="admin-header-content">
            <h1 className="admin-title">Dashboard Overview</h1>
            <p className="admin-subtitle">Welcome back, {user?.name}!</p>
          </div>
          <div className="admin-header-actions">
            <motion.div 
              className="admin-user-badge"
              whileHover={{ scale: 1.05 }}
            >
              <div className="admin-user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="admin-user-info">
                <span className="admin-user-name">{user?.name}</span>
                <span className="admin-user-role">Administrator</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)' }}
            >
              <div className="stat-card-header">
                <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                  {stat.icon}
                </div>
                <span className="stat-change">{stat.change}</span>
              </div>
              <div className="stat-card-body">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity & Quick Actions */}
        <div className="dashboard-grid">
          {/* Recent Activity */}
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card-header">
              <h2 className="card-title">
                <FiActivity /> Recent Activity
              </h2>
            </div>
            <div className="card-body">
              {recentActivity.length > 0 ? (
                <div className="activity-list">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <FiActivity />
                      </div>
                      <div className="activity-content">
                        <p className="activity-text">{activity.message}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FiActivity />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-header">
              <h2 className="card-title">
                <FiTrendingUp /> Quick Actions
              </h2>
            </div>
            <div className="card-body">
              <div className="quick-actions">
                <motion.button
                  className="action-button"
                  onClick={() => navigate('/admin/seller-requests')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiUserCheck />
                  <span>Review Seller Requests</span>
                  {stats.pendingSellerRequests > 0 && (
                    <span className="badge">{stats.pendingSellerRequests}</span>
                  )}
                </motion.button>
                <motion.button
                  className="action-button"
                  onClick={() => navigate('/admin/users')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiUsers />
                  <span>Manage Users</span>
                </motion.button>
                <motion.button
                  className="action-button"
                  onClick={() => navigate('/admin/products')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiPackage />
                  <span>Manage Products</span>
                </motion.button>
                <motion.button
                  className="action-button"
                  onClick={() => navigate('/admin/orders')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiShoppingCart />
                  <span>View All Orders</span>
                </motion.button>
                <motion.button
                  className="action-button"
                  onClick={() => navigate('/admin/testimonials')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiAlertCircle />
                  <span>Moderate Testimonials</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
