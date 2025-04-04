import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';
import { useObject } from '../../hooks/Objectcontext';
import { Measurementobject } from '../../hooks/measurements';
import Feather from '@expo/vector-icons/Feather';

type DeviceInfoProps = {
  deviceId: string;
};

const DeviceInfo: React.FC<DeviceInfoProps> = ({ deviceId }) => {
  const { theme } = useTheme();
  const { GetObjectforId } = useObject();
  const { getLatestMeasurement } = Measurementobject();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMeasurementDate, setLastMeasurementDate] = useState('Carregando...');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [objectData, latestMeasurement] = await Promise.all([
          GetObjectforId(deviceId),
          getLatestMeasurement(deviceId),
        ]);

        if (objectData) {
          setIsConnected(objectData.connected || false);
        }

        if (latestMeasurement?.createdAt) {
          const date = new Date(latestMeasurement.createdAt);
          setLastMeasurementDate(date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }));
        } else {
          setLastMeasurementDate('Nenhuma medição registrada');
        }
      } catch (error) {
        setLastMeasurementDate('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [deviceId]);

  const styles = StyleSheet.create({
    
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 25,
      marginBottom: 20,
      backgroundColor: isConnected ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
    },
    statusText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
      fontFamily: 'Inter-SemiBold',
    },
    lastMeasurementContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 25,

    },
    lastMeasurementText: {
      color: theme.textPrimary,
      fontSize: 14,
      marginLeft: 10,
      fontFamily: 'Inter-Regular',
    },
    loadingContainer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={theme.iconColor} />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.statusContainer}>
      {isConnected ? (
        <Ionicons 
          name="wifi" 
          size={24} 
          color="#2ecc71" 
        />
      ) : (
        <Feather 
          name="wifi-off" 
          size={24} 
          color="#e74c3c" 
        />
      )}
      <Text style={[styles.statusText, { color: isConnected ? "#2ecc71" : "#e74c3c" }]}>
        {isConnected ? 'DISPOSITIVO CONECTADO' : 'DISPOSITIVO DESCONECTADO'}
      </Text>
    </View>

      <View style={styles.lastMeasurementContainer}>
        <Ionicons name="time-outline" size={20} color={theme.iconColor} />
        <Text style={styles.lastMeasurementText}>
          Última medição: {lastMeasurementDate}
        </Text>
      </View>
    </View>
  );
};

export default DeviceInfo;