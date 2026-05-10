import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

// Automatically attach telegram_id if present
api.interceptors.request.use((config) => {
  const telegramId = localStorage.getItem('telegram_id');
  if (telegramId) {
    config.params = { ...config.params, telegram_id: telegramId };
  }
  return config;
});

export default api;
