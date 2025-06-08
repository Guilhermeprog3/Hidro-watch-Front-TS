import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Ionicons } from '@expo/vector-icons';
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

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      setErrorMessage('');
      setFieldErrors({});
      setGlobalError(false);

      loginSchema.parse({ email, password });

      setIsLoading(true);

      await login(email, password);
      

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
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
        setGlobalError(true);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Erro inesperado. Tente novamente mais tarde.');
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

  const hasError = (field: string) => fieldErrors[field] || globalError;

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    content: { 
      width: '90%', 
      maxWidth: 400, 
      alignItems: 'center' 
    },
    heading: { 
      fontSize: 24, 
      color: theme.textPrimary, 
      marginBottom: 20, 
      fontWeight: 'bold', 
      textAlign: 'center' 
    },
    errorText: { color: theme.red, 
      fontSize: 14, 
      marginBottom: 16, 
      textAlign: 'center' 
    },
    inputContainer: {
      flexDirection: 'row', 
      alignItems: 'center', 
      width: '100%', 
      height: 50,
      borderWidth: 1, 
      borderRadius: 8, 
      paddingHorizontal: 16, 
      marginBottom: 8,
    },
    inputIcon: { 
      marginRight: 10 
    },
    input: { 
      flex: 1, 
      color: theme.textPrimary, 
      height: '100%' 
    },
    showPasswordIcon: { 
      marginLeft: 10 
    },
    fieldError: { 
      color: theme.red, 
      fontSize: 12, 
      alignSelf: 'flex-start', 
      marginLeft: 16, 
      marginBottom: 12 
    },
    button: {
      width: '100%', 
      backgroundColor: theme.buttonBackground, 
      padding: 15, 
      borderRadius: 8,
      alignItems: 'center', 
      elevation: 3, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1, 
      shadowRadius: 4, 
      flexDirection: 'row', 
      justifyContent: 'center', 
      marginBottom: 20
    },
    disabledButton: { 
      opacity: 0.7 
    },
    buttonText: { 
      color: theme.buttonText, 
      fontSize: 18, 
      fontWeight: 'bold', 
      marginLeft: isLoading ? 8 : 0 },
    orText: { 
      color: theme.textSecondary, 
      marginVertical: 10 
    },
    socialButtons: { 
      flexDirection: 'row', 
      justifyContent: 'center', 
      width: '100%', 
      marginBottom: 20 
    },
    socialButton: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center', 
      width: '70%', 
      height: 40,
      borderRadius: 5, 
      marginHorizontal: 10
    },
    googleButton: { 
      backgroundColor: theme.red 
    },
    socialButtonText: { 
      color: 'white', 
      marginLeft: 10, 
      fontWeight: 'bold'
     },
    link: { color: theme.textPrimary,
       marginTop: 20, 
       textDecorationLine: 'underline'
       },
    forgotPasswordText: {
      color: theme.textPrimary, 
      marginTop: 0, 
      marginBottom: 20,
      textDecorationLine: 'underline', 
      alignSelf: 'flex-end'
    },
  });

  return (
    <LinearGradient colors={[theme.gradientstartlogin, theme.gradientendlogin]} style={styles.container}>
      <View style={styles.content}>
        <HeaderHidro />
        <Text style={styles.heading}>Entrar</Text>

        <View style={[styles.inputContainer, { borderColor: hasError('email') ? theme.red : theme.textSecondary }]}>
          <Ionicons
            name="mail-outline"
            size={24}
            color={hasError('email') ? theme.red : theme.iconColor}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Seu Email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={(text) => { setEmail(text); clearFieldError('email'); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => { }}
          />
        </View>
        {fieldErrors.email && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}

        <View style={[styles.inputContainer, { borderColor: hasError('password') ? theme.red : theme.textSecondary }]}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color={hasError('password') ? theme.red : theme.iconColor}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Sua Senha"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => { setPassword(text); clearFieldError('password'); }}
            returnKeyType="go"
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color={hasError('password') ? theme.red : theme.iconColor}
              style={styles.showPasswordIcon}
            />
          </TouchableOpacity>
        </View>
        {fieldErrors.password && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity onPress={() => navigation.navigate('Recoverpass')}>
          <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator color={theme.buttonText} />}
          <Text style={styles.buttonText}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Ou entre com</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={() => { }}>
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