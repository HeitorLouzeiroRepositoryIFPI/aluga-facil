import axios from 'axios';
import { parseCookies } from 'nookies';

const cookies = parseCookies();

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona o token em todas as requisições
api.interceptors.request.use((config) => {
  const { 'alugafacil.token': token } = parseCookies();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Intercepta erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Erro de autenticação
    if (error.response?.status === 401) {
      // Redirecionar para login se necessário
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Erro de permissão
    if (error.response?.status === 403) {
      // Tratar erro de permissão
      console.error('Erro de permissão:', error);
    }

    return Promise.reject(error);
  }
);

export default api;
