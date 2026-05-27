import api from './api';

export const leadService = {
  list: (params) => api.get('/b2b/leads', { params }).then((r) => r.data),
  get: (id) => api.get(`/b2b/leads/${id}`).then((r) => r.data),
  create: (data) => api.post('/b2b/leads', data).then((r) => r.data),
  update: (id, data) => api.put(`/b2b/leads/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/b2b/leads/${id}`).then((r) => r.data),
  convert: (id) => api.post(`/b2b/leads/${id}/convert`).then((r) => r.data),
};
