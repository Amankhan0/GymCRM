import api from './api';

export const supplierService = {
  list: (params) => api.get('/b2b/suppliers', { params }).then((r) => r.data),
  get: (id) => api.get(`/b2b/suppliers/${id}`).then((r) => r.data),
  create: (data) => api.post('/b2b/suppliers', data).then((r) => r.data),
  update: (id, data) => api.put(`/b2b/suppliers/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/b2b/suppliers/${id}`).then((r) => r.data),
};
