import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  signup: (data) => api.post('/auth/signup', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};
