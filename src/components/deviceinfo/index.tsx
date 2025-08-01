import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';
import { useObject } from '../../hooks/Objectcontext';
import { Measurementobject } from '../../hooks/measurements';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

type DeviceInfoProps = {
  deviceId: string;
};

const colorLegend = [
    { colors: ['#FF5252', '#D32F2F'], label: 'Crítico' },
    { colors: ['#FFD54F', '#FFA000'], label: 'Abaixo do Ideal' },
    { colors: ['#66BB6A', '#388E3C'], label: 'Ideal' },
    { colors: ['#42A5F5', '#1976D2'], label: 'Acima' },
    { colors: ['#AB47BC', '#7B1FA2'], label: 'Muito Acima' },
] as const;

const DeviceInfo: React.FC<DeviceInfoProps> = ({ deviceId }) => {
  const { theme } = useTheme();
  const { GetDeviceforId } = useObject();
  const { getLatestMeasurement } = Measurementobject();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMeasurementDate, setLastMeasurementDate] = useState('Carregando...');
  const [deviceName, setDeviceName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading) {
          setIsLoading(true);
      }
      try {
        const [objectData, latestMeasurement] = await Promise.all([
          GetDeviceforId(deviceId),
          getLatestMeasurement(deviceId),
        ]);

        if (objectData) {
          setIsConnected(objectData.connected || false);
          setDeviceName(objectData.tittle || 'Dispositivo');
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

  const getStatusGradient = (): readonly [ColorValue, ColorValue] => {
    return isConnected
      ? ['#43A047', '#2E7D32'] as const
      : ['#E53935', '#C62828'] as const;
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
    },
    statusCard: {
      marginTop: 15,
      borderRadius: 16,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    statusGradient: {
      padding: 18,
    },
    statusContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusIcon: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    statusTextContainer: {
      flexDirection: 'column',
    },
    statusTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Inter-Bold',
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    statusSubtitle: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.9)',
      fontFamily: 'Inter-Regular',
      marginTop: 2,
    },
    lastMeasurementCard: {
      backgroundColor: theme.gradientEnd,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.secondary + '30',
      marginBottom:25
    },
    timeIconContainer: {
      backgroundColor: theme.secondary + '20',
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    lastMeasurementTextContainer: {
      flex: 1,
    },
    lastMeasurementLabel: {
      color: theme.textSecondary,
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      marginBottom: 2,
    },
    lastMeasurementText: {
      color: theme.textPrimary,
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
    },
    loadingContainer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    legendCard: {
        backgroundColor: theme.gradientEnd,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: theme.secondary + '30',
    },
    legendTitle: {
        color: theme.textPrimary,
        fontSize: 15,
        fontFamily: 'Inter-Bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    legendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginBottom: 8,
    },
    legendSwatch: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    legendLabel: {
        color: theme.textSecondary,
        fontSize: 13,
        fontFamily: 'Inter-Regular',
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
    <View style={styles.container}>
      <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>Legenda de Cores</Text>
            <View style={styles.legendGrid}>
                {colorLegend.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <LinearGradient
                            colors={item.colors}
                            style={styles.legendSwatch}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                        <Text style={styles.legendLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
        <View style={styles.statusCard}>
            <LinearGradient
              colors={getStatusGradient()}
              style={styles.statusGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.statusContent}>
                <View style={styles.statusIcon}>
                  {isConnected ? (
                    <Ionicons 
                      name="wifi" 
                      size={22} 
                      color="#FFFFFF" 
                    />
                  ) : (
                    <Feather 
                      name="wifi-off" 
                      size={22} 
                      color="#FFFFFF" 
                    />
                  )}
                </View>
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>
                    {isConnected ? 'DISPOSITIVO CONECTADO' : 'DISPOSITIVO DESCONECTADO'}
                  </Text>
                  <Text style={styles.statusSubtitle}>
                    {isConnected 
                      ? 'O dispositivo está online e enviando dados' 
                      : 'O dispositivo está offline ou sem comunicação'
                    }
                  </Text>
                </View>
              </View>
            </LinearGradient>
        </View>

        <View style={styles.lastMeasurementCard}>
            <View style={styles.timeIconContainer}>
              <Ionicons name="time-outline" size={22} color={theme.iconColor} />
            </View>
            <View style={styles.lastMeasurementTextContainer}>
              <Text style={styles.lastMeasurementLabel}>
                ÚLTIMA ATUALIZAÇÃO
              </Text>
              <Text style={styles.lastMeasurementText}>
                {lastMeasurementDate}
              </Text>
            </View>
        </View>
    </View>
  );
};

export default DeviceInfo;
