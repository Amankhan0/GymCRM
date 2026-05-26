import api from './api';

export const attendanceService = {
  list: (params) => api.get('/attendance', { params }).then((r) => r.data),
  mark: (data) => api.post('/attendance', data).then((r) => r.data),
  remove: (id) => api.delete(`/attendance/${id}`).then((r) => r.data),
};
