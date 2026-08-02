import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SkeletonBox } from '../common/Skeleton';
import toast from 'react-hot-toast';

/* ── Auth-check skeleton ──────────────────────────────────────────────────
   Shown for a fraction of a second while the auth context hydrates.
   Mirrors the admin-layout so there's no layout pop.
──────────────────────────────────────────────────────────────────────────── */
const AuthSkeleton = () => (
  <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background-color)' }}>
    {/* Sidebar placeholder */}
    <div
      style={{
        width: 280,
        flexShrink: 0,
        padding: '2rem 1.5rem',
        background: 'var(--surface-color)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Logo area */}
      <SkeletonBox width="140px" height="40px" radius="10px" />
      {/* Nav items */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SkeletonBox width="22px" height="22px" radius="6px" style={{ flexShrink: 0 }} />
          <SkeletonBox width={`${60 + i * 8}%`} height="0.9rem" radius="6px" />
        </div>
      ))}
    </div>

    {/* Content area */}
    <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div
        style={{
          background: 'var(--surface-color)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <SkeletonBox width="220px" height="1.8rem" radius="8px" />
          <SkeletonBox width="160px" height="0.9rem" radius="6px" />
        </div>
        <SkeletonBox width="180px" height="52px" radius="50px" />
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: 'var(--surface-color)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <SkeletonBox width="50px" height="50px" radius="15px" style={{ flexShrink: 0 }} />
              <SkeletonBox width="70px" height="28px" radius="20px" />
            </div>
            <SkeletonBox width="55%" height="1.8rem" radius="6px" />
            <SkeletonBox width="75%" height="0.85rem" radius="6px" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── ProtectedRoute ─────────────────────────────────────────────────────── */
const ProtectedRoute = ({ children, allowedRoles = [], requireAdmin = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthSkeleton />;
  }

  if (!isAuthenticated) {
    toast.error('Please login to access this page');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    toast.error('Admin access required');
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
