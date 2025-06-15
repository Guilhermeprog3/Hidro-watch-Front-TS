import React, { createContext, PropsWithChildren, useContext } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { AuthContext } from './authcontext';

interface User {
  id: string;
  name: string;
  email: string;
  profile_picture?: string;
  token: {
    token: string;
  };
}
type UserContextProps = {
  initEmailVerification: (email: string) => Promise<boolean>;
  confirmEmailVerification: (email: string, code: string) => Promise<boolean>;
  postUser: (name: string, email: string, password: string) => Promise<void>;
  GetUserforId: () => Promise<User | null>;
  deleteUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  validateResetCode: (code: string) => Promise<boolean>;
  resetPassword: (code: string, newPassword: string) => Promise<void>;
  updateProfilePicture: (imageUri: string) => Promise<User>;
};

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const { user } = useContext(AuthContext);

  async function GetUserforId(): Promise<User | null> {

    if (!user?.user.id) {
      return null;
    }
    try {
      const token = user.token.token;
      const response = await api.get(`user/${user.user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data as User;
    } catch (error: any) {
      return null;
    }
  }

   async function initEmailVerification(email: string): Promise<boolean> {
    try {
      await api.post('email/verify-init', { email });
      return true;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Este e-mail já está em uso.');
      }
      throw new Error('Falha ao enviar o código de verificação.');
    }
  }

  async function confirmEmailVerification(email: string, code: string): Promise<boolean> {
    try {
      const response = await api.post('email/verify-confirm', { email, code });
      return response.data.verified === true;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Código inválido ou expirado.');
      }
      throw new Error('Falha ao verificar o código.');
    }
  }

  async function postUser(name: string, email: string, password: string): Promise<void> {
    try {
      await api.post('users', { email, password, name });
    } catch (error: any) {
      throw new Error('Falha ao criar usuário. Tente novamente mais tarde.');
    }
  }

  async function deleteUser(): Promise<void> {
    if (!user?.user.id) {
      return;
    }
    try {
      const token = user.token.token;
      await api.delete(`user/${user.user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      Alert.alert('Erro ao deletar usuário');
    }
  }

  async function forgotPassword(email: string): Promise<void> {
    try {
      const response = await api.post('/password/reset-code', { email });
      if (response.status !== 200) {
        throw new Error('Erro ao enviar código de recuperação.');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Falha ao enviar código de recuperação. Tente novamente mais tarde.');
    }
  }

  async function validateResetCode(code: string): Promise<boolean> {
    try {
      const response = await api.post('/password/validate-code', { code });
      return response.data.message === 'Código válido';
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
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
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Falha ao redefinir senha. Tente novamente mais tarde.');
    }
  }

  const updateProfilePicture = async (imageUri: string): Promise<User> => {
    if (!user?.user.id || !user?.token?.token) {
      throw new Error('Usuário não autenticado');
    }
    try {
      const formData = new FormData();
      formData.append('profile_picture', {
        uri: imageUri,
        name: 'profile_picture.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await api.patch(`/user/${user.user.id}/picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token.token}`,
        },
      });
      return response.data as User;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Falha ao atualizar a foto de perfil');
    }
  };

  return (
    <UserContext.Provider
      value={{
        updateProfilePicture,
        GetUserforId,
        initEmailVerification,
        confirmEmailVerification,
        postUser,
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
