import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import { Primary_theme, Secondary_theme, Tertiary_theme } from '../../colors/color';

const SettingsPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [photosEnabled, setPhotosEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const toggleMode = async (newMode: string) => {
    setMode(newMode);
    updateColors(newMode);
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 20,
      paddingHorizontal: 16,
    },
    headerTitle: {
      color: colors.iconColor,
      fontSize: 18,
      marginLeft: 10,
    },
    menuContainer: {
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      paddingHorizontal: 16,
    },
    menuItemText: {
      fontSize: 18,
      color: colors.textPrimary,
      marginLeft: 10,
      flex: 1,
    },
    separator: {
      height: 1,
      marginVertical: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: colors.gradientEnd,
      borderRadius: 15,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.textSecondary,
    },
    modalOptionText: {
      fontSize: 18,
      color: colors.textPrimary,
      marginLeft: 15,
    },
    modalHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 20,
      textAlign: 'center',
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
      color: colors.textSecondary,
    },
  });

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
      <Text style={styles.headerTitle}>VOLTAR</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => setModalVisible(true)}>
          <Text style={styles.menuItemText}>
            Tema
          </Text>
          <Ionicons name="chevron-forward-outline" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Permissões</Text>
        <View style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Notificações</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={requestNotificationsPermission}
            trackColor={{ false: "#767577", true: colors.iconColor }}
            thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="camera-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Câmera</Text>
          <Switch
            value={cameraEnabled}
            onValueChange={requestCameraPermission}
            trackColor={{ false: "#767577", true: colors.iconColor }}
            thumbColor={cameraEnabled ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="image-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Fotos e Vídeos</Text>
          <Switch
            value={photosEnabled}
            onValueChange={requestPhotosPermission}
            trackColor={{ false: "#767577", true: colors.iconColor }}
            thumbColor={photosEnabled ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Sobre</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="document-text-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Termo de Uso</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="shield-checkmark-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Política de Privacidade</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={colors.iconColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão: 1.0</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Selecione o Tema</Text>
            <TouchableOpacity style={styles.modalOption} onPress={() => toggleMode('Hidro')}>
              <Ionicons name="water" size={24} color={colors.iconColor} />
              <Text style={styles.modalOptionText}>Hidro Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => toggleMode('Light')}>
              <Ionicons name="sunny" size={24} color={colors.iconColor} />
              <Text style={styles.modalOptionText}>Light Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => toggleMode('Dark')}>
              <Ionicons name="moon" size={24} color={colors.iconColor} />
              <Text style={styles.modalOptionText}>Dark Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default SettingsPage;