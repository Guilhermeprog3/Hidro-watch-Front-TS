import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';
import { useObject } from '../../hooks/Objectcontext';
import { Measurementobject } from '../../hooks/measurements';

type Device = {
  id: string;
  tittle: string;
  location: string;
  favorite: boolean;
  averageMeasurement?: number;
};

const ListHistorico = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();
  const { getUserObjects, markFavorite } = useObject();
  const { getLatestMeasurement } = Measurementobject();
  const [devices, setDevices] = useState<Device[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchDevices = useCallback(async () => {
    try {
      const userDevices = await getUserObjects();
      if (userDevices) {
        const devicesWithMeasurements = await Promise.all(
          userDevices.map(async (device: Device) => {
            const latestMeasurement = await getLatestMeasurement(device.id);
          })
        );
        setDevices(devicesWithMeasurements);
        setFavorites(devicesWithMeasurements.filter(d => d.favorite).map(d => d.id));
      }
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error);
    }
  }, [getUserObjects, getLatestMeasurement]);

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [fetchDevices])
  );

  const toggleFavorite = async (deviceId: string) => {
    const updatedFavorites = favorites.includes(deviceId)
      ? favorites.filter(id => id !== deviceId)
      : [...favorites, deviceId];
    
    setFavorites(updatedFavorites);
    
    try {
      await markFavorite(deviceId);
    } catch (error) {
      console.error('Erro ao marcar como favorito:', error);
      setFavorites(favorites);
    }
  };

  const styles = StyleSheet.create({
    contentContainer: {
      flex: 1,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 20,
    },
    deviceContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deviceName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    deviceLocation: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    favoriteButton: {
      marginRight: 10,
    },
    detailsButton: {
      backgroundColor: theme.buttonBackground,
      padding: 10,
      borderRadius: 5,
    },
    detailsButtonText: {
      color: theme.buttonText,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Dispositivos Registrados</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.deviceContainer}>
            <View>
              <Text style={styles.deviceName}>{item.tittle}</Text>
              <Text style={styles.deviceLocation}>{item.location}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(item.id)}
              >
                <Ionicons
                  name={favorites.includes(item.id) ? "heart" : "heart-outline"}
                  size={24}
                  color={favorites.includes(item.id) ? theme.red : theme.iconColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Week', { objectId: item.id })}
                style={styles.detailsButton}
              >
                <Text style={styles.detailsButtonText}>Histórico</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ListHistorico;