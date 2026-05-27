import api from './api';

export const productService = {
  list: (params) => api.get('/b2b/products', { params }).then((r) => r.data),
  get: (id) => api.get(`/b2b/products/${id}`).then((r) => r.data),
  create: (data) => api.post('/b2b/products', data).then((r) => r.data),
  update: (id, data) => api.put(`/b2b/products/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/b2b/products/${id}`).then((r) => r.data),
};
