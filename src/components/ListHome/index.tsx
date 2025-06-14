import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useObject } from '../../hooks/Objectcontext';
import { Measurementobject } from '../../hooks/measurements';
import StatsHome from '../StatsHome';

type Device = {
  id: string;
  tittle: string;
  location: string;
  favorite: boolean;
  averageMeasurement: number;
  connected: boolean;
};

const DeviceListHome = () => {
  const { theme } = useTheme();
  const { getUserObjects, markFavorite } = useObject();
  const { getLatestMeasurement } = Measurementobject();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [connectedCount, setConnectedCount] = useState<number>(0);
  const [disconnectedCount, setDisconnectedCount] = useState<number>(0);
  const navigation = useNavigation<NavigationProp<any>>();

  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      const userDevices = await getUserObjects();
      if (userDevices) {
        const devicesWithMeasurements = await Promise.all(
          userDevices.map(async (device: any) => {
            const latestMeasurement = await getLatestMeasurement(device.id);
            return {
              ...device,
              averageMeasurement: latestMeasurement?.averageMeasurement || 0,
              connected: device.connected || false
            };
          })
        );

        setDevices(devicesWithMeasurements);
        setFavorites(devicesWithMeasurements.filter(d => d.favorite).map(d => d.id));
        
        const connected = devicesWithMeasurements.filter(d => d.connected).length;
        const disconnected = devicesWithMeasurements.length - connected;
        setConnectedCount(connected);
        setDisconnectedCount(disconnected);
      }
    } catch (error) {
      console.error("Erro ao buscar dispositivos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [])
  );

  const toggleFavorite = async (deviceId: string) => {
    const originalFavorites = [...favorites];
    const updatedFavorites = favorites.includes(deviceId)
      ? favorites.filter(id => id !== deviceId)
      : [...favorites, deviceId];
    
    setFavorites(updatedFavorites);
    
    try {
      await markFavorite(deviceId);
    } catch (error) {
      console.error('Erro ao marcar como favorito:', error);
      setFavorites(originalFavorites);
    }
  };

  const handleDevicePress = (deviceId: string) => {
    navigation.navigate('Measurement', { deviceId });
  };

  const styles = StyleSheet.create({
    contentContainer: {
      flex: 1,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      paddingHorizontal: 5,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyListText: {
        color: theme.textSecondary,
        fontSize: 16,
        marginTop: 10,
    },
    deviceContainer: {
      backgroundColor: theme.primaryLight,
      borderRadius: 15,
      padding: 20,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    deviceInfoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusIndicator: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    textContainer: {
      flex: 1,
    },
    deviceName: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    deviceLocation: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 2,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    favoriteButton: {
      padding: 5,
    },
    detailsButton: {
      backgroundColor: theme.buttonBackground,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      marginLeft: 10,
    },
    detailsButtonText: {
      color: theme.buttonText,
      fontSize: 14,
      fontWeight: 'bold',
    },
  });

  const renderDevice = ({ item }: { item: Device }) => {
    const statusColor = item.connected ? theme.secondary : '#FFC107';

    return (
      <TouchableOpacity onPress={() => handleDevicePress(item.id)} activeOpacity={0.7}>
        <View style={styles.deviceContainer}>
          <View style={styles.deviceInfoContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
              <Ionicons name="water" size={22} color="white" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.deviceName} numberOfLines={1}>{item.tittle}</Text>
              <Text style={styles.deviceLocation} numberOfLines={1}>{item.location}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item.id)}
            >
              <Ionicons
                name={favorites.includes(item.id) ? "heart" : "heart-outline"}
                size={26}
                color={favorites.includes(item.id) ? theme.red : theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.buttonBackground} />
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <StatsHome 
        connectedCount={connectedCount} 
        disconnectedCount={disconnectedCount} 
        devicesCount={devices.length} 
      />
      
      <Text style={styles.sectionTitle}>Meus Dispositivos</Text>
      
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDevice}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
                <Ionicons name="sad-outline" size={50} color={theme.textSecondary} />
                <Text style={styles.emptyListText}>Nenhum dispositivo encontrado.</Text>
            </View>
        )}
      />
    </View>
  );
};

export default DeviceListHome;