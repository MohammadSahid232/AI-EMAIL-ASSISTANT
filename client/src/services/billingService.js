import api from './api';

export const billingService = {
  getSubscriptionStatus: () => api.get('/billing/status'),
  createCheckoutSession: (plan) => api.post('/billing/create-checkout-session', { plan }),
  createCustomerPortal: () => api.post('/billing/customer-portal')
};
