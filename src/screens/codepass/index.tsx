import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';
import { useCountdown } from 'usehooks-ts';
import HeaderBack from '../../components/headerBack';
import { Ionicons } from '@expo/vector-icons';

interface CodePageRouteParams {
  email: string;
}

const { width } = Dimensions.get('window');
const INPUT_WIDTH = (width - 80) / 6;

const CodePage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<{ CodePage: CodePageRouteParams }, 'CodePage'>>();
  const { email } = route.params;
  const { theme } = useTheme();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const { validateResetCode, forgotPassword } = useContext(UserContext);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  });

  const [isSendingCode, setIsSendingCode] = useState(false);

  useEffect(() => {
    startCountdown();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

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

  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const handleVerifyCode = async () => {
    const code = digits.join('');
    if (code.length !== 6) {
      setErrorMessage('Por favor, digite um código válido de 6 dígitos.');
      shakeError();
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
      shakeError();
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
      
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      
    } catch (error: any) {
      setErrorMessage(error.message);
      shakeError();
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
      paddingBottom: keyboardVisible ? 20 : 0,
    },
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    iconContainer: {
      marginBottom: 30,
      alignItems: 'center',
    },
    icon: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: 16,
      borderRadius: 50,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 16,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 12,
      textAlign: 'center',
      lineHeight: 22,
    },
    emailContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 8,
      padding: 12,
      marginBottom: 32,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emailText: {
      fontSize: 16,
      color: theme.textPrimary,
      textAlign: 'center',
      fontWeight: '600',
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    digitInput: {
      width: INPUT_WIDTH,
      height: INPUT_WIDTH,
      borderWidth: 1.5,
      borderRadius: 12,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    digitInputFilled: {
      borderColor: theme.buttonBackground,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    digitInputError: {
      borderColor: theme.red,
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
    button: {
      backgroundColor: theme.buttonBackground,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: isLoading ? 12 : 0,
    },
    resendContainer: {
      marginTop: 24,
      alignItems: 'center',
    },
    resendText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 8,
      textAlign: 'center',
    },
    countdownContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    countdownText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.buttonBackground,
    },
    resendButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    resendButtonText: {
      color: theme.buttonBackground,
      fontWeight: 'bold',
      fontSize: 16,
      marginLeft: isSendingCode ? 8 : 0,
    },
    disabledResend: {
      opacity: 0.5,
    },
    errorContainer: {
      marginBottom: 20,
      padding: 12,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      borderLeftWidth: 4,
      borderLeftColor: theme.red,
      flexDirection: 'row',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 14,
      color: theme.red,
      flex: 1,
      marginLeft: 8,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.headerContainer}>
        <HeaderBack onBackPress={() => navigation.goBack()} />
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View 
          style={[
            styles.content, 
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.iconContainer}>
            <View style={styles.icon}>
              <Ionicons name="mail" size={40} color={theme.textPrimary} />
            </View>
          </View>
          
          <Text style={styles.title}>Verificação de Email</Text>
          <Text style={styles.subtitle}>
            Enviamos um código de 6 dígitos para o seu email. 
            Digite-o abaixo para continuar.
          </Text>
          
          <View style={styles.emailContainer}>
            <Ionicons name="at" size={18} color={theme.textPrimary} style={{ marginRight: 8 }} />
            <Text style={styles.emailText}>{email}</Text>
          </View>

          <Animated.View 
            style={[
              styles.inputContainer,
              { transform: [{ translateX: shakeAnim }] }
            ]}
          >
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                style={[
                  styles.digitInput, 
                  digit ? styles.digitInputFilled : null,
                  errorMessage ? styles.digitInputError : null
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(value) => handleDigitChange(index, value)}
                onKeyPress={(e) => handleKeyPress(index, e)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                selectionColor={theme.buttonBackground}
              />
            ))}
          </Animated.View>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={theme.red} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleVerifyCode} 
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? <ActivityIndicator color="white" size="small" /> : null}
            <Text style={styles.buttonText}>Verificar Código</Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Não recebeu o código?
            </Text>
            
            {count > 0 ? (
              <View style={styles.countdownContainer}>
                <Ionicons name="time-outline" size={20} color={theme.buttonBackground} style={{ marginRight: 8 }} />
                <Text style={styles.countdownText}>{count}s</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.resendButton,
                  isSendingCode ? styles.disabledResend : null
                ]}
                onPress={handleResendEmail}
                disabled={isSendingCode}
                activeOpacity={0.7}
              >
                {isSendingCode ? (
                  <ActivityIndicator size="small" color={theme.buttonBackground} />
                ) : (
                  <Ionicons name="refresh" size={18} color={theme.buttonBackground} />
                )}
                <Text style={styles.resendButtonText}>
                  {isSendingCode ? 'Enviando...' : 'Reenviar Código'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default CodePage;