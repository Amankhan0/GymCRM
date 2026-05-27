import api from './api';

export const customerService = {
  list: (params) => api.get('/b2b/customers', { params }).then((r) => r.data),
  get: (id) => api.get(`/b2b/customers/${id}`).then((r) => r.data),
  create: (data) => api.post('/b2b/customers', data).then((r) => r.data),
  update: (id, data) => api.put(`/b2b/customers/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/b2b/customers/${id}`).then((r) => r.data),
};
