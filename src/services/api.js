import axios from 'axios';
import backendDetector from './demo/backendDetector';
import { handleMockRequest } from './demo/mockEngine';

// Create base axios instance supporting VITE_API_BASE_URL or VITE_API_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Obtain built-in Axios transport adapter (XHR in browser, HTTP in Node)
const builtInAdapter = axios.getAdapter(['xhr', 'http']);

// Custom adapter: routes requests to mock engine when Demo Mode is active
api.defaults.adapter = async (config) => {
  await backendDetector.waitForInitialCheck();
  if (backendDetector.isDemoMode) {
    return handleMockRequest(config);
  }
  return builtInAdapter(config);
};

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle response errors safely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          break;
        case 403:
          console.error('Access forbidden:', error.response.data);
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
