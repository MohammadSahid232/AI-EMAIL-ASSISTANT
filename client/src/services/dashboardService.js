import api from './api';

export const dashboardService = {
  getStatistics: () => api.get('/dashboard/statistics'),
  getAnalytics: () => api.get('/dashboard/analytics'),
  getActivities: () => api.get('/dashboard/activities')
};
