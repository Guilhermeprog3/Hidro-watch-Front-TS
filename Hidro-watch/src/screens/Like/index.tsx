import React, { useState, useEffect } from 'react';
import { StyleSheet,Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useObject } from '../../hooks/Objectcontext';
import { useTheme } from '../../context/themecontext';
import HeaderLike from '../../components/headerLike';
import ListLike from '../../components/ListLike';
import NavBar from '../../components/Navbar';

const FavoritePage = () => {
  const { getUserObjects, markFavorite } = useObject();
  const [devices, setDevices] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { theme } = useTheme();

  const fetchDevices = async () => {
    const userDevices = await getUserObjects();
    if (userDevices) {
      const favoriteDevices = userDevices.filter((device: any) => device.favorite);
      setDevices(favoriteDevices);
      setFavorites(favoriteDevices.map((device: any) => device.id));
    }
  };

  useEffect(() => {
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
      fetchDevices();
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
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
       <Image source={require('../../../assets/images/decorativeImage.png')} style={styles.decorativeImage} />
      <HeaderLike />
      <ListLike devices={devices} favorites={favorites} toggleFavorite={toggleFavorite} />
      <NavBar />
    </LinearGradient>
  );
};

export default FavoritePage;