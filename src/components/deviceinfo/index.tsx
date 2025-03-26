import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';

type DeviceInfoProps = {
  isConnected: boolean;
  lastMeasurementDate: string;
};

const DeviceInfo: React.FC<DeviceInfoProps> = ({ isConnected, lastMeasurementDate }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    connectedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      borderRadius: 30,
      marginBottom: 20,
      marginTop: 20,
    },
    connectedText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    lastMeasurementContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(4, 4, 4, 0.1)',
      padding: 18,
      borderRadius: 30,
    },
    lastMeasurementText: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: 'bold',
      marginLeft: 10,
    },
  });

  return (
    <View>
      <View style={[styles.connectedContainer, { backgroundColor: isConnected ? 'rgba(22, 233, 22, 0.15)' : 'rgba(222, 20, 20, 0.2)' }]}>
        <Ionicons name="wifi" size={24} color={isConnected ? 'green' : 'red'} />
        <Text style={[styles.connectedText, { color: isConnected ? 'green' : 'red' }]}>
          {isConnected ? 'DISPOSITIVO CONECTADO' : 'DISPOSITIVO DESCONECTADO'}
        </Text>
      </View>

      <View style={styles.lastMeasurementContainer}>
        <Ionicons name="time" size={24} color="#fff" />
        <Text style={styles.lastMeasurementText}>Última Medição: {lastMeasurementDate}</Text>
      </View>
    </View>
  );
};

export default DeviceInfo;