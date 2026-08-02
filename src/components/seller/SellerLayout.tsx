import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SellerProtectedRoute from './SellerProtectedRoute';
import { useSellerStore } from '../../store/useSellerStore';
import '../../pages/seller/SellerHub.css';

const SellerLayout: React.FC = () => {
  const { fetchStats, fetchSettings, canAccess } = useSellerStore();

  useEffect(() => {
    if (canAccess) {
      Promise.all([fetchStats(), fetchSettings()]);
    }
  }, [canAccess]);

  return (
    <SellerProtectedRoute>
      <div className="seller-layout">
        <Sidebar />
        <main className="seller-content">
          <Outlet />
        </main>
      </div>
    </SellerProtectedRoute>
  );
};

export default SellerLayout;
