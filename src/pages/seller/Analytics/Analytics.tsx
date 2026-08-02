import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiStar } from 'react-icons/fi';
import { sellerApi } from '../../../services/seller.api';
import { SkeletonBox } from '../../../components/common/Skeleton';
import '../SellerHub.css';

const PERIODS = [
  { value: '7days',  label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: '1year',  label: 'Last Year' },
];

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState('30days');

  const { data, isLoading } = useQuery({
    queryKey: ['sellerAnalytics', period],
    queryFn: () => sellerApi.getAnalytics(period),
  });

  const maxRevenue =
    data?.dailyRevenue?.reduce((m: number, d: any) => Math.max(m, Number(d.revenue)), 0) || 1;

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
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
          <h1>Analytics</h1>
          <p className="seller-subtitle">Deep dive into your store's performance</p>
        </div>
        <div className="seller-header-actions">
          <select
            className="seller-filter-select"
            value={period}
            onChange={e => setPeriod(e.target.value)}
          >
            {PERIODS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Summary stat cards */}
      <motion.div
        className="seller-stats-grid"
        variants={container}
        initial="hidden"
        animate="visible"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', marginBottom: '2rem' }}
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="seller-skeleton-stat" style={{ pointerEvents: 'none', height: 140 }} />
          ))
        ) : [
          { title: 'Total Revenue',  value: `$${Number(data?.totalRevenue || 0).toFixed(2)}`,    icon: <FiDollarSign />,  color: '#B62A2D', change: '+12%' },
          { title: 'Total Orders',   value: data?.totalOrders || 0,                              icon: <FiShoppingCart />, color: '#10b981', change: '+8%' },
          { title: 'Avg Order Value',value: `$${Number(data?.avgOrderValue || 0).toFixed(2)}`,   icon: <FiTrendingUp />,  color: '#667eea', change: '+5%' },
          { title: 'Top Rating',     value: `${data?.avgRating || '–'}/5`,                       icon: <FiStar />,        color: '#f59e0b', change: '★ Excellent' },
        ].map((card, i) => (
          <motion.div
            key={i}
            className="seller-stat-card"
            variants={item}
            whileHover={{ y: -5, boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}
          >
            <div className="seller-stat-card-header">
              <div className="seller-stat-icon" style={{ background: `${card.color}20`, color: card.color }}>
                {card.icon}
              </div>
              <span className="seller-stat-change">{card.change}</span>
            </div>
            <div className="seller-stat-card-body">
              <h3 className="seller-stat-value">{card.value}</h3>
              <p className="seller-stat-label">{card.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue Bar Chart */}
      <motion.div
        className="seller-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <div className="seller-panel-header">
          <h2 className="seller-panel-title">
            <FiTrendingUp /> Revenue Trend
          </h2>
          <span className="seller-stat-change">+14.5% vs previous period</span>
        </div>
        <div className="seller-panel-body">
          {isLoading ? (
            <SkeletonBox width="100%" height="200px" radius="12px" />
          ) : data?.dailyRevenue?.length ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: 200, overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {data.dailyRevenue.map((d: any, i: number) => {
                const pct = (Number(d.revenue) / maxRevenue) * 100;
                return (
                  <motion.div
                    key={i}
                    title={`$${Number(d.revenue).toFixed(2)}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ delay: i * 0.02, type: 'spring', stiffness: 80 }}
                    style={{
                      flex: 1,
                      minWidth: 8,
                      maxWidth: 32,
                      background: 'linear-gradient(180deg, #D5575E 0%, #B62A2D 100%)',
                      borderRadius: '4px 4px 0 0',
                      cursor: 'help',
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="seller-empty" style={{ padding: '2rem' }}>
              <FiTrendingUp />
              <p>No revenue data for this period</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Top Products */}
      {!isLoading && data?.topProducts?.length > 0 && (
        <motion.div
          className="seller-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="seller-panel-header">
            <h2 className="seller-panel-title">
              <FiStar /> Top Performing Products
            </h2>
          </div>
          <div className="seller-panel-body" style={{ padding: 0 }}>
            <table className="seller-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Revenue</th>
                  <th>Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.slice(0, 5).map((p: any, i: number) => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</td>
                    <td className="seller-price">${Number(p.revenue || 0).toFixed(2)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.units_sold || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Analytics;
