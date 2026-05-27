import axios from 'axios';
import { toast } from 'sonner';
import { store } from '@/gym/store';
import { setSubscriptionDialogOpen } from '@/gym/store/slices/uiSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message || 'Network error';

    if (status === 401) {
      localStorage.removeItem('gym_token');
      localStorage.removeItem('gym_user');
      if (!window.location.pathname.startsWith('/login')) {
        toast.error('Session expired, please log in again');
        window.location.href = '/login';
      }
    } else if (status === 402) {
      store.dispatch(setSubscriptionDialogOpen(true));
    } else if (status === 429) {
      // Progressive block from the backend. Show the server's specific message ("blocked for N
      // minutes" / "permanently blocked") rather than a generic toast.
      const code = error?.response?.data?.code;
      toast.error(message, {
        duration: code === 'BLOCKED_PERMANENT' ? 10000 : 6000,
        id: 'blocked', // de-dupe so a burst of requests doesn't spam the toast stack
      });
    } else if (status >= 500) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;
