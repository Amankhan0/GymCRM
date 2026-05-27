import axios from 'axios';

// Separate axios instance — super-admin auth is a single password header, not the user JWT.
const superApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

const STORAGE_KEY = 'gym_super_pw';

superApi.interceptors.request.use((config) => {
  const pw = localStorage.getItem(STORAGE_KEY);
  if (pw) config.headers['X-Superadmin-Password'] = pw;
  return config;
});

export const superadminService = {
  login: async (password) => {
    const res = await superApi.post('/superadmin/login', { password });
    if (res.data?.success) {
      localStorage.setItem(STORAGE_KEY, password);
    }
    return res.data;
  },
  logout: () => localStorage.removeItem(STORAGE_KEY),
  isAuthed: () => !!localStorage.getItem(STORAGE_KEY),

  stats: () => superApi.get('/superadmin/stats').then((r) => r.data),
  users: () => superApi.get('/superadmin/users').then((r) => r.data),
  requests: (status = 'pending') =>
    superApi.get('/superadmin/payment-requests', { params: { status } }).then((r) => r.data),
  approve: (id) =>
    superApi.post(`/superadmin/payment-requests/${id}/approve`).then((r) => r.data),
  reject: (id, reason) =>
    superApi.post(`/superadmin/payment-requests/${id}/reject`, { reason }).then((r) => r.data),
};
