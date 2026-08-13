import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  // Booking creation can take longer while Django saves the appointment and
  // prepares its WhatsApp confirmation. Avoid aborting a successful request.
  timeout: 30000,
});

// Interceptor to attach JWT token for Admin Requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
