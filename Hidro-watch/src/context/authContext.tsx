import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { api } from '../services/api';

type UserToken = {
  token: string;
  type: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  token: UserToken;
};

type AuthContextProps = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
      await AsyncStorage.setItem('@token-hidrowatch!2', JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      Alert.alert('Erro de Autenticação');
      console.error(error);
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