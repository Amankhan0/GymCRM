import api from './api';

export const profileService = {
  update: (data) => api.put('/profile', data).then((r) => r.data),
  changePassword: (data) => api.put('/profile/password', data).then((r) => r.data),
};
