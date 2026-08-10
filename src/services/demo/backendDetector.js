// ANX Marketplace - Automatic Backend Health Detector & Periodic Polling Engine

import axios from 'axios';

class BackendDetector {
  constructor() {
    this.isDemoMode = false; // Default to real mode when configured, pending health check
    this.isChecking = true;
    this.listeners = new Set();
    this.pollInterval = null;
    this.failedCount = 0;
    
    // Create initial check promise so api adapter can wait if needed
    this.initialCheckPromise = new Promise((resolve) => {
      this._resolveInitialCheck = resolve;
    });
  }

  async waitForInitialCheck() {
    if (!this.isChecking) return;
    try {
      await this.initialCheckPromise;
    } catch (e) {
      // Ignore error
    }
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
      if (this._resolveInitialCheck) this._resolveInitialCheck();
      return true;
    }

    // Build candidate ping URLs (handle health & categories endpoints, plus localhost vs 127.0.0.1 on Windows)
    const cleanUrl = baseUrl.replace(/\/+$/, '');
    const pingUrls = [
      `${cleanUrl}/health`,
      `${cleanUrl}/categories`
    ];
    if (cleanUrl.includes('localhost')) {
      pingUrls.push(`${cleanUrl.replace('localhost', '127.0.0.1')}/health`);
      pingUrls.push(`${cleanUrl.replace('localhost', '127.0.0.1')}/categories`);
    } else if (cleanUrl.includes('127.0.0.1')) {
      pingUrls.push(`${cleanUrl.replace('127.0.0.1', 'localhost')}/health`);
      pingUrls.push(`${cleanUrl.replace('127.0.0.1', 'localhost')}/categories`);
    }

    let healthy = false;
    for (const pingUrl of pingUrls) {
      try {
        const res = await axios.get(pingUrl, { timeout: 3000 });
        if (res.status >= 200 && res.status < 300) {
          healthy = true;
          break;
        }
      } catch (err) {
        // Continue to next candidate URL
      }
    }

    if (healthy) {
      this.failedCount = 0;
      this.setMode(false); // Live Backend is available -> Real Mode!
    } else {
      this.failedCount++;
      // Require 2 consecutive failed health pings to switch to Demo Mode
      if (this.failedCount >= 2) {
        this.setMode(true); // Backend offline -> Demo Mode!
      }
    }

    this.isChecking = false;
    if (this._resolveInitialCheck) {
      this._resolveInitialCheck();
    }
    this.notify();
    return !healthy;
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

