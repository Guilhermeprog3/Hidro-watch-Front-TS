import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, updateNotificationToken } from '../services/api';
import { registerForPushNotificationsAsync } from '../services/notificationService';

type UserToken = {
  token: string;
  type: string;
};

type User = {
  user: any;
  password: string;
  id: string;
  name: string;
  email: string;
  token: UserToken;
};

type AuthContextProps = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getStorageData() {
      const userStorage = await AsyncStorage.getItem('@token-hidrowatch!2');
      if (userStorage) {
        setUser(JSON.parse(userStorage));
      }
    }
    getStorageData();
  }, []);

  async function login(email: string, password: string) {
    try {
      const response = await api.post('session', { email, password });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem('@token-hidrowatch!2', JSON.stringify(response.data));
        setUser(response.data);
        const notificationToken = await registerForPushNotificationsAsync();
        if (notificationToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token.token}`;
          await updateNotificationToken(notificationToken);
        }
        
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error: any) {
      if (error.response) {
         if (error.response.status === 401 || error.response.status === 400) {
          throw new Error('Credenciais inválidas. Verifique seu email e senha.');
        } else {
          throw new Error('Falha na conexão. Tente novamente mais tarde.');
        }
      }
    }
  }
  
  async function logout() {
    await AsyncStorage.removeItem('@token-hidrowatch!2');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
