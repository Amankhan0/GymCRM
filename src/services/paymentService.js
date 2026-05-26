import api from './api';

export const paymentService = {
  list: (params) => api.get('/payments', { params }).then((r) => r.data),
  create: (data) => api.post('/payments', data).then((r) => r.data),
  update: (id, data) => api.put(`/payments/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/payments/${id}`).then((r) => r.data),
};
