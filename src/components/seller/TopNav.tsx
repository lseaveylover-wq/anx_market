import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSellerStore } from '../../store/useSellerStore';

const TopNav: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth() as { user: any };
  const { stats } = useSellerStore();

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="px-4 py-3 d-flex align-items-center justify-content-between position-sticky top-0 border-bottom shadow-sm"
      style={{ 
        zIndex: 1030,
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="d-flex align-items-center gap-3 w-50">
        <div className="position-relative w-100 max-w-md">
          <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: 'var(--text-secondary)' }}></i>
          <input 
            type="text" 
            className="form-control border-0 ps-5 py-2 rounded-pill focus-ring focus-ring-danger" 
            placeholder="Search products, orders, customers..." 
            style={{ 
              minWidth: '300px',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)'
            }}
          />
        </div>
      </div>

      <div className="d-flex align-items-center gap-4">
        {/* Wallet Balance */}
        <div className="px-4 py-2 rounded-pill d-flex align-items-center gap-2 border shadow-sm" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
          <i className="bi bi-wallet2 text-danger"></i>
          <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>${stats?.walletBalance?.toFixed(2) || '0.00'}</span>
        </div>

        {/* Action Icons */}
        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn rounded-circle position-relative p-2 d-flex align-items-center justify-content-center border"
            style={{ width: 40, height: 40, backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
            onClick={toggleTheme}
            title="Toggle theme"
          >
            <i className={`bi bi-${isDark ? 'sun-fill' : 'moon-stars-fill'} text-warning`}></i>
          </button>
          
          <button 
            className="btn rounded-circle position-relative p-2 d-flex align-items-center justify-content-center border" 
            style={{ width: 40, height: 40, backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
          >
            <i className="bi bi-bell" style={{ color: 'var(--text-primary)' }}></i>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-dark rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </button>
        </div>

        {/* Profile */}
        <div className="d-flex align-items-center gap-3 border-start ps-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="text-end d-none d-md-block">
            <h6 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>{user?.name || 'Seller'}</h6>
            <small className="text-success d-flex align-items-center justify-content-end gap-1">
              <span className="d-inline-block rounded-circle bg-success" style={{ width: 8, height: 8 }}></span>
              Online
            </small>
          </div>
          <img 
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Seller'}&background=B62A2D&color=fff`} 
            alt="Profile" 
            className="rounded-circle border border-2 border-danger"
            width="42" 
            height="42"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default TopNav;
