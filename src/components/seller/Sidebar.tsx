import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiStar,
  FiTrendingUp,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiArchive,
  FiArrowLeft,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LottiePlayer from '../common/LottiePlayer';
/* Reuse EXACTLY the same CSS file as AdminSidebar — no extra specificity needed */
import '../admin/AdminSidebar.css';

const Sidebar: React.FC = () => {
  const { logout } = useAuth() as { logout: () => void };
  const { theme, toggleTheme } = useTheme() as { theme: string; toggleTheme: () => void };
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { title: 'Dashboard',  icon: <FiHome />,       path: '/seller/dashboard' },
    { title: 'Products',   icon: <FiPackage />,     path: '/seller/products'  },
    { title: 'Orders',     icon: <FiShoppingCart />, path: '/seller/orders'   },
    { title: 'Inventory',  icon: <FiArchive />,     path: '/seller/inventory' },
    { title: 'Analytics',  icon: <FiTrendingUp />,  path: '/seller/analytics' },
    { title: 'Reviews',    icon: <FiStar />,        path: '/seller/reviews'   },
    { title: 'Wallet',     icon: <FiCreditCard />,  path: '/seller/wallet'    },
    { title: 'Settings',   icon: <FiSettings />,    path: '/seller/settings'  },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <motion.button
        className="sidebar-toggle-mobile"
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileTap={{ scale: 0.95 }}
      >
        {isCollapsed ? <FiMenu /> : <FiX />}
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}
        initial={false}
        animate={{ x: isCollapsed ? -280 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="sidebar-header">
          <NavLink to="/seller/dashboard" className="sidebar-logo">
            <LottiePlayer
              src="/animations/logo.json"
              loop={true}
              style={{ width: 50, height: 50 }}
            />
            <span className="sidebar-logo-text">ANX Seller</span>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Main Menu</span>
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.title}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {/* Back to Home */}
          <motion.button
            className="sidebar-action back-home"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            title="Return to Main Storefront"
          >
            <span className="nav-icon"><FiArrowLeft /></span>
            <span className="nav-text">Back to Home</span>
          </motion.button>

          <motion.button
            className="sidebar-action"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="nav-icon">
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </span>
            <span className="nav-text">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </motion.button>

          <motion.button
            className="sidebar-action logout"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="nav-icon"><FiLogOut /></span>
            <span className="nav-text">Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <motion.div
          className="sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;
