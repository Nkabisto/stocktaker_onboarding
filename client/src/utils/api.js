import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

export const userAPI = {
  getStatus: (userId) => api.get(`/users/${userId}/status`),
  upsertUser: (userData) => api.post('/users/upsert', userData),
  submitForm: (userId, formData) => api.post('/users/submit', { userId, formData })
};

export default api;
