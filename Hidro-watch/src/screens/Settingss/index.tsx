import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  

  const toggleMode = async (newMode: ThemeMode) => {
    toggleTheme(newMode);
    await AsyncStorage.setItem('userMode', newMode);
    setModalVisible(false);
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
      position: 'relative',
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
      <MenuOptionsConfig onThemePress={() => setModalVisible(true)}/>

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