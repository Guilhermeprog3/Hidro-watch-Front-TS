import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import { useTheme } from '../../context/themecontext';
import HeaderBack from '../../components/headerBack';
import MenuOptionsConfig from '../../components/menuoptionsconfig';
import { Ionicons } from '@expo/vector-icons';

type ThemeMode = 'Hidro' | 'Light' | 'Dark';

const SettingsPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme, toggleTheme } = useTheme();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [photosEnabled, setPhotosEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadMode = async () => {
      const savedMode = await AsyncStorage.getItem('userMode');
      if (savedMode) {
        toggleTheme(savedMode as ThemeMode);
      }
    };
    loadMode();
  }, []);

  useEffect(() => {
    const checkPermissions = async () => {
      const cameraStatus = await Permissions.getAsync(Permissions.CAMERA);
      setCameraEnabled(cameraStatus.status === 'granted');

      const mediaStatus = await MediaLibrary.getPermissionsAsync();
      setPhotosEnabled(mediaStatus.status === 'granted');

      const notificationStatus = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(notificationStatus.status === 'granted');
    };

    checkPermissions();
  }, []);

  const toggleMode = async (newMode: ThemeMode) => {
    toggleTheme(newMode);
    await AsyncStorage.setItem('userMode', newMode);
    setModalVisible(false);
  };

  const requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === 'granted') {
      setCameraEnabled(true);
    } else {
      setCameraEnabled(false);
      Alert.alert('Permissão negada', 'Você precisa conceder permissão de câmera para usar este recurso.');
    }
  };

  const requestPhotosPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      setPhotosEnabled(true);
    } else {
      setPhotosEnabled(false);
      Alert.alert('Permissão negada', 'Você precisa conceder permissão de acesso à galeria para usar este recurso.');
    }
  };

  const requestNotificationsPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      setNotificationsEnabled(true);
    } else {
      setNotificationsEnabled(false);
      Alert.alert('Permissão negada', 'Você precisa conceder permissão de notificações para usar este recurso.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: theme.primaryLight,
      borderRadius: 15,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      position: 'relative', // Para posicionar o ícone de fechar
    },
    modalHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.textSecondary,
    },
    modalOptionText: {
      fontSize: 18,
      color: theme.textPrimary,
      marginLeft: 15,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 10,
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <HeaderBack onBackPress={() => navigation.goBack()} />
      <MenuOptionsConfig
        onThemePress={() => setModalVisible(true)}
        onNotificationsToggle={requestNotificationsPermission}
        onCameraToggle={requestCameraPermission}
        onPhotosToggle={requestPhotosPermission}
        notificationsEnabled={notificationsEnabled}
        cameraEnabled={cameraEnabled}
        photosEnabled={photosEnabled}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão: 1.0</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Ícone de fechar */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={theme.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.modalHeader}>Selecione o Tema</Text>
            <TouchableOpacity style={styles.modalOption} onPress={() => toggleMode('Hidro')}>
              <Ionicons name="water" size={24} color={theme.iconColor} />
              <Text style={styles.modalOptionText}>Hidro Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => toggleMode('Light')}>
              <Ionicons name="sunny" size={24} color={theme.iconColor} />
              <Text style={styles.modalOptionText}>Light Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => toggleMode('Dark')}>
              <Ionicons name="moon" size={24} color={theme.iconColor} />
              <Text style={styles.modalOptionText}>Dark Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default SettingsPage;