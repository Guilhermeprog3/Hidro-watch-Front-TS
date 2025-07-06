import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const api = axios.create({
  baseURL: "http://192.168.0.199:3333/",
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
    throw error;
  }
};