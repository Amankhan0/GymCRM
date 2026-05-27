import api from './api';

export const dashboardService = {
  stats: () => api.get('/dashboard/stats').then((r) => r.data),
  revenueChart: () => api.get('/dashboard/revenue-chart').then((r) => r.data),
  attendanceChart: () => api.get('/dashboard/attendance-chart').then((r) => r.data),
};
