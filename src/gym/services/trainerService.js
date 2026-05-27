import api from './api';

export const trainerService = {
  list: (params) => api.get('/trainers', { params }).then((r) => r.data),
  get: (id) => api.get(`/trainers/${id}`).then((r) => r.data),
  create: (data) => api.post('/trainers', data).then((r) => r.data),
  update: (id, data) => api.put(`/trainers/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/trainers/${id}`).then((r) => r.data),
};
