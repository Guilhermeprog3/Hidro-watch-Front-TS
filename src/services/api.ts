import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const api = axios.create({
  baseURL: "http://192.168.56.1:3333/",
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const token = Platform.OS === 'web' 
    ? localStorage.getItem('@auth:token')
    : await SecureStore.getItemAsync('authToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Sessão expirada - redirecionando para login');
      await SecureStore.deleteItemAsync('authToken');
    }
    
    return Promise.reject(error);
  }
);
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

export const sendTestNotification = async (userId: number) => {
  return api.post('/notifications/test', { userId });
};