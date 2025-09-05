// src/api/apiService.ts
import axios from 'axios';

// A URL base da sua API em produção (do ficheiro .env)
const API_URL = import.meta.env.VITE_API_URL || 'https://www.sofiarodfer.com/api';

const apiService = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token JWT a cada pedido
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Garante que o cabeçalho 'Authorization' é definido corretamente
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiService;