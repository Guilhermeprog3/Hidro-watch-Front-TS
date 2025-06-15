import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { api } from '../services/api';
import { AuthContext } from './authcontext';

type ObjectContextProps = {
  getUserDevice: () => Promise<any>;
  postUserDevice: (deviceData: any) => Promise<void>;
  GetDeviceforId: (deviceId: string) => Promise<any>;
  markFavorite: (deviceId: string) => Promise<void>;
  DeleteDevice: (deviceId: string) => Promise<void>;
};

export const ObjectContext = createContext<ObjectContextProps>({} as ObjectContextProps);

export const ObjectProvider = ({ children }: PropsWithChildren) => {
  const { user } = useContext(AuthContext);
  const [setdevice] = useState<any | null>(null);

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
      return null;
    }
  }

  async function postUserDevice(deviceData: any) {
    if (!user) return;
    try {
      const response = await api.post(
        'device',
        { title: deviceData.title, location: deviceData.location },
        { headers: { Authorization: `Bearer ${user.token.token}` } }
      );
    } catch (error) {
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
      setdevice(response.data);
      return response.data;
    } catch (error) {
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
    }
  }

  async function DeleteDevice(deviceId: string) {
    if (!user?.token.token) {
      return;
    }
    try {
      const token = user.token.token;
      const response = await api.delete(`device/${deviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
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