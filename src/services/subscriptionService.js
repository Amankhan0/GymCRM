import api from './api';

export const subscriptionService = {
  plans: () => api.get('/subscription/plans').then((r) => r.data),
  status: () => api.get('/subscription/me').then((r) => r.data),
  submit: (data) => api.post('/subscription/request', data).then((r) => r.data),
};
