import api from './api';

export const planService = {
  list: () => api.get('/plans').then((r) => r.data),
  get: (id) => api.get(`/plans/${id}`).then((r) => r.data),
  create: (data) => api.post('/plans', data).then((r) => r.data),
  update: (id, data) => api.put(`/plans/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/plans/${id}`).then((r) => r.data),
};
