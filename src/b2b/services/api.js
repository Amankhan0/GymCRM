import axios from 'axios';
import { toast } from 'sonner';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('b2b_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Backend can use this header later for analytics / cross-product audits.
  config.headers['X-Product'] = 'b2b';
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message || 'Network error';

    if (status === 401) {
      // Session expired or token invalidated. Logout cleans local storage; redirect to login.
      store.dispatch(logout());
      if (!window.location.pathname.startsWith('/login')) {
        toast.error('Session expired, please log in again');
        window.location.href = '/login';
      }
    } else if (status === 402) {
      // Trial / subscription expired. Phase 1+ shows a toast; a proper subscribe dialog
      // (like the gym side) will land in a later phase.
      toast.error(message || 'Trial expired — please subscribe to continue.', {
        id: 'sub-expired',
        duration: 6000,
      });
    } else if (status === 429) {
      const code = error?.response?.data?.code;
      toast.error(message, {
        duration: code === 'BLOCKED_PERMANENT' ? 10000 : 6000,
        id: 'blocked',
      });
    } else if (status >= 500) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;
