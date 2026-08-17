import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiSun,
  FiMoon,
  FiUser,
  FiShoppingCart,
  FiLogOut,
  FiSettings,
  FiPackage,
  FiLogIn,
  FiUserPlus,
  FiX,
  FiShoppingBag,
  FiHome,
  FiGrid,
  FiInfo,
  FiMail,
  FiGlobe,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useRegion } from '../../contexts/RegionContext';
import RegionDropdown from '../common/RegionDropdown';
import AuthModal from '../auth/AuthModal';
import LottiePlayer from '../common/LottiePlayer';
import './DynamicIslandNav.css';

const DynamicIslandNav = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { selectedRegion } = useRegion();
  const navigate = useNavigate();
  const location = useLocation();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-container')) {
        setShowUserDropdown(false);
      }
      if (!e.target.closest('.search-overlay-container')) {
        setShowSearch(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
    setShowUserDropdown(false);
  };

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const handleUserAvatarClick = () => {
    if (isMobile) {
      if (isAuthenticated) {
        navigate('/profile');
      } else {
        openAuthModal('login');
      }
    } else {
      setShowUserDropdown((v) => !v);
    }
  };

  const handleSearchBtnClick = () => {
    if (isMobile) {
      navigate('/search');
      setShowSearch(false);
    } else {
      setShowSearch((v) => !v);
    }
  };

  // Hide nav on seller, admin, and payment callback routes
  if (
    location.pathname.startsWith('/seller') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/payment')
  ) {
    return null;
  }

  // On checkout pages (/products/:id and /orders), hide ONLY on mobile view so the mobile fixed checkout bar is clear, but show on desktop/web view!
  const isCheckoutPage =
    (location.pathname.startsWith('/products/') && location.pathname !== '/products') ||
    location.pathname === '/orders';

  if (isCheckoutPage && isMobile) {
    return null;
  }

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      <motion.nav
        className={`dynamic-island-nav ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: isMobile ? 120 : -100, opacity: 0 }}
        animate={{ y: visible ? 0 : (isMobile ? 120 : -100), opacity: visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="nav-container">

          {/* Left: Logo App Icon (Desktop Only) */}
          <Link to="/" className="logo-link desktop-only">
            <motion.div
              className="nav-logo-icon"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
            >
              <LottiePlayer
                src="/animations/logo.json"
                loop={true}
                style={{ width: 28, height: 28 }}
              />
            </motion.div>
          </Link>

          {/* Nav Links: Home, Products (Mobile & Desktop), About & Contact (Desktop Only) */}
          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} title="Home">
              <FiHome className="nav-link-icon" />
              <span className="nav-link-label">Home</span>
              {isActive('/') && (
                <motion.span
                  className="nav-link-underline"
                  layoutId="nav-underline"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>

            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`} title="Products">
              <FiGrid className="nav-link-icon" />
              <span className="nav-link-label">Products</span>
              {isActive('/products') && (
                <motion.span
                  className="nav-link-underline"
                  layoutId="nav-underline"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>

            <Link to="/about" className={`nav-link desktop-only ${isActive('/about') ? 'active' : ''}`} title="About">
              <FiInfo className="nav-link-icon" />
              <span className="nav-link-label">About</span>
              {isActive('/about') && (
                <motion.span
                  className="nav-link-underline"
                  layoutId="nav-underline"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>

            <Link to="/contact" className={`nav-link desktop-only ${isActive('/contact') ? 'active' : ''}`} title="Contact">
              <FiMail className="nav-link-icon" />
              <span className="nav-link-label">Contact</span>
              {isActive('/contact') && (
                <motion.span
                  className="nav-link-underline"
                  layoutId="nav-underline"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          </div>

          {/* Search Action (Middle on Mobile -> Navigates to /search) */}
          <div className="search-overlay-container">
            <motion.button
              className={`nav-icon-btn search-nav-btn ${isActive('/search') ? 'active' : ''}`}
              onClick={handleSearchBtnClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Search"
            >
              <AnimatePresence mode="wait">
                {showSearch && !isMobile ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <FiX />
                  </motion.span>
                ) : (
                  <motion.span key="search" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <FiSearch />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {showSearch && !isMobile && (
                <motion.form
                  className="search-popup"
                  onSubmit={handleSearch}
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <FiSearch className="search-popup-icon" />
                  <input
                    autoFocus
                    type="text"
                    className="search-popup-input"
                    placeholder="Search games, accounts…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right Icon Actions: Region Selector (Desktop Only), Theme Toggle (Desktop Only), Cart, User */}
          <div className="nav-actions">

            {/* Theme Toggle (Desktop Only) */}
            <motion.button
              className="nav-icon-btn theme-toggle desktop-only"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <FiSun />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <FiMoon />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Cart */}
            <motion.button
              className="nav-icon-btn cart-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => isAuthenticated ? navigate('/orders') : openAuthModal('login')}
              title="Cart / Orders"
            >
              <FiShoppingCart />
            </motion.button>

            {/* User Avatar / Icon */}
            <div className="user-menu-container">
              <motion.button
                className={`user-avatar-btn ${isAuthenticated ? 'authenticated' : ''}`}
                onClick={handleUserAvatarClick}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                title="Account"
              >
                {isAuthenticated && user ? (
                  user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )
                ) : (
                  <FiUser />
                )}
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserDropdown && !isMobile && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: isMobile ? 10 : -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: isMobile ? 10 : -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="dropdown-header">
                          <div className="user-info">
                            {user?.avatar && (
                              <img src={user.avatar} alt={user.name} className="user-avatar" />
                            )}
                            <div className="user-details">
                              <p className="user-name">{user?.name}</p>
                              <p className="user-email">{user?.email}</p>
                              <span className="user-role">{user?.role}</span>
                            </div>
                          </div>
                        </div>

                        <div className="dropdown-divider" />

                        {user?.role === 'admin' && (
                          <>
                            <motion.div
                              className="dropdown-item admin-item"
                              whileHover={{ x: 5 }}
                              onClick={() => { navigate('/admin/dashboard'); setShowUserDropdown(false); }}
                            >
                              <FiSettings />
                              <span>Admin Dashboard</span>
                            </motion.div>
                            <motion.div
                              className="dropdown-item seller-item"
                              whileHover={{ x: 5 }}
                              onClick={() => { navigate('/seller/dashboard'); setShowUserDropdown(false); }}
                            >
                              <FiShoppingBag />
                              <span>Seller Dashboard</span>
                            </motion.div>
                            <div className="dropdown-divider" />
                          </>
                        )}

                        {user?.role === 'seller' && (
                          <>
                            <motion.div
                              className="dropdown-item seller-item"
                              whileHover={{ x: 5 }}
                              onClick={() => { navigate('/seller/dashboard'); setShowUserDropdown(false); }}
                            >
                              <FiShoppingBag />
                              <span>Seller Dashboard</span>
                            </motion.div>
                            <div className="dropdown-divider" />
                          </>
                        )}

                        <motion.div className="dropdown-item" whileHover={{ x: 5 }} onClick={() => { navigate('/profile'); setShowUserDropdown(false); }}>
                          <FiUser />
                          <span>My Profile</span>
                        </motion.div>

                        <motion.div className="dropdown-item" whileHover={{ x: 5 }} onClick={() => { navigate('/orders'); setShowUserDropdown(false); }}>
                          <FiPackage />
                          <span>My Orders</span>
                        </motion.div>

                        <motion.div className="dropdown-item" whileHover={{ x: 5 }} onClick={() => { navigate('/settings'); setShowUserDropdown(false); }}>
                          <FiSettings />
                          <span>Settings</span>
                        </motion.div>

                        <motion.div
                          className="dropdown-item"
                          whileHover={{ x: 5 }}
                          onClick={() => {
                            if (isMobile) {
                              navigate('/select-region');
                            }
                            setShowUserDropdown(false);
                          }}
                        >
                          <img
                            src={selectedRegion.flag}
                            alt={selectedRegion.name}
                            className="circular-flag"
                            style={{ width: '18px', height: '18px' }}
                          />
                          <span>Region: {selectedRegion.name}</span>
                        </motion.div>

                        {/* Facebook-style Theme Toggle */}
                        <div className="dropdown-divider" />
                        <div className="dropdown-theme-row" onClick={toggleTheme}>
                          <div className="theme-row-label">
                            {theme === 'dark' ? <FiMoon className="theme-icon-dark" /> : <FiSun className="theme-icon-light" />}
                            <span>Dark Mode</span>
                          </div>
                          <div className={`fb-toggle-switch ${theme === 'dark' ? 'checked' : ''}`}>
                            <div className="fb-toggle-handle" />
                          </div>
                        </div>

                        <div className="dropdown-divider" />

                        <motion.div className="dropdown-item logout-item" whileHover={{ x: 5 }} onClick={handleLogout}>
                          <FiLogOut />
                          <span>Logout</span>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div className="dropdown-item" whileHover={{ x: 5 }} onClick={() => openAuthModal('login')}>
                          <FiLogIn />
                          <span>Login</span>
                        </motion.div>
                        <motion.div className="dropdown-item" whileHover={{ x: 5 }} onClick={() => openAuthModal('register')}>
                          <FiUserPlus />
                          <span>Register</span>
                        </motion.div>

                        {/* Facebook-style Theme Toggle for guest */}
                        <div className="dropdown-divider" />
                        <div className="dropdown-theme-row" onClick={toggleTheme}>
                          <div className="theme-row-label">
                            {theme === 'dark' ? <FiMoon className="theme-icon-dark" /> : <FiSun className="theme-icon-light" />}
                            <span>Dark Mode</span>
                          </div>
                          <div className={`fb-toggle-switch ${theme === 'dark' ? 'checked' : ''}`}>
                            <div className="fb-toggle-handle" />
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default DynamicIslandNav;

