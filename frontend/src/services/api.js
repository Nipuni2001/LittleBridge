import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT — check both key names for backward compatibility
api.interceptors.request.use(config => {
  try {
    const token = localStorage.getItem('lb_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// Handle 401 — clear session and redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      try {
        // Clear all possible key combinations
        ['lb_token', 'lb_user', 'token', 'user'].forEach(k => localStorage.removeItem(k));
      } catch {}
      const path = window.location.pathname;
      if (!['/login', '/signup', '/'].includes(path)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
