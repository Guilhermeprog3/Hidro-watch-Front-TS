import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';
import { useCountdown } from 'usehooks-ts';
import HeaderBack from '../../components/headerBack';

interface CodePageRouteParams {
  email: string;
}

const CodePage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<{ CodePage: CodePageRouteParams }, 'CodePage'>>(); 
  const { email } = route.params;
  const { theme } = useTheme();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { validateResetCode, forgotPassword } = useContext(UserContext);

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  });

  const [isSendingCode, setIsSendingCode] = useState(false);

  useEffect(() => {
    startCountdown();
  }, []);

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

    setErrorMessage('');
  };

  const handleVerifyCode = async () => {
    const code = digits.join('');
    if (code.length !== 6) {
      setErrorMessage('Por favor, digite um código válido de 6 dígitos.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const isValid = await validateResetCode(code);
      if (isValid) {
        navigation.navigate('Newpassword', { code });
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email || count > 0 || isSendingCode) return;

    setIsSendingCode(true);

    try {
      await forgotPassword(email);
      
      resetCountdown();
      startCountdown();
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSendingCode(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    emailText: {
      fontSize: 16,
      color: theme.textPrimary,
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
      color: theme.textPrimary,
      borderColor: theme.textSecondary,
    },
    digitInputError: {
      borderColor: theme.red,
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
    resendText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginTop: 16,
      textAlign: 'center',
    },
    resendLink: {
      color: theme.buttonBackground,
      fontWeight: 'bold',
    },
    errorText: {
      fontSize: 14,
      color: theme.red,
      marginBottom: 16,
      textAlign: 'center',
    },
    disabledResend: {
      opacity: 0.5,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <HeaderBack onBackPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>Olhe o seu email</Text>
        <Text style={styles.subtitle}>Enviamos um código de confirmação</Text>
        <Text style={styles.emailText}>{email}</Text>

        <View style={styles.inputContainer}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              style={[styles.digitInput, errorMessage && !isSendingCode ? styles.digitInputError : null]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handleDigitChange(index, value)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </View>

        {errorMessage && !isSendingCode ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleVerifyCode} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="white" /> : null}
          <Text style={styles.buttonText}>Verificar Código</Text>
        </TouchableOpacity>

        {count > 0 && (
          <Text style={styles.resendText}>
            Reenviar código em{' '}
            <Text style={styles.resendLink}>{count}s</Text>
          </Text>
        )}

        <TouchableOpacity
          onPress={handleResendEmail}
          disabled={count > 0 || isSendingCode}
          style={count > 0 || isSendingCode ? styles.disabledResend : undefined}
        >
          <Text style={[styles.resendText, styles.resendLink]}>
            {isSendingCode ? <ActivityIndicator color={theme.buttonText} /> : 'Reenviar Código'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default CodePage;
