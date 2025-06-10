import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
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
      fontSize: 28,
      color: theme.textPrimary,
      marginBottom: 12,
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 20,
    },
    formContainer: {
      marginBottom: 32,
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
      borderColor: errorMessage ? theme.red : 'rgba(255, 255, 255, 0.2)',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },

    },
    inputContainerFocused: {
      borderColor: theme.buttonBackground,
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
    errorContainer: {
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    errorText: {
      color: theme.red,
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'left',
    },
    button: {
      width: '100%',
      height: 56,
      backgroundColor: theme.buttonBackground,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginBottom: 24,
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
    divider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      marginVertical: 8,
      width: '60%',
      alignSelf: 'center',
    },
  });

  const [isFocused, setIsFocused] = useState(false);

  return (
    <LinearGradient colors={[theme.gradientstartlogin, theme.gradientendlogin]} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <HeaderHidro />
              <Text style={styles.heading}>Crie sua conta</Text>
              <Text style={styles.subtitle}>
                Insira seu e-mail para enviarmos um código de verificação e começar sua jornada.
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={[
                styles.inputContainer, 
                isFocused && styles.inputContainerFocused
              ]}>
                <Ionicons 
                  name="mail-outline" 
                  size={22} 
                  color={errorMessage ? theme.red : (isFocused ? theme.buttonBackground : theme.iconColor)} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="go"
                  onSubmitEditing={handleContinue}
                />
              </View>

              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleContinue} 
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading && <ActivityIndicator size="small" color={theme.buttonText} />}
                <Text style={styles.buttonText}>
                  {isLoading ? 'Enviando...' : 'Continuar'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.linksContainer}>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={styles.link}>Já tem conta? Faça login</Text>
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
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

export default SignUpScreen;