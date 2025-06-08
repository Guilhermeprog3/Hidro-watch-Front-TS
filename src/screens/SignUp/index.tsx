import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';
import HeaderHidro from '../../components/headerhidro';
import { z } from 'zod';

const emailSchema = z.string().trim().min(1, "O e-mail é obrigatório").email("Por favor, insira um e-mail válido").toLowerCase();

const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { initEmailVerification } = useContext(UserContext);
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleContinue = async () => {
    Keyboard.dismiss();
    try {
      emailSchema.parse(email);
      setErrorMessage('');
      setIsLoading(true);

      await initEmailVerification(email);
      navigation.navigate('VerifySignUpCode', { email });

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors[0].message);
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
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
      marginBottom: 10,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 30,
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
      marginBottom: 20,
      borderColor: errorMessage ? theme.red : theme.textSecondary,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      color: theme.textPrimary,
      height: '100%',
    },
    button: {
      width: '100%',
      backgroundColor: theme.buttonBackground,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginBottom: 20,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: isLoading ? 8 : 0,
    },
    link: {
      color: theme.textPrimary,
      marginTop: 20,
      textDecorationLine: 'underline',
    },
  });

  return (
    <LinearGradient colors={[theme.gradientstartlogin, theme.gradientendlogin]} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <HeaderHidro />
          <Text style={styles.heading}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Insira seu e-mail para enviarmos um código de verificação.</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color={errorMessage ? theme.red : theme.iconColor} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Seu Email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (errorMessage) setErrorMessage('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={handleContinue}
            />
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleContinue} disabled={isLoading}>
            {isLoading && <ActivityIndicator color={theme.buttonText} />}
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Já tem conta? Faça login</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

export default SignUpScreen;