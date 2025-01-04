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
  GetUserforId: () => Promise<void>;
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

  async function GetUserforId() {
    if (!user || !user.id) {
      console.error('Usuário ou ID não encontrado');
      return;
    }

    try {
      const token = user.token.token;
      const response = await api.get(`user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      Alert.alert('Dados do usuário atualizados com sucesso');
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      Alert.alert('Erro ao buscar dados do usuário');
    }
  }

  async function Postuser(name: string, email: string, password: string) {
    try {
      const response = await api.post('user', { email, password, name });
      Alert.alert('Usuário criado com sucesso');
    } catch (error) {
      Alert.alert('Erro ao criar usuário');
      console.error(error);
    }
  }

  async function deleteUser() {
    if (!user || !user.id) {
      console.error('Usuário ou ID não encontrado');
      return;
    }

    try {
      const token = user.token.token;
      const response = await api.delete(`user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      await AsyncStorage.removeItem('@token-hidrowatch!2');
      setUser(null);
      Alert.alert('Usuario deletado com Sucesso');
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      Alert.alert('Erro ao buscar dados do usuário');
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
    <AuthContext.Provider value={{ user, login, logout, getUserObjects, postUserObject, Postuser, deleteUser, GetUserforId }}>
      {children}
    </AuthContext.Provider>
  );
};
