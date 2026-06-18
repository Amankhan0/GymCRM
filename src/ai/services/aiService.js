import api from './api';

const unwrap = (res) => res.data?.data;

export const authApi = {
  signup: (body) => api.post('/ai/auth/signup', body).then(unwrap),
  login: (body) => api.post('/ai/auth/login', body).then(unwrap),
  google: (credential) => api.post('/ai/auth/google', { credential }).then(unwrap),
  me: () => api.get('/ai/auth/me').then(unwrap),
};

export const genApi = {
  image: (body) => api.post('/ai/generate/image', body).then((r) => r.data.data),
  video: (body) => api.post('/ai/generate/video', body).then((r) => r.data),
  list: (params) => api.get('/ai/generations', { params }).then(unwrap),
  remove: (id) => api.delete(`/ai/generations/${id}`).then((r) => r.data),
};

export const accountApi = {
  plans: () => api.get('/ai/plans').then(unwrap),
  mySub: () => api.get('/ai/subscription/me').then(unwrap),
  submitRequest: (body) => api.post('/ai/subscription/request', body).then(unwrap),
};

export const adminApi = {
  stats: () => api.get('/ai/admin/stats').then(unwrap),
  requests: (status) => api.get('/ai/admin/payment-requests', { params: { status } }).then(unwrap),
  approve: (id) => api.post(`/ai/admin/payment-requests/${id}/approve`).then((r) => r.data),
  reject: (id, reason) => api.post(`/ai/admin/payment-requests/${id}/reject`, { reason }).then((r) => r.data),
};
