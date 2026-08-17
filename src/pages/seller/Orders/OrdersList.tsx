import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiEye, FiFilter } from 'react-icons/fi';
import { sellerApi } from '../../../services/seller.api';
import { Order } from '../../../types/seller.types';
import { SkeletonBox } from '../../../components/common/Skeleton';
import '../SellerHub.css';

const STATUSES = ['', 'pending', 'paid', 'delivering', 'completed', 'cancelled', 'refunded'];

const OrdersList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['sellerOrders', { page, status, search }],
    queryFn: () => sellerApi.getOrders({ page, status, search }),
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
          <h1>Orders</h1>
          <p className="seller-subtitle">Track and manage all customer orders</p>
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
            type="text"
            className="seller-search-input"
            placeholder="Search order number or buyer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter pills */}
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
                transition: 'all 0.2s',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
              }}
            >
              {s === '' ? 'All' : s}
            </motion.button>
          ))}
        </div>
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
                <th>Order #</th>
                <th>Buyer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Delivery</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={container} initial="hidden" animate="visible">
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
                      <FiShoppingCart />
                      <p>No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.data.map((order: Order) => (
                  <motion.tr
                    key={order.id}
                    variants={row}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/seller/orders/${order.id}`)}
                  >
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      #{order.order_number}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img
                          src={order.buyer?.avatar || `https://ui-avatars.com/api/?name=${order.buyer?.name || 'Buyer'}&background=B62A2D&color=fff`}
                          alt={order.buyer?.name}
                          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ color: 'var(--text-primary)' }}>{order.buyer?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="seller-price">${Number(order.total_amount).toFixed(2)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`seller-badge ${order.items?.[0]?.product?.auto_delivery ? 'paying' : 'delivering'}`}
                        style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}
                      >
                        {order.items?.[0]?.product?.auto_delivery ? '⚡ Auto' : '👤 Manual'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`seller-badge ${order.status}`}>{order.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <motion.button
                        className="seller-icon-btn primary"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={e => { e.stopPropagation(); navigate(`/seller/orders/${order.id}`); }}
                      >
                        <FiEye />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.last_page > 1 && (
          <div className="seller-pagination">
            <span className="seller-pagination-info">
              Showing {data.from}–{data.to} of {data.total} orders
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

export default OrdersList;
