import React, { createContext, PropsWithChildren, useContext } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { AuthContext } from './authcontext';

type UserContextProps = {
  GetUserforId: () => Promise<void>;
  Postuser: (name: string, email: string, password: string) => Promise<void>;
  deleteUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  validateResetCode: (code: string) => Promise<boolean>;
  resetPassword: (code: string, newPassword: string) => Promise<void>;
  updateProfilePicture: (imageUri: string) => Promise<void>;
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
      console.log('Erro ao buscar dados do usuário:', error);
    }
  }

  async function Postuser(name: string, email: string, password: string) {
    try {
      const response = await api.post('user', { email, password, name });
      
      if (!response.data) {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error('Dados inválidos fornecidos para criação de usuário.');
        } else if (error.response.status === 409) {
          throw new Error('Email já está em uso. Por favor, use outro email.');
        } else {
          throw new Error('Falha ao criar usuário. Tente novamente mais tarde.');
        }
      }
      throw error;
    }
  }

  async function deleteUser() {
    if (!user?.id) {
      console.log('Usuário ou ID não encontrado');
      return;
    }
    try {
      const token = user.token.token;
      const response = await api.delete(`user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log('Erro ao deletar usuário:', error);
      Alert.alert('Erro ao deletar usuário');
    }
  }

  async function forgotPassword(email: string) {
    try {
      const response = await api.post('/password/reset-code', { email });
      
      if (response.status !== 200) {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error('Email inválido ou formato incorreto.');
        } else if (error.response.status === 404) {
          throw new Error('Nenhum usuário encontrado com este email.');
        } else if (error.response.status === 429) {
          throw new Error('Muitas tentativas. Por favor, espere antes de tentar novamente.');
        } else {
          throw new Error('Falha ao enviar código de recuperação. Tente novamente mais tarde.');
        }
      }
      throw error;
    }
  }

  async function validateResetCode(code: string) {
    try {
      const response = await api.post('/password/validate-code', { code });
      
      if (response.data.message === 'Código válido') {
        return true;
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error('Código inválido ou formato incorreto.');
        } else if (error.response.status === 404) {
          throw new Error('Código não encontrado ou expirado.');
        } else {
          throw new Error('Falha ao validar código. Tente novamente mais tarde.');
        }
      }
      throw error;
    }
  }

  async function resetPassword(code: string, new_password: string): Promise<void> {
    try {
      if (!code || !new_password) {
        throw new Error('Código e nova senha são obrigatórios.');
      }

      const response = await api.patch('/password/reset', { code, new_password });

      if (response.status !== 200) {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error('Dados inválidos fornecidos para redefinição de senha.');
        } else if (error.response.status === 404) {
          throw new Error('Código inválido ou expirado.');
        } else if (error.response.status === 422) {
          throw new Error('A nova senha não atende aos requisitos de segurança.');
        } else {
          throw new Error('Falha ao redefinir senha. Tente novamente mais tarde.');
        }
      }
      throw error;
    }
  }

  const updateProfilePicture = async (imageUri: string) => {
    if (!user?.id) {
      console.error('Usuário ou ID não encontrado');
      return;
    }
  
    try {
      const token = user.token.token;
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      const formData = new FormData();
      formData.append('profile_picture', blob, 'profile.jpg');
  
      const apiResponse = await api.patch(`user/${user.id}/picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (apiResponse.status === 200) {
        Alert.alert('Sucesso', 'Imagem de perfil atualizada!');
      } else {
        throw new Error('Erro ao atualizar a imagem de perfil');
      }
    } catch (error) {
      console.log('Erro ao atualizar a imagem de perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a imagem de perfil.');
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