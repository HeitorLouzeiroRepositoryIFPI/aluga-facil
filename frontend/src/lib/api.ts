import axios from 'axios';
import { ImovelDTO, LoginRequest } from '@/types';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Interceptor para adicionar o token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (data: LoginRequest) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

export const imoveis = {
  listar: async () => {
    const response = await api.get('/imoveis');
    return response.data;
  },
  
  buscarPorId: async (id: number) => {
    const response = await api.get(`/imoveis/${id}`);
    return response.data;
  },
  
  cadastrar: async (data: ImovelDTO) => {
    const response = await api.post('/imoveis', data);
    return response.data;
  },
  
  buscarPorProprietario: async (proprietarioId: number) => {
    const response = await api.get(`/imoveis/proprietario/${proprietarioId}`);
    return response.data;
  },
};

export const clientes = {
  cadastrar: async (data: { nome: string; email: string; senha: string }) => {
    const response = await api.post('/clientes', data);
    return response.data;
  },
};

export const proprietarios = {
  cadastrar: async (data: { nome: string; email: string; senha: string }) => {
    const response = await api.post('/proprietarios', data);
    return response.data;
  },
};
