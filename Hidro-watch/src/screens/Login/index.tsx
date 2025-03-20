import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/Auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';
import HeaderLogin from '../../components/headerhidro';

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { theme } = useTheme();

  const validateEmail = (email: string) => {
    return email.includes('@');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, insira um email válido.');
      return;
    }

    try {
      await login(email, password);
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '80%',
      alignItems: 'center',
    },
    heading: {
      fontSize: 24,
      color: theme.textPrimary,
      marginBottom: 20,
    },
    errorText: {
      color: theme.red,
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      borderColor: theme.textPrimary,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 40,
      color: theme.textPrimary,
    },
    showPasswordIcon: {
      marginLeft: 10,
    },
    button: {
      width: '100%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginBottom: 20,
    },
    buttonText: {
      color: theme.buttonText,
      fontWeight: 'bold',
    },
    orText: {
      color: theme.textPrimary,
      marginVertical: 10,
    },
    socialButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 20,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '70%',
      height: 40,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    googleButton: {
      backgroundColor: '#DB4437',
    },
    socialButtonText: {
      color: 'white',
      marginLeft: 10,
      fontWeight: 'bold',
    },
    link: {
      color: theme.textPrimary,
      marginTop: 20,
    },
    forgotPasswordText: {
      color: theme.textPrimary,
      marginTop: 0,
      marginBottom: 20,
      textDecorationLine: 'underline',
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.content}>
        <HeaderLogin />
        <Text style={styles.heading}>Entrar</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color={theme.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.iconColor}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color={theme.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={theme.iconColor}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color={theme.iconColor}
              style={styles.showPasswordIcon}
            />
          </TouchableOpacity>
        </View>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <TouchableOpacity onPress={() => navigation.navigate('Recoverpass')}>
          <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
        </TouchableOpacity>
        <LinearGradient colors={[theme.secondary, theme.secondary]} style={styles.button}>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </LinearGradient>
        <Text style={styles.orText}>Ou entre com</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
            <AntDesign name="google" size={24} color="white" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Não tem conta? Crie uma conta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
export default LoginScreen;