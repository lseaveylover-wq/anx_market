// ANX Marketplace - Automatic Backend Health Detector & Periodic Polling Engine

import axios from 'axios';

class BackendDetector {
  constructor() {
    this.isDemoMode = true; // Default to Demo Mode until backend health is verified
    this.isChecking = true;
    this.listeners = new Set();
    this.pollInterval = null;
    this.failedCount = 0;
  }

  // Subscribe to mode changes
  subscribe(listener) {
    this.listeners.add(listener);
    // Immediately emit current state
    listener({ isDemoMode: this.isDemoMode, isChecking: this.isChecking });
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) =>
      listener({ isDemoMode: this.isDemoMode, isChecking: this.isChecking })
    );
  }

  // Perform dynamic health check against configured VITE_API_BASE_URL
  async checkHealth() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

    // If no backend URL configured (e.g. Vercel deployment), lock in Demo Mode
    if (!baseUrl || baseUrl.trim() === '') {
      this.setMode(true);
      return true;
    }

    try {
      // Short ping timeout (2.5s) to avoid UI blocking
      const pingUrl = `${baseUrl.replace(/\/+$/, '')}/categories`;
      const res = await axios.get(pingUrl, { timeout: 2500 });

      if (res.status === 200 || res.status === 204) {
        this.failedCount = 0;
        this.setMode(false); // Live Backend is available -> Real Mode!
        return false;
      }
    } catch (err) {
      this.failedCount++;
      // Require 2 consecutive failed health pings to switch to Demo Mode to prevent transient network glitched mode flipping
      if (this.failedCount >= 1) {
        this.setMode(true); // Backend offline -> Demo Mode!
      }
    } finally {
      this.isChecking = false;
      this.notify();
    }
  }

  setMode(isDemo) {
    if (this.isDemoMode !== isDemo || this.isChecking) {
      this.isDemoMode = isDemo;
      this.isChecking = false;
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
