import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';
import * as Camera from 'expo-camera';

const HeaderHome = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();
  const [cameraPermission, requestPermission] = Camera.useCameraPermissions();

  const handleAddDevicePress = async () => {
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
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: 20,
      zIndex: 1,
    },
    addButton: {
      zIndex: 1,
      backgroundColor: theme.buttonBackground,
      padding: 15,
      borderRadius: 40,
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 90,
    },
    addButtonText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Search_home')}>
          <Ionicons name="search" size={24} color={theme.iconColor} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleAddDevicePress} style={styles.addButton}>
        <Text style={styles.addButtonText}>Adicionar um Novo Dispositivo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderHome;