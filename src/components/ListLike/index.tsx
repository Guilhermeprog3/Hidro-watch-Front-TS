import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';
import { useObject } from '../../hooks/Objectcontext';
import { Measurementobject } from '../../hooks/measurements';

type Device = {
  id: string;
  title: string;
  location: string;
  favorite: boolean;
  averageMeasurement: number;
  connected: boolean;
};

const ListLike: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();
  const { getUserDevice, markFavorite } = useObject();
  const { getLatestMeasurement } = Measurementobject();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      const userDevices = await getUserDevice();
      if (userDevices) {
        const favoriteDevices = userDevices.filter((device: any) => device.favorite);

        const devicesWithMeasurements = await Promise.all(
          favoriteDevices.map(async (device: any) => {
            const latestMeasurement = await getLatestMeasurement(device.id);
            return {
              ...device,
              averageMeasurement: latestMeasurement?.averageMeasurement || 0,
              connected: device.connected || false,
            };
          })
        );
        setDevices(devicesWithMeasurements);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [getUserDevice, getLatestMeasurement]);

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [fetchDevices])
  );

  const toggleFavorite = async (deviceId: string) => {
    setDevices(prevDevices => prevDevices.filter(d => d.id !== deviceId));
    
    try {
      await markFavorite(deviceId);
    } catch (error) {
      fetchDevices();
    }
  };
  
  const handleDevicePress = (deviceId: string) => {
    navigation.navigate('Measurement', { deviceId });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      marginTop: 140,
      paddingHorizontal: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 140,
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
    favoriteButton: {
      padding: 5,
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
              <Text style={styles.deviceName} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.deviceLocation} numberOfLines={1}>{item.location}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Ionicons
              name="heart"
              size={26}
              color={theme.red}
            />
          </TouchableOpacity>
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
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Dispositivos Favoritos</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDevice}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
                <Ionicons name="heart-dislike-outline" size={50} color={theme.textSecondary} />
                <Text style={styles.emptyListText}>Você ainda não tem favoritos.</Text>
            </View>
        )}
      />
    </View>
  );
};

export default ListLike;