import axios from 'axios';

const API = axios.create({
  baseURL: `http://${window.location.hostname}:8080/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token automatically on protected endpoints
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
