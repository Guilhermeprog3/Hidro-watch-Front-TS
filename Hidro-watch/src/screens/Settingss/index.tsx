import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Primary_theme, Secondary_theme, Tertiary_theme } from '../../colors/color';

const SettingsPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [photosEnabled, setPhotosEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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

  const toggleMode = async () => {
    let newMode;
    if (mode === 'Hidro') {
      newMode = 'Light';
    } else if (mode === 'Light') {
      newMode = 'Dark';
    } else {
      newMode = 'Hidro';
    }
    setMode(newMode);
    updateColors(newMode);
    await AsyncStorage.setItem('userMode', newMode);
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
  });

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VOLTAR</Text>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Modo</Text>
        <TouchableOpacity style={styles.menuItem} onPress={toggleMode}>
          <Ionicons 
            name={
              mode === 'Hidro' ? 'sunny' :
              mode === 'Light' ? 'moon' :
              'water'
            }
            size={24}
            color={colors.iconColor} 
          />
          <Text style={styles.menuItemText}>
            {mode === 'Hidro' ? 'Light Mode' : mode === 'Light' ? 'Dark Mode' : 'Hidro Mode'}
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
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#767577", true: colors.iconColor }}
            thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="location-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Localização</Text>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: "#767577", true: colors.iconColor }}
            thumbColor={locationEnabled ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="camera-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Câmera</Text>
          <Switch
            value={cameraEnabled}
            onValueChange={setCameraEnabled}
            trackColor={{ false: "#767577", true: colors.iconColor }}
            thumbColor={cameraEnabled ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>
        <View style={styles.menuItem}>
          <Ionicons name="camera-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Fotos e Vídeos</Text>
          <Switch
            value={photosEnabled}
            onValueChange={setPhotosEnabled}
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
    </LinearGradient>
  );
};

export default SettingsPage;