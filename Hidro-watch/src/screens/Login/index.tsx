import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/Auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Secondary_theme, Primary_theme, Tertiary_theme } from '../../colors/color';

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);

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

  const handlePasswordChange = (password: string) => {
    setPassword(password);
  };

  const handleLogin = () => {
    if (email && password) {
      login(email, password);
    } else {
      setErrorMessage('Por favor, preencha todos os campos.');
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 0,
    },
    logo: {
      width: 50,
      height: 50,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginLeft: 10,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textPrimary,
      marginBottom: 20,
      marginLeft: 30,
    },
    heading: {
      fontSize: 24,
      color: colors.textPrimary,
      marginBottom: 20,
    },
    errorText: {
      color: colors.red,
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      borderColor: colors.textPrimary,
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
      color: colors.textPrimary,
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
      color: colors.buttonText,
      fontWeight: 'bold',
    },
    orText: {
      color: colors.textPrimary,
      marginVertical: 10,
    },
    socialButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48%',
      height: 40,
      borderRadius: 5,
    },
    googleButton: {
      backgroundColor: '#DB4437',
    },
    microsoftButton: {
      backgroundColor: '#0078D4',
    },
    socialButtonText: {
      color: colors.buttonText,
      marginLeft: 10,
      fontWeight: 'bold',
    },
    link: {
      color: colors.textPrimary,
      marginTop: 20,
    },
    forgotPasswordText: {
      color: colors.textPrimary,
      marginTop: 10,
      textDecorationLine: 'underline',
    },
  });

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logo_hidro.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>HYDROWATCH</Text>
        </View>
        <Text style={styles.subtitle}>Porque cada gota importa</Text>
        <Text style={styles.heading}>Entrar</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color={colors.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={colors.iconColor}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color={colors.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.iconColor}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color={colors.iconColor}
              style={styles.showPasswordIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Recoverpass')}>
          <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
        </TouchableOpacity>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <LinearGradient colors={[colors.secondary, colors.secondary]} style={styles.button}>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </LinearGradient>
        <Text style={styles.orText}>Ou Entre com</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
            <AntDesign name="google" size={24} color="white" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.microsoftButton]}>
            <FontAwesome name="windows" size={24} color="white" />
            <Text style={styles.socialButtonText}>Microsoft</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Não tem Conta? Crie uma Conta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;