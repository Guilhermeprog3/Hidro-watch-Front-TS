import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { UserContext } from '../../context/usercontext';
import { AuthContext } from '../../context/authcontext';
import { useTheme } from '../../context/themecontext';
import HeaderBack from '../../components/headerBack';

type RootStackParamList = {
  Login: undefined;
  Newpassword: { code: string };
  User: undefined;
};

type NewPasswordRouteProp = RouteProp<RootStackParamList, 'Newpassword'>;

const NewPassword = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'Newpassword'>>();
  const route = useRoute<NewPasswordRouteProp>();
  const { user, logout } = useContext(AuthContext);
  const { theme } = useTheme();
  const [password, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { resetPassword } = useContext(UserContext);
  const { code } = route.params;

  const validateFields = () => {
    if (!password || !confirmPassword) {
      setErrorMessage('A senha não pode estar vazia.');
      return false;
    } else if (password.length < 8) {
      setErrorMessage('A senha deve ter no mínimo 8 caracteres.');
      return false;
    } 
     else if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateFields()) {
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(code, password);
      setIsModalVisible(true);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    const token = user?.token;
    navigation.navigate(token ? 'User' : 'Login');
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 16,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
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
      marginBottom: 8,
      borderColor: errorMessage ? theme.red : theme.textSecondary,
    },
    passwordInput: {
      flex: 1,
      height: 50,
      paddingHorizontal: 16,
      color: theme.textPrimary,
    },
    confirmPasswordInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 8,
      borderColor: errorMessage ? theme.red : theme.textSecondary,
    },
    eyeIcon: {
      padding: 10,
    },
    button: {
      backgroundColor: theme.buttonBackground,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: isLoading ? 8 : 0,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme.gradientEnd,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: '80%',
    },
    modalText: {
      fontSize: 18,
      color: theme.textPrimary,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButton: {
      backgroundColor: theme.buttonBackground,
      padding: 10,
      borderRadius: 8,
      width: '50%',
      alignItems: 'center',
    },
    modalButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      color: theme.red,
      fontSize: 14,
      marginBottom: 16,
      textAlign: 'center',
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <HeaderBack onBackPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>Redefinir Senha</Text>
        <Text style={styles.subtitle}>Digite sua nova senha</Text>
        
        <View style={styles.inputContainer}>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nova Senha"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={toggleShowNewPassword} style={styles.eyeIcon}>
              <Ionicons
                name={showNewPassword ? 'eye-off' : 'eye'}
                size={24}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.confirmPasswordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar Nova Senha"
              placeholderTextColor={theme.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={toggleShowConfirmPassword} style={styles.eyeIcon}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={24}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
          
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator color={theme.buttonText} />}
          <Text style={styles.buttonText}>
            {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Senha redefinida com sucesso!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default NewPassword;