import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Primary_theme, Secondary_theme, Tertiary_theme } from '../../colors/color';
import { UserContext } from '../../context/usercontext';
import { AuthContext } from '../../context/authcontext';

const Chargepage = () => {
   const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp<any>>();
  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);
  const [currentPassword, setCurrentPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

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

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleVerifyPassword = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado.');
      return;
    }


    if (currentPassword === user.password) {
      navigation.navigate('ChargePassword');
    } else {
      Alert.alert('Erro', 'Senha atual incorreta.');
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
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 16,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 32,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 24,
    },
    passwordInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 16,
    },
    passwordInput: {
      flex: 1,
      height: 50,
      paddingHorizontal: 16,
      color: colors.textPrimary,
    },
    eyeIcon: {
      padding: 10,
    },
    button: {
      backgroundColor: colors.buttonBackground,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    buttonText: {
      color: colors.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.gradientEnd,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: '80%',
    },
    modalText: {
      fontSize: 18,
      color: colors.textPrimary,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButton: {
      backgroundColor: colors.buttonBackground,
      padding: 10,
      borderRadius: 8,
      width: '50%',
      alignItems: 'center',
    },
    modalButtonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
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
      <View style={styles.content}>
        <Text style={styles.title}>Verificar Senha</Text>
        <Text style={styles.subtitle}>Digite sua Senha Atual</Text>
        <View style={styles.inputContainer}>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Sua Senha"
              placeholderTextColor={colors.textSecondary}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
            />
            <TouchableOpacity onPress={toggleShowCurrentPassword} style={styles.eyeIcon}>
              <Ionicons
                name={showCurrentPassword ? 'eye-off' : 'eye'}
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleVerifyPassword}>
          <Text style={styles.buttonText}>Verificar Senha</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Senha verificada com sucesso!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default Chargepage;