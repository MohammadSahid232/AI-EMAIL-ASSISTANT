import api from './api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getEmailLogs: () => api.get('/admin/emails'),
  getSystemLogs: () => api.get('/admin/system-logs'),
  getApiUsage: () => api.get('/admin/api-usage')
};
