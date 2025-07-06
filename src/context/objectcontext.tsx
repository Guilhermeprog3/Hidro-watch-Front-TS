import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { api } from '../services/api';
import { AuthContext } from './authcontext';

type ObjectContextProps = {
  getUserDevice: () => Promise<any>;
  postUserDevice: (deviceId: string) => Promise<void>;
  GetDeviceforId: (deviceId: string) => Promise<any>;
  markFavorite: (deviceId: string) => Promise<void>;
  DeleteDevice: (deviceId: string) => Promise<void>;
};

export const ObjectContext = createContext<ObjectContextProps>({} as ObjectContextProps);

export const ObjectProvider = ({ children }: PropsWithChildren) => {
  const { user } = useContext(AuthContext);
  const [device, setDevice] = useState<any | null>(null);

  async function getUserDevice() {
    if (!user?.token.token) {
      return null;
    }
    try {
      const token = user.token.token;
      const response = await api.get('device', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dispositivos do usuário:", error);
      return null;
    }
  }

  async function postUserDevice(deviceId: string) {
    if (!user?.token.token) return;
    try {
      await api.post(
        `device/${deviceId}/associate`,
        {},
        { headers: { Authorization: `Bearer ${user.token.token}` } }
      );
    } catch (error) {
      console.error("Erro ao associar dispositivo:", error);
    }
  }

  async function GetDeviceforId(deviceId: string) {
    if (!user?.token.token) {
      return null;
    }
    try {
      const token = user.token.token;
      const response = await api.get(`device/${deviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevice(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dispositivo por ID:", error);
      return null;
    }
  }

  async function markFavorite(deviceId: string) {
    if (!user?.token.token) {
      return;
    }
    try {
      const token = user.token.token;
      const response = await api.patch(
        `device/${deviceId}/edit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao favoritar dispositivo:", error);
    }
  }

  async function DeleteDevice(deviceId: string) {
    if (!user?.token.token) {
      return;
    }
    try {
      const token = user.token.token;
      await api.delete(`device/${deviceId}/leave`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Erro ao se desassociar do dispositivo:", error);
    }
  }

  return (
    <ObjectContext.Provider
      value={{
        getUserDevice,
        postUserDevice,
        GetDeviceforId,
        markFavorite,
        DeleteDevice
      }}
    >
      {children}
    </ObjectContext.Provider>
  );
};