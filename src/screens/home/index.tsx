import React from 'react';
import { View, Text, StyleSheet, Image, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';
import HeaderHome from '../../components/headerhome';
import StatsHome from '../../components/StatsHome';
import DeviceListHome from '../../components/ListHome';
import NavBar from '../../components/Navbar';
import * as Camera from 'expo-camera';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const [cameraPermission, requestPermission] = Camera.useCameraPermissions();

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
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Configurações', onPress: () => Linking.openSettings() }
        ]
      );
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
      <DeviceListHome 
        navigation={navigation}
      />
      <NavBar />
    </LinearGradient>
  );
};

export default HomePage;