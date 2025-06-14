import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/Auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';
import HeaderHidro from '../../components/headerhidro';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string()
    .trim()
    .min(1, "O e-mail é obrigatório")
    .email("Por favor, insira um e-mail válido")
    .toLowerCase(),
  password: z.string()
    .min(1, "A senha é obrigatória")
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(32, "A senha não pode ter mais de 32 caracteres"),
});

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>('');

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      setErrorMessage('');
      setFieldErrors({});
      setGlobalError(false);

      loginSchema.parse({ email, password });

      setIsLoading(true);

      await login(email, password);
      navigation.navigate('HomeLayout')
      
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setFieldErrors(errors);
        if (error.errors[0]) {
          setErrorMessage(error.errors[0].message);
        }
      } else if (error.message) {
        setErrorMessage(error.message);
        setGlobalError(true);
      } else {
        setErrorMessage('Erro inesperado. Tente novamente mais tarde.');
        setGlobalError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
    if (errorMessage) {
      setErrorMessage('');
      setGlobalError(false);
    }
  };

  const hasError = (field: string) => !!fieldErrors[field] || globalError;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    content: {
      width: '100%',
      maxWidth: 400,
      alignSelf: 'center',
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    heading: {
      fontSize: 32,
      color: theme.textPrimary,
      marginBottom: 8,
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      opacity: 0.8,
    },
    formContainer: {
      marginBottom: 24,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: 56,
      borderWidth: 1.5,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginBottom: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    inputContainerFocused: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '500',
    },
    showPasswordIcon: {
      marginLeft: 12,
      padding: 4,
    },
    fieldErrorContainer: {
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    fieldError: {
      color: theme.red,
      fontSize: 14,
      fontWeight: '500',
    },
    forgotPasswordContainer: {
      alignItems: 'flex-end',
      marginBottom: 24,
    },
    forgotPasswordText: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '500',
      textDecorationLine: 'underline',
      opacity: 0.8,
    },
    button: {
      width: '100%',
      height: 56,
      backgroundColor: theme.buttonBackground,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      shadowColor: theme.buttonBackground,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    buttonDisabled: {
      opacity: 0.7,
      shadowOpacity: 0.1,
      elevation: 2,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: '600',
      marginLeft: isLoading ? 10 : 0,
    },
    linksContainer: {
      alignItems: 'center',
      gap: 16,
    },
    linkButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    link: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '500',
      textDecorationLine: 'underline',
      opacity: 0.9,
    },
    linkDivider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      width: '60%',
      alignSelf: 'center',
    },
  });

  const getInputBorderColor = (field: string) => {
    if (hasError(field)) return theme.red;
    if (focusedField === field) return theme.buttonBackground;
    return 'rgba(255, 255, 255, 0.2)';
  };

  const getIconColor = (field: string) => {
    if (hasError(field)) return theme.red;
    if (focusedField === field) return theme.buttonBackground;
    return theme.iconColor;
  };

  return (
    <LinearGradient colors={[theme.gradientstartlogin, theme.gradientendlogin]} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <HeaderHidro />
            <Text style={styles.heading}>Bem-vindo</Text>
            <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={[
              styles.inputContainer,
              focusedField === 'email' && styles.inputContainerFocused,
              { borderColor: getInputBorderColor('email') }
            ]}>
              <Ionicons
                name="mail-outline"
                size={22}
                color={getIconColor('email')}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={(text) => { setEmail(text); clearFieldError('email'); }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
            {fieldErrors.email && (
              <View style={styles.fieldErrorContainer}>
                <Text style={styles.fieldError}>{fieldErrors.email}</Text>
              </View>
            )}

            <View style={[
              styles.inputContainer,
              focusedField === 'password' && styles.inputContainerFocused,
              { borderColor: getInputBorderColor('password') }
            ]}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={getIconColor('password')}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => { setPassword(text); clearFieldError('password'); }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.showPasswordIcon}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color={getIconColor('password')}
                />
              </TouchableOpacity>
            </View>
            {fieldErrors.password && (
              <View style={styles.fieldErrorContainer}>
                <Text style={styles.fieldError}>{fieldErrors.password}</Text>
              </View>
            )}

            {errorMessage && globalError && (
              <View style={styles.fieldErrorContainer}>
                <Text style={styles.fieldError}>{errorMessage}</Text>
              </View>
            )}

            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Recoverpass')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading && <ActivityIndicator size="small" color={theme.buttonText} />}
              <Text style={styles.buttonText}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linksContainer}>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.7}
            >
              <Text style={styles.link}>Não tem conta? Crie uma conta</Text>
            </TouchableOpacity>
            
            <View style={styles.linkDivider} />
            
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => navigation.navigate('Terms')}
              activeOpacity={0.7}
            >
              <Text style={styles.link}>Termos de Uso e Privacidade</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default LoginScreen;