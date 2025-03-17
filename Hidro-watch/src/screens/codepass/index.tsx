import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Primary_theme, Secondary_theme, Tertiary_theme } from '../../colors/color';
import { UserContext } from '../../context/usercontext';

const CodePage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const { validateResetCode } = useContext(UserContext);

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

  const handleDigitChange = (index: number, value: string) => {
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleVerifyCode = async () => {
    const code = digits.join('');
    if (code.length === 6) {
      try {
        const isValid = await validateResetCode(code);
        if (isValid) {
          navigation.navigate('Newpassword', { code });
        } else {
          setErrorMessage('Código inválido ou expirado.');
        }
      } catch (error) {
        setErrorMessage('Código inválido ou expirado.');
      }
    } else {
      setErrorMessage('Por favor, digite um código válido de 6 dígitos.');
    }
  };

  const handleResendEmail = () => {
    setErrorMessage('Um novo código de verificação foi enviado para o seu email.');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
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
    emailText: {
      fontSize: 16,
      color: colors.textPrimary,
      marginBottom: 32,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    digitInput: {
      width: 50,
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 18,
      color: colors.textPrimary,
      borderColor: colors.textSecondary,
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
    resendText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 16,
      textAlign: 'center',
    },
    resendLink: {
      color: colors.buttonBackground,
      fontWeight: 'bold',
    },
    errorText: {
      fontSize: 14,
      color: 'red',
      marginBottom: 16,
      textAlign: 'center',
    },
  });

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
            <Text style={styles.headerTitle}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Olhe o seu email</Text>
          <Text style={styles.subtitle}>Enviamos um código de confirmação</Text>
          <Text style={styles.subtitle}>Digite o código de 6 dígitos enviado para o email</Text>
          <View style={styles.inputContainer}>
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.digitInput}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                value={digit}
                onChangeText={(value) => handleDigitChange(index, value)}
                keyboardType="number-pad"
                maxLength={1}
                autoCapitalize="none"
                ref={(ref) => (inputRefs.current[index] = ref)}
              />
            ))}
          </View>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Verificar Código</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default CodePage;