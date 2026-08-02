import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome,
    FiPackage,
    FiShoppingCart,
    FiTruck,
    FiDollarSign,
    FiBarChart2,
    FiStar,
    FiMessageSquare,
    FiBell,
    FiSettings,
    FiMenu,
    FiX,
    FiMoon,
    FiSun,
    FiSearch,
    FiLogOut
} from 'react-icons/fi';
import './SellerLayout.css';

interface NavItem {
    path: string;
    label: string;
    icon: JSX.Element;
}

const SellerLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [searchOpen, setSearchOpen] = useState(false);

    const navItems: NavItem[] = [
        { path: '/seller/dashboard', label: 'Dashboard', icon: <FiHome /> },
        { path: '/seller/products', label: 'Products', icon: <FiPackage /> },
        { path: '/seller/inventory', label: 'Inventory', icon: <FiShoppingCart /> },
        { path: '/seller/orders', label: 'Orders', icon: <FiShoppingCart /> },
        { path: '/seller/deliveries', label: 'Deliveries', icon: <FiTruck /> },
        { path: '/seller/wallet', label: 'Wallet', icon: <FiDollarSign /> },
        { path: '/seller/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
        { path: '/seller/reviews', label: 'Reviews', icon: <FiStar /> },
        { path: '/seller/messages', label: 'Messages', icon: <FiMessageSquare /> },
        { path: '/seller/notifications', label: 'Notifications', icon: <FiBell /> },
        { path: '/seller/settings', label: 'Settings', icon: <FiSettings /> },
    ];

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className={`seller-layout ${theme}`}>
            {/* Sidebar */}
            <motion.aside
                className={`seller-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 80 }}
                transition={{ duration: 0.3 }}
            >
                {/* Logo */}
                <div className="sidebar-header">
                    <Link to="/seller/dashboard" className="sidebar-logo">
                        <motion.div
                            className="logo-icon"
                            animate={{ scale: sidebarOpen ? 1 : 1.2 }}
                        >
                            ANX
                        </motion.div>
                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.span
                                    className="logo-text"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    Seller Portal
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <AnimatePresence>
                                    {sidebarOpen && (
                                        <motion.span
                                            className="nav-label"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        className="active-indicator"
                                        layoutId="activeIndicator"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="sidebar-footer">
                    <button className="sidebar-action" onClick={toggleTheme}>
                        {theme === 'dark' ? <FiSun /> : <FiMoon />}
                    </button>
                    <button className="sidebar-action" onClick={handleLogout}>
                        <FiLogOut />
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="seller-main">
                {/* Top Bar */}
                <header className="seller-topbar">
                    <div className="topbar-left">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <FiMenu />
                        </button>
                        <h1 className="page-title">
                            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="topbar-right">
                        {/* Search */}
                        <div className="topbar-search">
                            <button
                                className="search-toggle"
                                onClick={() => setSearchOpen(!searchOpen)}
                            >
                                <FiSearch />
                            </button>
                            <AnimatePresence>
                                {searchOpen && (
                                    <motion.div
                                        className="search-input-wrapper"
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 250, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="search-input"
                                            autoFocus
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Notifications */}
                        <button className="topbar-icon-btn">
                            <FiBell />
                            <span className="badge">3</span>
                        </button>

                        {/* Wallet Balance */}
                        <div className="wallet-badge">
                            <FiDollarSign />
                            <span>$1,234.56</span>
                        </div>

                        {/* Theme Toggle */}
                        <button className="topbar-icon-btn" onClick={toggleTheme}>
                            {theme === 'dark' ? <FiSun /> : <FiMoon />}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="seller-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
