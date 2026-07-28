import api from './api';

export const privacyService = {
  exportData: () => api.get('/privacy/export-data', { responseType: 'blob' }),
  deleteAccount: () => api.delete('/privacy/delete-account')
};
