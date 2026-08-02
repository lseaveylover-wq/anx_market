import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiUser,
  FiFileText,
  FiShoppingBag,
  FiGrid,
  FiShare2,
  FiSettings,
  FiGlobe,
  FiHelpCircle,
  FiShield,
  FiLogOut,
  FiChevronRight,
  FiMoon
} from 'react-icons/fi';
import BecomeSellerModal from '../../components/common/BecomeSellerModal';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);

  // Dark mode — persisted in localStorage, no backend needed
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return document.body.classList.contains('dark-mode');
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to log out');
    }
  };

  const accountId = user?.id ? (1004162300 + Number(user.id)) : '1004162370';

  const renderDashboardOrSellerItem = () => {
    if (user?.role === 'admin') {
      return (
        <div className="group-list-item" onClick={() => navigate('/admin/dashboard')}>
          <div className="item-left">
            <FiGrid className="item-icon" />
            <span className="item-label">Admin Dashboard</span>
          </div>
          <FiChevronRight className="item-chevron" />
        </div>
      );
    }

    if (user?.role === 'seller') {
      return (
        <div className="group-list-item" onClick={() => navigate('/admin/dashboard')}>
          <div className="item-left">
            <FiShoppingBag className="item-icon" />
            <span className="item-label">Seller Dashboard</span>
          </div>
          <FiChevronRight className="item-chevron" />
        </div>
      );
    }

    return (
      <div className="group-list-item" onClick={() => setIsSellerModalOpen(true)}>
        <div className="item-left">
          <FiShoppingBag className="item-icon" />
          <span className="item-label">Become a seller</span>
        </div>
      </div>
    );
  };

  return (
    <div className="mobile-profile-container">
      {/* Top Banner & User Card Header */}
      <div className="profile-header-banner">
        <motion.div
          className="profile-user-card"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="profile-user-info">
            <div className="profile-avatar-wrapper">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-user-details">
              <h2 className="profile-user-name">{user?.name || 'Guest User'}</h2>
              <p className="profile-account-id">Account ID: {accountId}</p>
            </div>
          </div>

          {/* Balances Card */}
          <div className="profile-balances-card">
            <div className="balance-item">
              <div className="balance-left">
                <span className="balance-badge green">SC</span>
                <span className="balance-label">ANX Store Credit</span>
              </div>
              <span className="balance-value">0.00 <small>USD</small></span>
            </div>

            <div className="balance-item">
              <div className="balance-left">
                <span className="balance-badge gold">G</span>
                <span className="balance-label">ANX Points</span>
              </div>
              <span className="balance-value">730</span>
            </div>

            <div className="balance-item">
              <div className="balance-left">
                <span className="balance-badge blue">$</span>
                <span className="balance-label">Available Balance</span>
              </div>
              <span className="balance-value">0.00 <small>USD</small></span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Options Group Sections */}
      <div className="profile-sections-wrapper">
        {/* Section 1: General */}
        <motion.div
          className="profile-group-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="group-card-title">General</h3>

          <div className="group-list">
            <div className="group-list-item" onClick={() => navigate('/purchase-history')}>
              <div className="item-left">
                <FiFileText className="item-icon" />
                <span className="item-label">Purchase History</span>
              </div>
              <FiChevronRight className="item-chevron" />
            </div>

            {renderDashboardOrSellerItem()}

            <div className="group-list-item" onClick={() => toast.success('Referral link copied!')}>
              <div className="item-left">
                <FiShare2 className="item-icon" />
                <span className="item-label">Join affiliate program</span>
              </div>
            </div>

            <div className="group-list-item" onClick={() => navigate('/settings')}>
              <div className="item-left">
                <FiSettings className="item-icon" />
                <span className="item-label">Settings</span>
              </div>
              <FiChevronRight className="item-chevron" />
            </div>
          </div>
        </motion.div>

        {/* Section 2: Support & Legal */}
        <motion.div
          className="profile-group-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="group-card-title">Support & Legal</h3>

          <div className="group-list">
            <div className="group-list-item" onClick={() => toast('Language: English (US)')}>
              <div className="item-left">
                <FiGlobe className="item-icon" />
                <span className="item-label">Country & Language</span>
              </div>
              <FiChevronRight className="item-chevron" />
            </div>

            <div className="group-list-item" onClick={() => navigate('/contact')}>
              <div className="item-left">
                <FiHelpCircle className="item-icon" />
                <span className="item-label">Help Center</span>
              </div>
            </div>

            <div className="group-list-item" onClick={() => toast('Terms of Service & Privacy Policy')}>
              <div className="item-left">
                <FiShield className="item-icon" />
                <span className="item-label">Legal</span>
              </div>
              <FiChevronRight className="item-chevron" />
            </div>
          </div>
        </motion.div>

        {/* Section 3: Dark Mode Toggle */}
        <motion.div
          className="profile-group-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="dark-mode-row">
            <div className="item-left">
              <FiMoon className="item-icon dark-mode-icon" />
              <span className="item-label">Dark mode</span>
            </div>
            <button
              className={`fb-toggle ${isDarkMode ? 'fb-toggle--on' : ''}`}
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              role="switch"
              aria-checked={isDarkMode}
            >
              <span className="fb-toggle__thumb" />
            </button>
          </div>
        </motion.div>

        {/* Section 4: Log Out Button */}
        <motion.div
          className="profile-group-card logout-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          onClick={handleLogout}
        >
          <div className="group-list-item logout-item">
            <div className="item-left">
              <FiLogOut className="item-icon logout-icon" />
              <span className="item-label logout-label">Log Out</span>
            </div>
          </div>
        </motion.div>

        {/* App Version Tag */}
        <div className="profile-version-tag">
          Version 4.4.3
        </div>
      </div>

      <BecomeSellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
