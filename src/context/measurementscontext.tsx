import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { AuthContext } from './authcontext';

type MeasurementContextProps = {
  getWeeklyAverage: (deviceId: string) => Promise<any>;
  getLatestMeasurement: (deviceId: string) => Promise<any>;
};

export const MeasurementContext = createContext<MeasurementContextProps>({} as MeasurementContextProps);

export const MeasurementProvider = ({ children }: PropsWithChildren) => {
  const { user } = useContext(AuthContext);
  
  async function getWeeklyAverage(deviceId: string) {
    if (!user?.token.token) {
      return null;
    }
    try {
      const token = user.token.token;
      const response = await api.get(`device/${deviceId}/weekly-average`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      Alert.alert('Erro ao buscar média semanal');
      return null;
    }
  }

  async function getLatestMeasurement(deviceId: string) {
    if (!user?.token.token) {
      return null;
    }
    try {
      const token = user.token.token;
      const response = await api.get(`device/${deviceId}/measurements-latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
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