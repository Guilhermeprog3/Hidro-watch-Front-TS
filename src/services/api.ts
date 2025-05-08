import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Configuração base da API
export const api = axios.create({
  baseURL: "http://172.28.144.1:3333/",
  timeout: 10000, // 10 segundos
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use(async (config) => {
  // Recupera o token de forma segura
  const token = Platform.OS === 'web' 
    ? localStorage.getItem('@auth:token')
    : await SecureStore.getItemAsync('authToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Tratamento específico para token expirado
    if (error.response?.status === 401) {
      // Aqui você pode adicionar lógica de refresh token se necessário
      console.warn('Sessão expirada - redirecionando para login');
      // Limpar tokens e redirecionar
      await SecureStore.deleteItemAsync('authToken');
      // Redirecionamento seria feito via contexto/navegação
    }
    
    return Promise.reject(error);
  }
);

// Função específica para atualizar o token de notificação
export const updateNotificationToken = async (token: string) => {
  try {
    const response = await api.patch('/users/update-notification-token', { 
      token 
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar token de notificação:', error);
    throw error;
  }
};

// Função para testar notificações manualmente
export const sendTestNotification = async (userId: number) => {
  return api.post('/notifications/test', { userId });
};