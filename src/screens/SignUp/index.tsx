import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, TouchableWithoutFeedback, ScrollView, ViewStyle } from 'react-native';
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
  const [isFocused, setIsFocused] = useState(false);

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
      marginBottom: 12,
      fontWeight: '300',
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 16,
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
    errorText: {
      color: theme.red,
      fontSize: 13,
      fontWeight: '400',
      marginLeft: 4,
      opacity: 0.9,
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

  const getInputStyle = (): ViewStyle[] => {
    const baseStyle = [styles.inputContainer];
    
    if (errorMessage) {
      baseStyle.push(styles.inputContainerError);
    } else if (isFocused) {
      baseStyle.push(styles.inputContainerFocused);
    }
    
    return baseStyle;
  };

  const getIconColor = () => {
    if (errorMessage) return theme.red;
    return theme.textPrimary;
  };

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
                Insira seu e-mail para enviarmos um código de verificação e começar sua jornada
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <View style={getInputStyle()}>
                  <Ionicons 
                    name="mail-outline" 
                    size={20} 
                    color={getIconColor()} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor={`${theme.textSecondary}80`}
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
                
                {errorMessage && (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                )}
              </View>

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