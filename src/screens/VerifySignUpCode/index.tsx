import React, { useState, useContext, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Keyboard, 
  KeyboardAvoidingView, 
  Platform, 
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';
import { useCountdown } from 'usehooks-ts';
import HeaderBack from '../../components/headerBack';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';

// Schema de validação com Zod
const codeSchema = z.string().length(6, { message: "O código deve conter exatamente 6 dígitos." });

type VerifyCodeRouteProp = RouteProp<{ VerifySignUpCode: { email: string } }, 'VerifySignUpCode'>;

const { width } = Dimensions.get('window');
const INPUT_WIDTH = (width - 80) / 6;

const VerifySignUpCodeScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<VerifyCodeRouteProp>();
  const { email } = route.params;

  const { theme } = useTheme();
  const { confirmEmailVerification, initEmailVerification } = useContext(UserContext);
  
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startCountdown();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    setTimeout(() => inputRefs.current[0]?.focus(), 500);

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

  const handleVerify = async () => {
    Keyboard.dismiss();
    const code = digits.join('');
    
    try {
      codeSchema.parse(code);
      setErrorMessage('');
      setIsLoading(true);

      const isVerified = await confirmEmailVerification(email, code);
      if (isVerified) {
        navigation.navigate('CompleteSignUp', { email });
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors[0].message);
      } else {
        setErrorMessage(error.message);
      }
      shakeError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (count > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage('');
    try {
      await initEmailVerification(email);
      resetCountdown();
      startCountdown();
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error: any) {
      setErrorMessage(error.message);
      shakeError();
    } finally {
      setIsResending(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    innerContainer: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
    headerContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
    icon: { backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 16, borderRadius: 50, alignSelf: 'center', marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: theme.textPrimary, marginBottom: 16, textAlign: 'center' },
    subtitle: { fontSize: 16, color: theme.textSecondary, marginBottom: 32, textAlign: 'center', lineHeight: 22 },
    inputContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    digitInput: { 
      width: INPUT_WIDTH, 
      height: INPUT_WIDTH, 
      borderWidth: 1.5, 
      borderRadius: 12, 
      textAlign: 'center', 
      fontSize: 20, 
      fontWeight: 'bold', 
      color: theme.textPrimary, 
      borderColor: theme.buttonBackground, 
      backgroundColor: 'rgba(255, 255, 255, 0.1)' 
    },
    button: { 
      backgroundColor: theme.buttonBackground, 
      padding: 16, 
      borderRadius: 12, 
      alignItems: 'center', 
      flexDirection: 'row', 
      justifyContent: 'center' 
    },
    buttonText: { 
      color: theme.buttonText, 
      fontSize: 18, 
      fontWeight: 'bold', 
      marginLeft: isLoading ? 12 : 0 
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,0,0,0.1)',
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: theme.red,
    },
    errorText: { 
      color: theme.red, 
      fontSize: 14, 
      textAlign: 'center',
      marginLeft: 8,
      flex: 1,
    },
    resendContainer: { marginTop: 24, alignItems: 'center' },
    resendButton: { 
      paddingVertical: 10,
      paddingHorizontal: 20
    },
    resendButtonText: { color: theme.buttonBackground, fontWeight: 'bold', fontSize: 16, textDecorationLine: 'underline' },
    disabledResend: {
      opacity: 0.6,
    },
    countdownText: {
      color: theme.textSecondary,
      fontSize: 16,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.headerContainer}><HeaderBack onBackPress={() => navigation.goBack()} /></View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
          <View style={styles.icon}><Ionicons name="shield-checkmark-outline" size={40} color={theme.textPrimary} /></View>
          <Text style={styles.title}>Verifique seu E-mail</Text>
          <Text style={styles.subtitle}>Enviamos um código de 6 dígitos para {email}. Insira-o abaixo.</Text>

          <Animated.View style={[styles.inputContainer, { transform: [{ translateX: shakeAnim }] }]}>
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                style={[styles.digitInput, errorMessage ? {borderColor: theme.red} : null]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(value) => handleDigitChange(index, value)}
                onKeyPress={(e) => handleKeyPress(index, e)}
              />
            ))}
          </Animated.View>
          
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={20} color={theme.red} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={theme.buttonText} size="small" /> : null}
            <Text style={styles.buttonText}>Verificar Código</Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            {count > 0 ? (
              <Text style={styles.countdownText}>
                Reenviar código em {count}s
              </Text>
            ) : (
              <TouchableOpacity 
                style={[styles.resendButton, (isResending || count > 0) && styles.disabledResend]} 
                onPress={handleResend} 
                disabled={isResending || count > 0}
              >
                {isResending ? (
                  <ActivityIndicator color={theme.buttonBackground} size="small" />
                ) : (
                  <Text style={styles.resendButtonText}>Não recebeu? Reenviar código</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default VerifySignUpCodeScreen;
