import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiBell, FiCheck, FiShoppingCart, FiDollarSign, FiStar, FiPackage, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { sellerApi } from '../../../services/seller.api';
import { SkeletonBox } from '../../../components/common/Skeleton';
import '../SellerHub.css';

const Notifications: React.FC = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['sellerNotifications'],
    queryFn: () => sellerApi.getNotifications(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => sellerApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerNotifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => sellerApi.markAllNotificationsRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read.');
      queryClient.invalidateQueries({ queryKey: ['sellerNotifications'] });
    },
  });

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <>
        <div className="seller-header" style={{ pointerEvents: 'none' }}>
          <SkeletonBox width="240px" height="2rem" radius="8px" />
        </div>
        <div className="seller-panel">
          <div className="seller-panel-body">
            <SkeletonBox width="100%" height="300px" radius="12px" />
          </div>
        </div>
      </>
    );
  }

  const rawNotifications = data?.data || [];
  const notifications = rawNotifications.filter((n: any) => {
    if (filter === 'unread') return !n.read_at;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    if (type?.includes('Order')) return <FiShoppingCart style={{ color: '#10b981' }} />;
    if (type?.includes('Payment')) return <FiDollarSign style={{ color: '#B62A2D' }} />;
    if (type?.includes('Review')) return <FiStar style={{ color: '#f59e0b' }} />;
    if (type?.includes('Product')) return <FiPackage style={{ color: '#818cf8' }} />;
    return <FiBell style={{ color: '#D5575E' }} />;
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
          <h1>Notifications</h1>
          <p className="seller-subtitle">Real-time alerts for orders, payouts, customer reviews, and system updates</p>
        </div>
        <div className="seller-header-actions">
          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-main)', padding: '4px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <button
              className={`seller-page-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
              style={{ borderRadius: '16px', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              All
            </button>
            <button
              className={`seller-page-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
              style={{ borderRadius: '16px', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              Unread
            </button>
          </div>

          <motion.button
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="seller-page-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <FiCheck /> Mark All Read
          </motion.button>
        </div>
      </motion.div>

      {/* Notifications Panel */}
      <motion.div
        className="seller-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="seller-panel-body" style={{ padding: 0 }}>
          {notifications.length === 0 ? (
            <div className="seller-empty">
              <FiBell />
              <p>No notifications to display</p>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="visible">
              {notifications.map((n: any) => (
                <motion.div
                  key={n.id}
                  variants={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    background: !n.read_at ? 'rgba(182, 42, 45, 0.05)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        flexShrink: 0
                      }}
                    >
                      {getNotificationIcon(n.type)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '2px' }}>
                        {n.data?.title || n.data?.message || 'System Notification'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        {n.data?.details || n.data?.message}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                        {new Date(n.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {!n.read_at && (
                    <motion.button
                      onClick={() => markReadMutation.mutate(n.id)}
                      className="seller-icon-btn primary"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Mark as Read"
                    >
                      <FiCheck />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Notifications;
