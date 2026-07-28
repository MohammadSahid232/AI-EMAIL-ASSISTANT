import api from './api';

export const templateService = {
  getTemplates: (params) => api.get('/templates', { params }),
  createTemplate: (data) => api.post('/templates', data),
  updateTemplate: (id, data) => api.put(`/templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/templates/${id}`)
};
