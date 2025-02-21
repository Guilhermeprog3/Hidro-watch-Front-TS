import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../hooks/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Primary_theme, Secondary_theme, Tertiary_theme } from '../../colors/color';

type Device = {
  id: string;
  tittle: string;
  location: string;
  favorite: boolean;
};

const HomePage = () => {
  const { getUserObjects, markFavorite } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    const loadMode = async () => {
      const savedMode = await AsyncStorage.getItem('userMode');
      if (savedMode) {
        setMode(savedMode);
        updateColors(savedMode);
      }
    };
    loadMode();
  }, []);

  const updateColors = (mode: string) => {
    if (mode === 'Hidro') {
      setColors(Primary_theme);
    } else if (mode === 'Light') {
      setColors(Secondary_theme);
    } else {
      setColors(Tertiary_theme);
    }
  };

  useEffect(() => {
    async function fetchDevices() {
      const userDevices = await getUserObjects();
      if (userDevices) {
        setDevices(userDevices);
        setFavorites(userDevices.filter((device: Device) => device.favorite).map((device: Device) => device.id));
      }
    }
    fetchDevices();
  }, []);

  const toggleFavorite = async (deviceId: string) => {
    const updatedDevices = devices.map((device) => {
      if (device.id === deviceId) {
        device.favorite = !device.favorite;
      }
      return device;
    });
    setDevices(updatedDevices);

    if (favorites.includes(deviceId)) {
      setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== deviceId));
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, deviceId]);
    }

    try {
      await markFavorite(deviceId);
    } catch (error) {
      console.error('Erro ao marcar como favorito:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: 20,
      zIndex: 1,
    },
    decorativeImage: {
      position: 'absolute',
      width: '110%',
      height: 180,
      resizeMode: 'cover',
      marginBottom: 200,
      padding: 0,
      zIndex: 0,
    },
    addButton: {
      backgroundColor: colors.buttonBackground,
      padding: 15,
      borderRadius: 40,
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 90,
    },
    addButtonText: {
      color: colors.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'transparent',
      padding: 10,
      borderRadius: 10,
      marginBottom: 20,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    statText: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
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
      color: colors.textPrimary,
    },
    deviceLocation: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    favoriteButton: {
      marginRight: 10,
    },
    detailsButton: {
      backgroundColor: colors.buttonBackground,
      padding: 10,
      borderRadius: 5,
    },
    detailsButtonText: {
      color: colors.buttonText,
      fontSize: 14,
    },
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      backgroundColor: colors.navBarBackground,
      borderRadius: 0,
      position: 'absolute',
      bottom: 0,
      width: '110%',
      alignSelf: 'center',
    },
    navItem: {
      alignItems: 'center',
    },
  });

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Search_home')}>
          <Ionicons name="search" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      <Image source={require('../../../assets/images/decorativeImage.png')} style={styles.decorativeImage} />
      <TouchableOpacity onPress={() => navigation.navigate('Create')} style={styles.addButton}>
        <Text style={styles.addButtonText}>Adicionar um Novo Dispositivo</Text>
      </TouchableOpacity>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statText}>Acima da Média</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>14</Text>
          <Text style={styles.statText}>Dispositivos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statText}>Abaixo da Média</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Dispositivos Registrados</Text>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
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
                  color={favorites.includes(item.id) ? colors.red : colors.navBarIconColor}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Measurement')} style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>Detalhes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.navBar}>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color={colors.navBarIconColor} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Ionicons name="time" size={24} color={colors.navBarIconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Like')}>
          <Ionicons name="heart" size={24} color={colors.navBarIconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
          <Ionicons name="person" size={24} color={colors.navBarIconColor} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default HomePage;
