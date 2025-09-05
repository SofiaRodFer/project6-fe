// src/api/apiService.ts
import axios from 'axios';

// A URL base agora aponta para o nosso proxy
const API_URL = '/api';

const apiService = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token JWT a cada pedido (isso continua igual)
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiService;