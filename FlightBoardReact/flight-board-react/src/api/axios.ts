
const api = axios.create({
  baseURL: 'https://localhost:7051/api', 
});

import axios from 'axios';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
