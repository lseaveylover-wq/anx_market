// ANX Marketplace - Automatic Backend Health Detector & Periodic Polling Engine

import axios from 'axios';

class BackendDetector {
  constructor() {
    this.isDemoMode = false;
    this.isChecking = false;
    this.listeners = new Set();
    this.pollInterval = null;
    this.failedCount = 0;
    
    // Resolve initial check immediately if base URL is present to prevent blocking Axios adapter
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
    if (baseUrl && baseUrl.trim() !== '') {
      this.initialCheckPromise = Promise.resolve();
    } else {
      this.isDemoMode = true;
      this.initialCheckPromise = Promise.resolve();
    }
  }

  async waitForInitialCheck() {
    return Promise.resolve();
  }

  // Subscribe to mode changes
  subscribe(listener) {
    this.listeners.add(listener);
    listener({ isDemoMode: this.isDemoMode, isChecking: this.isChecking });
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) =>
      listener({ isDemoMode: this.isDemoMode, isChecking: this.isChecking })
    );
  }

  // Perform non-blocking dynamic health check against configured VITE_API_BASE_URL
  async checkHealth() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

    // If no backend URL configured, lock in Demo Mode
    if (!baseUrl || baseUrl.trim() === '') {
      this.setMode(true);
      return true;
    }

    const cleanUrl = baseUrl.replace(/\/+$/, '');
    const pingUrl = `${cleanUrl}/health`;

    try {
      const res = await axios.get(pingUrl, { timeout: 1500 });
      if (res.status >= 200 && res.status < 300) {
        this.failedCount = 0;
        this.setMode(false);
        return false;
      }
    } catch (err) {
      // Primary health ping failed, check fallback
      try {
        const fallbackUrl = `${cleanUrl}/categories`;
        const res = await axios.get(fallbackUrl, { timeout: 1500 });
        if (res.status >= 200 && res.status < 300) {
          this.failedCount = 0;
          this.setMode(false);
          return false;
        }
      } catch (fallbackErr) {
        this.failedCount++;
        if (this.failedCount >= 2) {
          this.setMode(true);
        }
      }
    }

    this.notify();
    return this.isDemoMode;
  }

  setMode(isDemo) {
    if (this.isDemoMode !== isDemo || this.isChecking) {
      this.isDemoMode = isDemo;
      this.isChecking = false;

      // Purge fake demo tokens when running in Real Mode
      if (!isDemo) {
        const token = localStorage.getItem('token');
        if (token && token.startsWith('demo-jwt-token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      console.log(
        `%c[ANX System] Mode Active: ${isDemo ? '⚠️ DEMO MODE (Mock Engine)' : '⚡ REAL MODE (PHP Backend)'}`,
        `color: ${isDemo ? '#f59e0b' : '#10b981'}; font-weight: bold; font-size: 12px;`
      );
      this.notify();
    }
  }

  // Start periodic 20-second background polling
  startPolling() {
    this.checkHealth();
    if (!this.pollInterval) {
      this.pollInterval = setInterval(() => {
        this.checkHealth();
      }, 20000);
    }
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }
}

export const backendDetector = new BackendDetector();
backendDetector.startPolling();
export default backendDetector;

