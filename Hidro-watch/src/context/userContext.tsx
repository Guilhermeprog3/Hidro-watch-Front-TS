import React, { createContext, PropsWithChildren, useContext } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { AuthContext } from './authcontext';

type UserContextProps = {
  GetUserforId: () => Promise<void>;
  Postuser: (name: string, email: string, password: string) => Promise<void>;
  deleteUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean }>;
  validateResetCode: (code: string) => Promise<boolean>;
  resetPassword: (code: string, newPassword: string) => Promise<void>;
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
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      Alert.alert('Erro ao buscar dados do usuário');
    }
  }

  async function Postuser(name: string, email: string, password: string) {
    try {
      const response = await api.post('user', { email, password, name });
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

  async function forgotPassword(email: string) {
    try {
      const response = await api.post('/password/reset-code', { email });
  
      if (response.status === 200) {
        return { success: true };
      } else {
        throw new Error('Erro ao enviar o código de recuperação');
      }
    } catch (error) {
      console.log('Erro ao solicitar código de recuperação:', error);
      throw error;
    }
  }

  async function validateResetCode(code: string) {
    try {
      const response = await api.post('/password/validate-code', { code });
      if (response.data.message === 'Código válido') {
        return true;
      } else {
        throw new Error('Código inválido ou expirado');
      }
    } catch (error) {
      throw error;
    }
  }

  async function resetPassword(code: string, new_password: string) {
    try {
      const response = await api.patch('/password/reset', { code, new_password });
      Alert.alert('Senha redefinida com sucesso');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      Alert.alert('Erro ao redefinir senha');
    }
  }

  return (
    <UserContext.Provider
      value={{
        GetUserforId,
        Postuser,
        deleteUser,
        forgotPassword,
        validateResetCode,
        resetPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};