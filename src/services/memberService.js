import api from './api';

export const memberService = {
  list: (params) => api.get('/members', { params }).then((r) => r.data),
  get: (id) => api.get(`/members/${id}`).then((r) => r.data),
  create: (data) => api.post('/members', data).then((r) => r.data),
  update: (id, data) => api.put(`/members/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/members/${id}`).then((r) => r.data),
};
