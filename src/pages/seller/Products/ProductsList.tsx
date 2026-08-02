import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiEdit2, FiEye, FiTrash2, FiPackage, FiFilter } from 'react-icons/fi';
import { sellerApi } from '../../../services/seller.api';
import { Product } from '../../../types/seller.types';
import { SkeletonBox } from '../../../components/common/Skeleton';
import toast from 'react-hot-toast';
import '../SellerHub.css';

const STATUSES = ['', 'available', 'hidden', 'draft', 'archived', 'sold'];

const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['sellerProducts', { page, status, search }],
    queryFn: () => sellerApi.getProducts({ page, status, search }),
  });

  const bulkMutation = useMutation({
    mutationFn: (action: 'hide' | 'show' | 'delete' | 'archive') =>
      sellerApi.bulkActionProducts(action, selectedIds),
    onSuccess: res => {
      toast.success(res.message || 'Action completed');
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
      setSelectedIds([]);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Action failed'),
  });

  const toggleSelect = (id: number) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const selectAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedIds(e.target.checked && data?.data ? data.data.map((p: Product) => p.id) : []);

  const handleBulk = (action: 'hide' | 'show' | 'delete' | 'archive') => {
    if (!selectedIds.length) return;
    if (action === 'delete' && !window.confirm('Delete selected products?')) return;
    bulkMutation.mutate(action);
  };

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
          <h1>Product Management</h1>
          <p className="seller-subtitle">Manage your listings, stock, and visibility</p>
        </div>
        <div className="seller-header-actions">
          <motion.button
            className="seller-cta-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/seller/products/create')}
          >
            <FiPlus /> Create Product
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
        {/* Search */}
        <div className="seller-search-wrapper">
          <FiSearch />
          <input
            className="seller-search-input"
            placeholder="Search by title, category, server…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <FiFilter style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
          {STATUSES.map(s => (
            <motion.button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '20px',
                border: status === s ? 'none' : '1px solid var(--border-color)',
                background: status === s ? 'linear-gradient(135deg, #B62A2D 0%, #D5575E 100%)' : 'var(--bg-surface)',
                color: status === s ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize',
              }}
            >
              {s === '' ? 'All' : s}
            </motion.button>
          ))}
        </div>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {selectedIds.length} selected
            </span>
            {(['show', 'hide', 'archive', 'delete'] as const).map(a => (
              <button
                key={a}
                onClick={() => handleBulk(a)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '8px',
                  border: `1px solid ${a === 'delete' ? 'rgba(239,68,68,0.3)' : 'var(--border-color)'}`,
                  background: a === 'delete' ? 'rgba(239,68,68,0.08)' : 'var(--bg-surface)',
                  color: a === 'delete' ? '#ef4444' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {a}
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        className="seller-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table className="seller-table" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    onChange={selectAll}
                    checked={!!data?.data?.length && selectedIds.length === data.data.length}
                    style={{ accentColor: '#B62A2D' }}
                  />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j}><SkeletonBox width="80%" height="1rem" radius="6px" /></td>
                    ))}
                  </tr>
                ))
              ) : !data?.data?.length ? (
                <tr>
                  <td colSpan={7}>
                    <div className="seller-empty">
                      <FiPackage />
                      <p>No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <motion.tbody variants={container} initial="hidden" animate="visible">
                  {data.data.map((product: Product) => (
                    <motion.tr key={product.id} variants={row}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          style={{ accentColor: '#B62A2D' }}
                        />
                      </td>
                      <td>
                        <div className="seller-product-cell">
                          <img
                            src={product.cover_image || 'https://via.placeholder.com/56'}
                            alt={product.title}
                            className="seller-product-thumb"
                          />
                          <div>
                            <div className="seller-product-name">{product.title}</div>
                            <div className="seller-product-meta">{product.server || 'Global'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {product.category?.name || 'Uncategorized'}
                      </td>
                      <td className="seller-price">${Number(product.price).toFixed(2)}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{product.stock ?? 1}</td>
                      <td>
                        <span className={`seller-badge ${product.status}`}>{product.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <motion.button
                            className="seller-icon-btn primary"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/seller/products/edit/${product.id}`)}
                            title="Edit"
                          >
                            <FiEdit2 />
                          </motion.button>
                          <motion.button
                            className="seller-icon-btn neutral"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => window.open(`/products/${product.id}`, '_blank')}
                            title="View Public"
                          >
                            <FiEye />
                          </motion.button>
                          <motion.button
                            className="seller-icon-btn danger"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setSelectedIds([product.id]); handleBulk('delete'); }}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.last_page > 1 && (
          <div className="seller-pagination">
            <span className="seller-pagination-info">
              Showing {data.from}–{data.to} of {data.total} products
            </span>
            <div className="seller-pagination-btns">
              <button className="seller-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </button>
              <button className="seller-page-btn" disabled={page === data.last_page} onClick={() => setPage(p => p + 1)}>
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ProductsList;
