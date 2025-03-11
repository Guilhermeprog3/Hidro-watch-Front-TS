import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { AuthContext } from './authcontext';

type MeasurementContextProps = {
  getWeeklyAverage: (objectId: string) => Promise<any>;
  getLatestMeasurement: (objectId: string) => Promise<any>;
};

export const MeasurementContext = createContext<MeasurementContextProps>({} as MeasurementContextProps);

export const MeasurementProvider = ({ children }: PropsWithChildren) => {
  const { user } = useContext(AuthContext);
  
  async function getWeeklyAverage(objectId: string) {
    if (!user?.token.token) {
      console.error('Usuário ou token não encontrados');
      return null;
    }
    try {
      const token = user.token.token;
      const response = await api.get(`object/${objectId}/weekly-average`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar média semanal:', error);
      Alert.alert('Erro ao buscar média semanal');
      return null;
    }
  }

  async function getLatestMeasurement(objectId: string) {
    if (!user?.token.token) {
      console.error('Usuário ou token não encontrados');
      return null;
    }
    try {
      const token = user.token.token;
      const response = await api.get(`object/${objectId}/measurements-latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar medição mais recente:', error);
      Alert.alert('Erro ao buscar medição mais recente');
      return null;
    }
  }

  return (
    <MeasurementContext.Provider
      value={{
        getWeeklyAverage,
        getLatestMeasurement,
      }}
    >
      {children}
    </MeasurementContext.Provider>
  );
};