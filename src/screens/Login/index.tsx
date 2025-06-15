import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, ScrollView, ViewStyle } from 'react-native';
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
      paddingHorizontal: 32,
      paddingVertical: 48,
    },
    content: {
      width: '100%',
      maxWidth: 380,
      alignSelf: 'center',
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 48,
    },
    heading: {
      fontSize: 28,
      color: theme.textPrimary,
      marginBottom: 8,
      fontWeight: '300',
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: 'center',
      opacity: 0.7,
      fontWeight: '400',
    },
    formContainer: {
      marginBottom: 32,
      gap: 20,
    },
    inputGroup: {
      gap: 6,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: 52,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    } as ViewStyle,
    inputContainerFocused: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
    } as ViewStyle,
    inputContainerError: {
      borderColor: theme.red,
      backgroundColor: 'rgba(255, 0, 0, 0.05)',
    } as ViewStyle,
    inputIcon: {
      marginRight: 12,
      opacity: 0.6,
    },
    input: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '400',
    },
    showPasswordIcon: {
      marginLeft: 12,
      padding: 4,
      opacity: 0.6,
    },
    errorText: {
      color: theme.red,
      fontSize: 13,
      fontWeight: '400',
      marginLeft: 4,
      opacity: 0.9,
    },
    forgotPasswordContainer: {
      alignItems: 'center',
      marginBottom: 8,
    },
    forgotPasswordText: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '400',
      opacity: 0.7,
    },
    button: {
      width: '100%',
      height: 52,
      backgroundColor: theme.buttonBackground,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 8,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: '500',
      marginLeft: isLoading ? 8 : 0,
    },
    linksContainer: {
      alignItems: 'center',
      gap: 20,

    },
    linkButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    link: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '400',
      opacity: 0.7,
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      width: '40%',
    },
  });

  const getInputStyle = (field: string): ViewStyle[] => {
    const baseStyle = [styles.inputContainer];
    
    if (hasError(field)) {
      baseStyle.push(styles.inputContainerError);
    } else if (focusedField === field) {
      baseStyle.push(styles.inputContainerFocused);
    }
    
    return baseStyle;
  };

  const getIconColor = (field: string) => {
    if (hasError(field)) return theme.red;
    return theme.textPrimary;
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
            <View style={styles.inputGroup}>
              <View style={getInputStyle('email')}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={getIconColor('email')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor={`${theme.textSecondary}80`}
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
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={getInputStyle('password')}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={getIconColor('password')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor={`${theme.textSecondary}80`}
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
                    size={20}
                    color={getIconColor('password')}
                  />
                </TouchableOpacity>
              </View>
              {fieldErrors.password && (
                <Text style={styles.errorText}>{fieldErrors.password}</Text>
              )}
            </View>

            {errorMessage && globalError && (
              <Text style={styles.errorText}>{errorMessage}</Text>
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
            
            <View style={styles.divider} />
            
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