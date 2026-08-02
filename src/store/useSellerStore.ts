import { create } from 'zustand';
import { DashboardStats, SellerSettings } from '../types/seller.types';
import { sellerApi } from '../services/seller.api';

interface SellerState {
  stats: DashboardStats | null;
  settings: SellerSettings | null;
  isLoading: boolean;
  error: string | null;
  isSeller: boolean;
  canAccess: boolean;
  sellerRequest: any | null;

  // Actions
  fetchStats: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  checkPermission: () => Promise<void>;
  setStats: (stats: DashboardStats) => void;
}

export const useSellerStore = create<SellerState>((set) => ({
  stats: null,
  settings: null,
  isLoading: true,
  error: null,
  isSeller: false,
  canAccess: false,
  sellerRequest: null,

  fetchStats: async () => {
    try {
      const stats = await sellerApi.getDashboardStats();
      set({ stats });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch stats' });
    }
  },

  fetchSettings: async () => {
    try {
      const settings = await sellerApi.getSettings();
      set({ settings });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch settings' });
    }
  },

  checkPermission: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await sellerApi.checkPermission();
      const approved = data?.sellerRequest?.status === 'approved';
      set({ 
        isSeller: !!(data?.isSeller || approved),
        canAccess: !!(data?.canAccess || approved),
        sellerRequest: data?.sellerRequest || null,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to check permission',
        isLoading: false 
      });
    }
  },

  setStats: (stats) => set({ stats }),
}));
