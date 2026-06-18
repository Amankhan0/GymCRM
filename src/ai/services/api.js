import axios from 'axios';

// Same backend as gym/b2b — just a different namespace (/api/ai/*). VITE_API_URL already points
// at the EC2 backend in production; defaults to local in dev.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem('ai_token');
      localStorage.removeItem('ai_user');
      const path = window.location.pathname;
      if (path !== '/' && !path.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
