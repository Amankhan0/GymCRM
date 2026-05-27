import axios from 'axios';

// Separate axios instance — super-admin auth uses its own short-lived JWT, not the user JWT.
const superApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Storage key was renamed from gym_super_pw (which held the plaintext password) to
// gym_super_token (which holds a short-lived JWT). Clear the old key so stale data doesn't linger.
const TOKEN_KEY = 'gym_super_token';
try {
  if (typeof localStorage !== 'undefined') localStorage.removeItem('gym_super_pw');
} catch {
  // SSR / private mode — safe to ignore.
}

superApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-clear the token on 401 so a stale/expired session doesn't keep retrying.
superApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) localStorage.removeItem(TOKEN_KEY);
    return Promise.reject(err);
  }
);

export const superadminService = {
  login: async (password) => {
    const res = await superApi.post('/superadmin/login', { password });
    if (res.data?.success && res.data?.data?.token) {
      localStorage.setItem(TOKEN_KEY, res.data.data.token);
    }
    return res.data;
  },
  logout: () => localStorage.removeItem(TOKEN_KEY),
  isAuthed: () => !!localStorage.getItem(TOKEN_KEY),

  stats: () => superApi.get('/superadmin/stats').then((r) => r.data),
  users: () => superApi.get('/superadmin/users').then((r) => r.data),
  requests: (status = 'pending') =>
    superApi.get('/superadmin/payment-requests', { params: { status } }).then((r) => r.data),
  approve: (id) =>
    superApi.post(`/superadmin/payment-requests/${id}/approve`).then((r) => r.data),
  reject: (id, reason) =>
    superApi.post(`/superadmin/payment-requests/${id}/reject`, { reason }).then((r) => r.data),
};
