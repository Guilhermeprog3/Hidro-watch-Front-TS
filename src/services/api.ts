import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const api = axios.create({
  baseURL: "https://hidro-watch-api.onrender.com/",
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
    const response = await api.patch('users/update-token', { 
      notificationToken: token 
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar token de notificação:', error);
    throw error;
  }
};