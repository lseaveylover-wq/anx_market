import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiEdit2,
  FiDollarSign,
  FiBox,
  FiServer,
  FiAward,
  FiStar,
  FiTag,
  FiFileText
} from 'react-icons/fi';
import { Product } from '../../types/seller.types';
import './ViewProductModal.css';

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit?: (productId: number) => void;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onEdit,
}) => {
  if (!isOpen || !product) return null;

  const isLowStock = product.stock !== undefined && product.stock <= 2 && product.status !== 'hidden';
  const coverImage = product.cover_image || product.image_url || product.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600';

  const modalContent = (
    <AnimatePresence>
      <div className="view-product-overlay" onClick={onClose}>
        <motion.div
          className="view-product-modal"
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 25 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="view-product-header">
            <div className="view-product-title-group">
              <h2>{product.title}</h2>
              <div className="view-product-subtitle">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiTag /> {product.category?.name || 'Category'}
                </span>
                <span>•</span>
                <span className={`seller-badge ${product.status}`}>
                  {product.status}
                </span>
                {isLowStock && (
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>
                    ⚠️ Low Stock
                  </span>
                )}
              </div>
            </div>
            <button className="view-product-close-btn" onClick={onClose} title="Close">
              <FiX />
            </button>
          </div>

          {/* Body */}
          <div className="view-product-body">
            {/* Hero Cover Image */}
            <div className="view-product-hero-image">
              <img
                src={coverImage}
                alt={product.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600';
                }}
              />
              <div className="view-product-badge-overlay">
                {product.featured && (
                  <span style={{ background: '#f59e0b', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                    ★ Featured
                  </span>
                )}
              </div>
            </div>

            {/* Spec Cards Grid */}
            <div className="view-product-specs-grid">
              <div className="view-product-spec-card">
                <div className="view-product-spec-icon">
                  <FiDollarSign />
                </div>
                <div className="view-product-spec-info">
                  <span className="view-product-spec-label">Price</span>
                  <span className="view-product-spec-value price">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="view-product-spec-card">
                <div className="view-product-spec-icon">
                  <FiBox />
                </div>
                <div className="view-product-spec-info">
                  <span className="view-product-spec-label">Available Stock</span>
                  <span className="view-product-spec-value" style={{ color: isLowStock ? '#ef4444' : undefined }}>
                    {product.stock ?? 1} units
                  </span>
                </div>
              </div>

              <div className="view-product-spec-card">
                <div className="view-product-spec-icon">
                  <FiServer />
                </div>
                <div className="view-product-spec-info">
                  <span className="view-product-spec-label">Server / Platform</span>
                  <span className="view-product-spec-value">
                    {product.server || 'Global'} {product.platform ? `/ ${product.platform}` : ''}
                  </span>
                </div>
              </div>

              <div className="view-product-spec-card">
                <div className="view-product-spec-icon">
                  <FiAward />
                </div>
                <div className="view-product-spec-info">
                  <span className="view-product-spec-label">Rank / Skins</span>
                  <span className="view-product-spec-value">
                    {product.rank || 'N/A'} {product.skin_count ? `(${product.skin_count} skins)` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Section if available */}
            {product.rating !== undefined && product.rating > 0 && (
              <div>
                <h4 className="view-product-section-title">
                  <FiStar style={{ color: '#f59e0b' }} /> Rating & Reviews
                </h4>
                <div className="view-product-description-box" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                    ★ {Number(product.rating).toFixed(1)}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    Based on {product.reviews_count || 0} verified customer reviews
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {(product.short_description || product.long_description || product.description) && (
              <div>
                <h4 className="view-product-section-title">
                  <FiFileText /> Description
                </h4>
                <div className="view-product-description-box">
                  {product.short_description && (
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {product.short_description}
                    </p>
                  )}
                  <p style={{ margin: 0 }}>
                    {product.long_description || product.description || product.short_description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="view-product-footer">
            <button className="view-product-btn-cancel" onClick={onClose}>
              Close
            </button>
            {onEdit && (
              <button
                className="view-product-btn-edit"
                onClick={() => {
                  onClose();
                  onEdit(product.id);
                }}
              >
                <FiEdit2 /> Edit Product
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ViewProductModal;
