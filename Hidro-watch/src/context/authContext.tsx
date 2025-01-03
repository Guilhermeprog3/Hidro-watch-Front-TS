import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

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
  getUserObjects: () => Promise<any>;
  postUserObject: (objectData: any) => Promise<void>;
  Postuser: (name: string, email: string, password: string) => Promise<void>;
  deleteUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getStorageData() {
      const userStorage = await AsyncStorage.getItem('@token-hidrowatch!');
      if (userStorage) {
        setUser(JSON.parse(userStorage));
      }
    }
    getStorageData();
  }, []);

  async function login(email: string, password: string) {
    try {
      const response = await api.post('session', { email, password });
      await AsyncStorage.setItem('@token-hidrowatch!', JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      Alert.alert('Erro de Autenticação');
      console.error(error);
    }
  }

  async function logout() {
    await AsyncStorage.removeItem('@token-hidrowatch!');
    setUser(null);
  }

  async function Postuser(name: string, email: string, password: string) {
    try {
      const response = await api.post('user', { name, email, password });
      Alert.alert('Usuário criado com sucesso');
    } catch (error) {
      Alert.alert('Erro ao criar usuário');
      console.error(error);
    }
  }

  async function deleteUser() {
    if (!user || !user.token || !user.token.token) {
      console.error('Usuário ou token não encontrados');
      return;
    }

    try {
      const token = user.token.token;
      await api.delete('user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await AsyncStorage.removeItem('@token-hidrowatch!');
      setUser(null);
      Alert.alert('Usuário deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      Alert.alert('Erro ao deletar usuário');
    }
  }

  async function getUserObjects() {
    if (!user || !user.token || !user.token.token) {
      console.error('Usuário ou token não encontrados');
      return null;
    }

    try {
      const token = user.token.token;
      const response = await api.get('object', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro:', error);
      return null;
    }
  }

  async function postUserObject(objectData: any) {
    if (!user) return;

    try {
      const response = await api.post('object', {
        tittle: objectData.Tittle,
        location: objectData.Location,
      }, {
        headers: {
          Authorization: `Bearer ${user.token.token}`,
        },
      });
      Alert.alert('Objeto criado com sucesso');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, getUserObjects, postUserObject, Postuser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};
