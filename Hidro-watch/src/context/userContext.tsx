import React, { createContext, PropsWithChildren, useContext } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { AuthContext } from './authcontext';

type UserContextProps = {
  GetUserforId: () => Promise<void>;
  Postuser: (name: string, email: string, password: string) => Promise<void>;
  deleteUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  validateResetCode: (code: string) => Promise<void>;
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

  async function forgotPassword(email: string) {
    try {
      const response = await api.post('/password/reset-code', { email });
      Alert.alert('Código de recuperação enviado para o e-mail');
    } catch (error) {
      console.error('Erro ao solicitar código de recuperação:', error);
      Alert.alert('Erro ao solicitar código de recuperação');
    }
  }

  async function validateResetCode(code: string) {
    try {
      const response = await api.post('/password/validate-code', { code });
      Alert.alert('Código válido');
    } catch (error) {
      console.error('Erro ao validar código:', error);
      Alert.alert('Código inválido ou expirado');
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