import React, { createContext, PropsWithChildren, useContext } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { AuthContext } from './authContext';

type UserContextProps = {
  GetUserforId: () => Promise<void>;
  Postuser: (name: string, email: string, password: string) => Promise<void>;
  deleteUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const { user } = useContext(AuthContext);

  async function GetUserforId() {
    if (!user?.id) {
      console.error('Usuário ou ID não encontrado');
      return;
    }
    try {
      const token = user.token.token;
      const response = await api.get(`user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    if (!user?.id) {
      console.error('Usuário ou ID não encontrado');
      return;
    }
    try {
      const token = user.token.token;
      const response = await api.delete(`user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Usuário deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      Alert.alert('Erro ao deletar usuário');
    }
  }

  return (
    <UserContext.Provider value={{ GetUserforId, Postuser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};