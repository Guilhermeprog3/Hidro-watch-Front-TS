import React, { createContext, PropsWithChildren, useContext } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { AuthContext } from './authcontext';

interface User {
  User: any;
  id: string;
  name: string;
  email: string;
  profile_picture?: string;
  token: {
    token: string;
  };
}

type UserContextProps = {
  GetUserforId: () => Promise<User | null>;
  Postuser: (name: string, email: string, password: string) => Promise<void>;
  deleteUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean }>;
  validateResetCode: (code: string) => Promise<boolean>;
  resetPassword: (code: string, newPassword: string) => Promise<void>;
  updateProfilePicture: (imageUri: string) => Promise<User>;
};

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const { user } = useContext(AuthContext);

  async function GetUserforId(): Promise<User | null> {
    if (!user?.id) {
      console.error('Usuário ou ID não encontrado');
      return null;
    }
    try {
      const token = user.token.token;
      const response = await api.get(`user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as User;
    } catch (error) {
      console.log('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }

  async function Postuser(name: string, email: string, password: string): Promise<void> {
    try {
      await api.post('user', { email, password, name });
    } catch (error: any) {
      if (error.response) {
         if (error.response.status === 409) {
          throw new Error('Email já está em uso. Por favor, use outro email.');
        }
      }
      throw new Error('Falha ao criar usuário. Tente novamente mais tarde.');
    }
  }

  async function deleteUser(): Promise<void> {
    if (!user?.id) {
      return;
    }
    try {
      const token = user.token.token;
      await api.delete(`user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      Alert.alert('Erro ao deletar usuário');
    }
  }

  async function forgotPassword(email: string): Promise<{ success: boolean }> {
    try {
      const response = await api.post('/password/reset-code', { email });
      if (response.status !== 200) {
        throw new Error('Erro ao enviar código de recuperação.');
      }
      return { success: true };
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error('Nenhum usuário encontrado com este email.');
        }
      }
      console.error('Falha no forgotPassword:', error);
      return { success: false };
    }
  }

  async function validateResetCode(code: string): Promise<boolean> {
    try {
      const response = await api.post('/password/validate-code', { code });
      return response.data.message === 'Código válido';
    } catch (error: any) {
      if (error.response) {
         if (error.response.status === 404) {
          throw new Error('Código não encontrado ou expirado.');
        }
      }
      throw new Error('Falha ao validar código. Tente novamente mais tarde.');
    }
  }

  async function resetPassword(code: string, newPassword: string): Promise<void> {
    try {
      if (!code || !newPassword) {
        throw new Error('Código e nova senha são obrigatórios.');
      }

      await api.patch('/password/reset', { code, new_password: newPassword });
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error('Dados inválidos fornecidos para redefinição de senha.');
        } else if (error.response.status === 404) {
          throw new Error('Código inválido ou expirado.');
        }
      }
      throw new Error('Falha ao redefinir senha. Tente novamente mais tarde.');
    }
  }

  const updateProfilePicture = async (imageUri: string): Promise<User> => {
    if (!user?.id || !user?.token?.token) {
      throw new Error('Usuário não autenticado');
    }
    try {
      const formData = new FormData();
      formData.append('profile_picture', {
        uri: imageUri,
        name: 'profile_picture.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await api.patch(`/user/${user.id}/picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token.token}`,
        },
      });
      return response.data as User;
    } catch (error: any) {
      console.error('Erro no upload:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Falha ao atualizar a foto de perfil');
    }
  };

  return (
    <UserContext.Provider
      value={{
        updateProfilePicture,
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
