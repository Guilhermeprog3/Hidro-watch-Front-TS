import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authcontext';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';
import HeaderHidro from '../../components/headerhidro';
import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(50, "O nome não pode ter mais de 50 caracteres"),
  email: z.string()
    .trim()
    .min(1, "O e-mail é obrigatório")
    .email("Por favor, insira um e-mail válido")
    .toLowerCase(),
  password: z.string()
    .min(1, "A senha é obrigatória")
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(32, "A senha não pode ter mais de 32 caracteres")
    .refine(password => /[A-Z]/.test(password), {
      message: "A senha deve conter pelo menos uma letra maiúscula"
    })
    .refine(password => /[0-9]/.test(password), {
      message: "A senha deve conter pelo menos um número"
    }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { login } = useContext(AuthContext);
  const { Postuser } = useContext(UserContext);
  const { theme } = useTheme();
  
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    try {
      Keyboard.dismiss();

      setErrorMessage('');
      setFieldErrors({});
      
      signUpSchema.parse({ name, email, password, confirmPassword });
      
      setIsLoading(true);
      
      await Postuser(name, email, password);
      await login(email, password);
      
    } catch (error) {
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
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '90%',
      maxWidth: 400,
      alignItems: 'center',
    },
    heading: {
      fontSize: 24,
      color: theme.textPrimary,
      marginBottom: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    errorText: {
      color: theme.red,
      fontSize: 14,
      marginBottom: 16,
      textAlign: 'center',
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
      borderColor: fieldErrors.name ? theme.red : theme.textSecondary,
    },
    emailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 8,
      borderColor: fieldErrors.email ? theme.red : theme.textSecondary,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 8,
      borderColor: fieldErrors.password ? theme.red : theme.textSecondary,
    },
    confirmPasswordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 8,
      borderColor: fieldErrors.confirmPassword ? theme.red : theme.textSecondary,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      color: theme.textPrimary,
      height: '100%',
    },
    showPasswordIcon: {
      marginLeft: 10,
    },
    fieldError: {
      color: theme.red,
      fontSize: 12,
      alignSelf: 'flex-start',
      marginLeft: 16,
      marginBottom: 12,
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
      marginBottom: 20,
    },
    disabledButton: {
      opacity: 0.7,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: isLoading ? 8 : 0,
    },
    orText: {
      color: theme.textSecondary,
      marginVertical: 10,
    },
    socialButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 20,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '70%',
      height: 40,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    googleButton: {
      backgroundColor: theme.red,
    },
    socialButtonText: {
      color: 'white',
      marginLeft: 10,
      fontWeight: 'bold',
    },
    link: {
      color: theme.textPrimary,
      marginTop: 20,
      textDecorationLine: 'underline',
    },
  });

  return (
    <LinearGradient 
      colors={[theme.gradientstartlogin, theme.gradientendlogin]} 
      style={styles.container}
    >
      <View style={styles.content}>
        <HeaderHidro />
        <Text style={styles.heading}>Criar Conta</Text>

        <View style={styles.inputContainer}>
          <Ionicons 
            name="person-outline" 
            size={24} 
            color={fieldErrors.name ? theme.red : theme.iconColor} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder="Seu Nome"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={(text) => {
              setName(text);
              clearFieldError('name');
            }}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>
        {fieldErrors.name && <Text style={styles.fieldError}>{fieldErrors.name}</Text>}

        <View style={styles.emailContainer}>
          <Ionicons 
            name="mail-outline" 
            size={24} 
            color={fieldErrors.email ? theme.red : theme.iconColor} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder="Seu Email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearFieldError('email');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
        </View>
        {fieldErrors.email && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}

        <View style={styles.passwordContainer}>
          <Ionicons 
            name="lock-closed-outline" 
            size={24} 
            color={fieldErrors.password ? theme.red : theme.iconColor} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder="Sua Senha"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearFieldError('password');
              if (fieldErrors.confirmPassword) {
                clearFieldError('confirmPassword');
              }
            }}
            returnKeyType="next"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color={fieldErrors.password ? theme.red : theme.iconColor}
              style={styles.showPasswordIcon}
            />
          </TouchableOpacity>
        </View>
        {fieldErrors.password && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}

        <View style={styles.confirmPasswordContainer}>
          <Ionicons 
            name="lock-closed-outline" 
            size={24} 
            color={fieldErrors.confirmPassword ? theme.red : theme.iconColor} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder="Confirme sua Senha"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearFieldError('confirmPassword');
            }}
            returnKeyType="go"
            onSubmitEditing={handleSignUp}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color={fieldErrors.confirmPassword ? theme.red : theme.iconColor}
              style={styles.showPasswordIcon}
            />
          </TouchableOpacity>
        </View>
        {fieldErrors.confirmPassword && <Text style={styles.fieldError}>{fieldErrors.confirmPassword}</Text>}

        {errorMessage && !Object.values(fieldErrors).some(Boolean) && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]} 
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator color={theme.buttonText} />}
          <Text style={styles.buttonText}>
            {isLoading ? 'Criando...' : 'Criar Conta'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Ou entre com</Text>
        
        <View style={styles.socialButtons}>
          <TouchableOpacity 
            style={[styles.socialButton, styles.googleButton]}
            onPress={() => {}}
          >
            <AntDesign name="google" size={24} color="white" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SignUpScreen;