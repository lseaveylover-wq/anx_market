import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSellerStore } from '../../store/useSellerStore';
import { SkeletonDashboard } from '../common/Skeleton';

interface SellerProtectedRouteProps {
  children: React.ReactNode;
}

const SellerProtectedRoute: React.FC<SellerProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { canAccess, checkPermission, sellerRequest } = useSellerStore();
  const [hasChecked, setHasChecked] = React.useState(false);

  useEffect(() => {
    checkPermission().finally(() => setHasChecked(true));
  }, [checkPermission]);

  // Only gate on !hasChecked — isLoading is also set by fetchStats/fetchSettings
  // and would incorrectly unmount the layout while data is loading.
  if (!hasChecked) {
    return (
      <div className="container-fluid py-4" style={{ minHeight: '60vh' }}>
        <SkeletonDashboard />
      </div>
    );
  }

  const hasAccess = canAccess || sellerRequest?.status === 'approved';

  if (!hasAccess) {
    return (
      <div className="container mt-5 pt-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-dark text-white border-0 shadow p-5 text-center mx-auto"
          style={{ maxWidth: '600px', borderRadius: '15px' }}
        >
          <div className="mb-4">
            <div className="rounded-circle bg-danger bg-opacity-25 d-inline-flex p-4 mb-3">
              <i className="bi bi-shield-lock text-danger" style={{ fontSize: '3rem' }}></i>
            </div>
            <h2 className="fw-bold">Access Denied</h2>
            <p className="text-secondary fs-5">Your seller application has not been approved.</p>
          </div>

          <div className="bg-black bg-opacity-25 p-4 rounded-3 text-start mb-4">
            <h5 className="text-white mb-3">Application Status</h5>
            {sellerRequest ? (
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-secondary">Current Status:</span>
                <span className={`badge bg-${
                  sellerRequest.status === 'pending' ? 'warning text-dark' : 
                  sellerRequest.status === 'rejected' ? 'danger' : 'secondary'
                } px-3 py-2 rounded-pill text-uppercase`}>
                  {sellerRequest.status}
                </span>
              </div>
            ) : (
              <p className="text-secondary mb-0">You haven't submitted a seller application yet.</p>
            )}
          </div>

          <div className="d-grid gap-3">
            {(!sellerRequest || sellerRequest.status === 'rejected') && (
              <button 
                className="btn btn-danger py-3 fw-bold rounded-pill"
                onClick={() => navigate('/profile')} // Assuming they can apply from profile
              >
                Submit Seller Request
              </button>
            )}
            <button className="btn btn-outline-light py-3 rounded-pill">
              Contact Support
            </button>
            <button 
              className="btn btn-link text-secondary text-decoration-none"
              onClick={() => navigate('/')}
            >
              Return to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SellerProtectedRoute;
