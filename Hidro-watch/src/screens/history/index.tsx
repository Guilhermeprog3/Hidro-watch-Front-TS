import React, { useEffect, useState } from 'react';
import { StyleSheet,Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useObject } from '../../hooks/Objectcontext';
import { useTheme } from '../../context/themecontext';
import HeaderUtil from '../../components/headerUtil';
import ListHistorico from '../../components/Listhistory';
import NavBar from '../../components/Navbar';

const HistoryPage = () => {
  const { getUserObjects } = useObject();
  const [devices, setDevices] = useState<any[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchDevices() {
      const response = await getUserObjects();
      if (response) {
        setDevices(response);
      }
    }

    fetchDevices();
  }, []);

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
      <HeaderUtil />
      <ListHistorico devices={devices} />
      <NavBar />
    </LinearGradient>
  );
};

export default HistoryPage;