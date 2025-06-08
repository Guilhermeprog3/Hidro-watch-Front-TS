import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';
import HeaderBack from '../../components/headerBack';
import { Ionicons } from '@expo/vector-icons';

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

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 500);
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (!value && index > 0) inputRefs.current[index - 1]?.focus();
    setErrorMessage('');
  };

  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length !== 6) {
      setErrorMessage('O código deve ter 6 dígitos.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const isVerified = await confirmEmailVerification(email, code);
      if (isVerified) {
        navigation.navigate('CompleteSignUp', { email });
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setErrorMessage('');
    try {
      await initEmailVerification(email);
    } catch (error: any) {
      setErrorMessage(error.message);
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
    digitInput: { width: INPUT_WIDTH, height: INPUT_WIDTH, borderWidth: 1.5, borderRadius: 12, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: theme.textPrimary, borderColor: theme.buttonBackground, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    button: { backgroundColor: theme.buttonBackground, padding: 16, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
    buttonText: { color: theme.buttonText, fontSize: 18, fontWeight: 'bold', marginLeft: isLoading ? 12 : 0 },
    errorText: { color: theme.red, fontSize: 14, textAlign: 'center', marginBottom: 20 },
    resendContainer: { marginTop: 24, alignItems: 'center' },
    resendButtonText: { color: theme.textPrimary, textDecorationLine: 'underline' },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.headerContainer}><HeaderBack onBackPress={() => navigation.goBack()} /></View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.innerContainer}>
          <View style={styles.icon}><Ionicons name="shield-checkmark-outline" size={40} color={theme.textPrimary} /></View>
          <Text style={styles.title}>Verifique seu E-mail</Text>
          <Text style={styles.subtitle}>Enviamos um código de 6 dígitos para {email}. Insira-o abaixo.</Text>

          <View style={styles.inputContainer}>
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                style={styles.digitInput}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(value) => handleDigitChange(index, value)}
                onKeyPress={(e) => handleKeyPress(index, e)}
              />
            ))}
          </View>
          
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={isLoading}>
            {isLoading && <ActivityIndicator color="white" size="small" />}
            <Text style={styles.buttonText}>Verificar Código</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendContainer} onPress={handleResend} disabled={isResending}>
            <Text style={styles.resendButtonText}>{isResending ? 'Reenviando...' : 'Não recebeu? Reenviar código'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default VerifySignUpCodeScreen;