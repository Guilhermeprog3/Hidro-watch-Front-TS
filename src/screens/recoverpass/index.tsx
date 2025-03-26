import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';
import HeaderBack from '../../components/headerBack';

const RecoverPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { forgotPassword } = useContext(UserContext);

  const validateEmail = (email: string) => {
    return email.includes('@');
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage('Por favor, insira seu endereço de e-mail.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, insira um email válido.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await forgotPassword(email);
      navigation.navigate('Codepass', { email });
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
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
      marginBottom: 32,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 10,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      color: theme.textPrimary,
      borderColor: errorMessage ? theme.red : theme.textSecondary,
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
    errorText: {
      color: theme.red,
      fontSize: 14,
      marginBottom: 16,
      textAlign: 'center',
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <HeaderBack onBackPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>Esqueci a Senha</Text>
        <Text style={styles.subtitle}>Digite o email vinculado ao seu cadastro</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Seu Email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator color={theme.buttonText} />}
          <Text style={styles.buttonText}>
            {isLoading ? 'Enviando...' : 'Enviar Código'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default RecoverPage;