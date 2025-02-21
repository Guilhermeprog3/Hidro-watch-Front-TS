import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Secondary_theme, Primary_theme, Tertiary_theme } from '../../colors/color';

const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { Postuser, login } = useContext(AuthContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
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

  const handleSignUp = async () => {
    if (name && email && password && confirmPassword) {
      if (password === confirmPassword) {
        await Postuser(name, email, password);
        await login(email, password);
      } else {
        setErrorMessage('As senhas não coincidem.');
      }
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
      paddingHorizontal: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      shadowColor: colors.secondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
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
        <Text style={styles.heading}>Criar Conta</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color={colors.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={colors.textPrimary}
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
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color={colors.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={colors.iconColor}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color={colors.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor={colors.textPrimary}
            value={name}
            onChangeText={setName}
          />
        </View>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <LinearGradient colors={[colors.secondary, colors.secondary]} style={styles.button}>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.buttonText}>Criar Conta</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem Conta? Entre com Sua Conta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SignUpScreen;
