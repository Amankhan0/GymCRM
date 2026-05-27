import api from './api';

export const authService = {
  signup: (data) => api.post('/b2b/auth/signup', data).then((r) => r.data),
  login: (data) => api.post('/b2b/auth/login', data).then((r) => r.data),
  me: () => api.get('/b2b/auth/me').then((r) => r.data),
};
