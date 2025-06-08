import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authcontext';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';
import HeaderBack from '../../components/headerBack';
import { z } from 'zod';

const completeSignUpSchema = z.object({
  name: z.string().trim().min(3, "O nome deve ter pelo menos 3 caracteres"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

type CompleteSignUpRouteProp = RouteProp<{ CompleteSignUp: { email: string } }, 'CompleteSignUp'>;

const CompleteSignUpScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<CompleteSignUpRouteProp>();
  const { email } = route.params;

  const { login } = useContext(AuthContext);
  const { postUser } = useContext(UserContext);
  const { theme } = useTheme();
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    Keyboard.dismiss();
    setFieldErrors({});

    try {
      completeSignUpSchema.parse({ name, password, confirmPassword });
      
      setIsLoading(true);

      await postUser(name, email, password);
      
      await login(email, password);

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path && err.path[0]) {
            errors[err.path[0]] = err.message;
          }
        });
        setFieldErrors(errors);
      } else {
        setFieldErrors({ form: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
    if (fieldErrors.form) {
      setFieldErrors(prev => ({ ...prev, form: '' }));
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
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      paddingHorizontal: 10,
    },
    heading: {
      fontSize: 24,
      color: theme.textPrimary,
      marginBottom: 5,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 25,
      textAlign: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 20,
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
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: isLoading ? 8 : 0,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientstartlogin, theme.gradientendlogin]} style={styles.container}>
      <View style={styles.headerContainer}>
        <HeaderBack onBackPress={() => navigation.goBack()} />
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <Text style={styles.heading}>Quase lá!</Text>
          <Text style={styles.subtitle}>E-mail verificado: {email}</Text>
          
          <View style={[styles.inputContainer, { borderColor: fieldErrors.name ? theme.red : theme.textSecondary }]}>
            <Ionicons name="person-outline" size={24} color={fieldErrors.name ? theme.red : theme.iconColor} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Seu Nome Completo"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={text => { setName(text); clearFieldError('name'); }}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>
          {fieldErrors.name && <Text style={styles.fieldError}>{fieldErrors.name}</Text>}

          <View style={[styles.inputContainer, { borderColor: fieldErrors.password ? theme.red : theme.textSecondary }]}>
            <Ionicons name="lock-closed-outline" size={24} color={fieldErrors.password ? theme.red : theme.iconColor} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Crie uma Senha"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={text => { setPassword(text); clearFieldError('password'); }}
              returnKeyType="next"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color={theme.iconColor} style={styles.showPasswordIcon} />
            </TouchableOpacity>
          </View>
          {fieldErrors.password && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}

          <View style={[styles.inputContainer, { borderColor: fieldErrors.confirmPassword ? theme.red : theme.textSecondary }]}>
            <Ionicons name="lock-closed-outline" size={24} color={fieldErrors.confirmPassword ? theme.red : theme.iconColor} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirme sua Senha"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={text => { setConfirmPassword(text); clearFieldError('confirmPassword'); }}
              returnKeyType="go"
              onSubmitEditing={handleSignUp}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color={theme.iconColor} style={styles.showPasswordIcon} />
            </TouchableOpacity>
          </View>
          {fieldErrors.confirmPassword && <Text style={styles.fieldError}>{fieldErrors.confirmPassword}</Text>}
          {fieldErrors.form && <Text style={styles.errorText}>{fieldErrors.form}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
            {isLoading && <ActivityIndicator color={theme.buttonText} />}
            <Text style={styles.buttonText}>Finalizar Cadastro</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

export default CompleteSignUpScreen;