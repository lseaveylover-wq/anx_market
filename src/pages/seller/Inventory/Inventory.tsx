import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FiArchive, FiSearch, FiPlus, FiEdit2, FiEye, FiAlertTriangle, FiPackage } from 'react-icons/fi';
import { sellerApi } from '../../../services/seller.api';
import { Product } from '../../../types/seller.types';
import { SkeletonBox } from '../../../components/common/Skeleton';
import ViewProductModal from '../../../components/common/ViewProductModal';
import '../SellerHub.css';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedProductForView, setSelectedProductForView] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['sellerInventory', { page, search }],
    queryFn: () => sellerApi.getProducts({ page, search })
  });

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const row: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
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
          <h1>Inventory Management</h1>
          <p className="seller-subtitle">Track and manage your product stock levels and availability</p>
        </div>
        <div className="seller-header-actions">
          <motion.button
            className="seller-cta-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/seller/products/create')}
          >
            <FiPlus /> Restock / Add Item
          </motion.button>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}
      >
        <div className="seller-search-wrapper">
          <FiSearch />
          <input
            type="text"
            className="seller-search-input"
            placeholder="Search inventory by title or server..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </motion.div>

      {/* Table Container */}
      <motion.div
        className="seller-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table className="seller-table" style={{ minWidth: 800 }}>
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ textAlign: 'center' }}>Available Stock</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={container} initial="hidden" animate="visible">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((__, j) => (
                      <td key={j}><SkeletonBox width="80%" height="1rem" radius="6px" /></td>
                    ))}
                  </tr>
                ))
              ) : !data?.data?.length ? (
                <tr>
                  <td colSpan={4}>
                    <div className="seller-empty">
                      <FiPackage />
                      <p>No inventory items found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.data.map((product: Product) => {
                  const isLowStock = product.stock !== undefined && product.stock <= 2 && product.status !== 'hidden';
                  const thumb = product.cover_image || product.image_url || product.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100';
                  return (
                    <motion.tr key={product.id} variants={row}>
                      <td>
                        <div className="seller-product-cell">
                          <img
                            src={thumb}
                            alt={product.title}
                            className="seller-product-thumb"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100';
                            }}
                          />
                          <div>
                            <div className="seller-product-name">{product.title}</div>
                            {isLowStock && (
                              <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                <FiAlertTriangle /> Low Stock Warning
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', color: isLowStock ? '#ef4444' : 'var(--text-primary)' }}>
                        {product.stock ?? 1}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`seller-badge ${product.status}`}>
                          {product.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <motion.button
                            className="seller-icon-btn neutral"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedProductForView(product)}
                            title="View Product Details"
                          >
                            <FiEye />
                          </motion.button>
                          <motion.button
                            className="seller-icon-btn primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/seller/products/edit/${product.id}`)}
                            title="Update Stock"
                          >
                            <FiEdit2 />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </motion.tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.last_page > 1 && (
          <div className="seller-pagination">
            <span className="seller-pagination-info">
              Showing {data.from} to {data.to} of {data.total} entries
            </span>
            <div className="seller-pagination-btns">
              <button
                className="seller-page-btn"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <button
                className="seller-page-btn active"
                disabled={page === data.last_page}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* View Product Details Pop-Up Modal */}
      <ViewProductModal
        isOpen={!!selectedProductForView}
        onClose={() => setSelectedProductForView(null)}
        product={selectedProductForView}
        onEdit={(id) => navigate(`/seller/products/edit/${id}`)}
      />
    </>
  );
};

export default Inventory;
