import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiPackage, 
  FiShoppingCart,
  FiUserCheck,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiArrowLeft
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LottiePlayer from '../common/LottiePlayer';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FiHome />,
      path: '/admin/dashboard',
    },
    {
      title: 'Seller Requests',
      icon: <FiUserCheck />,
      path: '/admin/seller-requests',
      badge: 0, // Will be dynamic
    },
    {
      title: 'Users',
      icon: <FiUsers />,
      path: '/admin/users',
    },
    {
      title: 'Products',
      icon: <FiPackage />,
      path: '/admin/products',
    },
    {
      title: 'Orders',
      icon: <FiShoppingCart />,
      path: '/admin/orders',
    },
    {
      title: 'Testimonials',
      icon: <FiMessageSquare />,
      path: '/admin/testimonials',
    },
    {
      title: 'Settings',
      icon: <FiSettings />,
      path: '/admin/settings',
    },
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
          <NavLink to="/admin/dashboard" className="sidebar-logo">
            <LottiePlayer 
              src="/animations/logo.json"
              loop={true}
              style={{ width: 50, height: 50 }}
            />
            <span className="sidebar-logo-text">ANX Admin</span>
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
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.title}</span>
                {item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
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

          {/* Theme Toggle */}
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

          {/* Logout */}
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

      {/* Overlay for mobile */}
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

export default AdminSidebar;
