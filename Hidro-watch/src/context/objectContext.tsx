import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { AuthContext } from './authContext';

type ObjectContextProps = {
  getUserObjects: () => Promise<any>;
  postUserObject: (objectData: any) => Promise<void>;
  GetObjectforId: (objectId: string) => Promise<any>;
  markFavorite: (objectId: string) => Promise<void>;
};

export const ObjectContext = createContext<ObjectContextProps>({} as ObjectContextProps);

export const ObjectProvider = ({ children }: PropsWithChildren) => {
  const { user } = useContext(AuthContext);
  const [object, setObject] = useState<any | null>(null);

  async function getUserObjects() {
    if (!user?.token.token) {
      console.error('Usuário ou token não encontrados');
      return null;
    }
    try {
      const token = user.token.token;
      const response = await api.get('object', {
        headers: { Authorization: `Bearer ${token}` },
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
      const response = await api.post(
        'object',
        { tittle: objectData.Tittle, location: objectData.Location },
        { headers: { Authorization: `Bearer ${user.token.token}` } }
      );
      Alert.alert('Objeto criado com sucesso');
    } catch (error) {
      console.error(error);
    }
  }

  async function GetObjectforId(objectId: string) {
    if (!user?.token.token) {
      console.error('Usuário ou token não encontrados');
      return null;
    }
    try {
      const token = user.token.token;
      const response = await api.get(`object/${objectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setObject(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do objeto:', error);
      Alert.alert('Erro ao buscar dados do objeto');
      return null;
    }
  }

  async function markFavorite(objectId: string) {
    if (!user?.token.token) {
      console.error('Usuário ou token não encontrados');
      return;
    }
    try {
      const token = user.token.token;
      const response = await api.patch(
        `object/${objectId}/edit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar como favorito:', error);
    }
  }

  return (
    <ObjectContext.Provider value={{ getUserObjects, postUserObject, GetObjectforId, markFavorite }}>
      {children}
    </ObjectContext.Provider>
  );
};