import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useObject } from '../../hooks/Objectcontext';
import { Measurementobject } from '../../hooks/measurements';
import * as Camera from 'expo-camera';
import { useTheme } from '../../context/themecontext';
import HeaderHome from '../../components/headerhome';
import StatsHome from '../../components/StatsHome';
import DeviceListHome from '../../components/ListHome';
import NavBar from '../../components/Navbar';

type Device = {
  id: string;
  tittle: string;
  location: string;
  favorite: boolean;
  averageMeasurement?: number;
};

const HomePage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const { getUserObjects, markFavorite } = useObject();
  const { getLatestMeasurement } = Measurementobject();
  const [aboveAverage, setAboveAverage] = useState<number>(0);
  const [belowAverage, setBelowAverage] = useState<number>(0);
  const [cameraPermission, requestPermission] = Camera.useCameraPermissions();

  const fetchDevices = async () => {
    const userDevices = await getUserObjects();
    if (userDevices) {
      const devicesWithAverage = await Promise.all(
        userDevices.map(async (device: Device) => {
          const latestMeasurement = await getLatestMeasurement(device.id);
          const averageMeasurement = latestMeasurement?.averageMeasurement || 0;
          return { ...device, averageMeasurement };
        })
      );

      setDevices(devicesWithAverage);

      const aboveAverageCount = devicesWithAverage.filter(
        (device) => device.averageMeasurement! > 10
      ).length;
      const belowAverageCount = devicesWithAverage.filter(
        (device) => device.averageMeasurement! <= 10
      ).length;

      setAboveAverage(aboveAverageCount);
      setBelowAverage(belowAverageCount);

      setFavorites(
        devicesWithAverage
          .filter((device: Device) => device.favorite)
          .map((device: Device) => device.id)
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [])
  );

  const requestCameraPermission = async () => {
    if (cameraPermission?.granted) {
      navigation.navigate('QRCode');
      return;
    }

    const { granted, canAskAgain } = await requestPermission();

    if (granted) {
      navigation.navigate('QRCode');
    } else if (!canAskAgain) {
      Alert.alert(
        'Permissão de Câmera Negada',
        'Você negou a permissão de câmera permanentemente. Para usar esta funcionalidade, habilite a permissão manualmente nas configurações do dispositivo.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Abrir Configurações',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  };

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
    decorativeImage: {
      position: 'absolute',
      width: '115%',
      height: 180,
      resizeMode: 'cover',
      marginBottom: 200,
      padding: 0,
      zIndex: 0,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <HeaderHome onPressAddButton={requestCameraPermission} />
      <Image source={require('../../../assets/images/decorativeImage.png')} style={styles.decorativeImage} />
      <StatsHome aboveAverage={aboveAverage} belowAverage={belowAverage} devicesCount={devices.length} />
      <Text style={styles.sectionTitle}>Dispositivos Registrados</Text>
      <DeviceListHome
        devices={devices}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        navigation={navigation}
      />
      <NavBar />
    </LinearGradient>
  );
};

export default HomePage;