import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Primary_theme, Secondary_theme, Tertiary_theme } from '../../colors/color';
import { UserContext } from '../../context/usercontext';

const RecoverPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const { forgotPassword } = useContext(UserContext);

  useEffect(() => {
    const loadMode = async () => {
      const savedMode = await AsyncStorage.getItem('userMode');
      if (savedMode) {
        setMode(savedMode);
        updateColors(savedMode);
      }
    };
    loadMode();
  }, []);

  const updateColors = (mode: string) => {
    if (mode === 'Hidro') {
      setColors(Primary_theme);
    } else if (mode === 'Light') {
      setColors(Secondary_theme);
    } else {
      setColors(Tertiary_theme);
    }
  };

  const handleResetPassword = async () => {
    if (email) {
      try {
        await forgotPassword(email);
        setError('');
        navigation.navigate('Codepass');
      } catch (error) {
        setError('Não foi possível enviar o código de recuperação.');
      }
    } else {
      setError('Por favor, insira seu endereço de e-mail.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 20,
      paddingHorizontal: 16,
    },
    headerTitle: {
      color: colors.iconColor,
      fontSize: 18,
      marginLeft: 10,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 16,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 32,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 24,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      color: colors.textPrimary,
      borderColor: error ? 'red' : colors.textSecondary,
    },
    button: {
      backgroundColor: colors.buttonBackground,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    buttonText: {
      color: colors.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
    },
  });

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
          <Text style={styles.headerTitle}>VOLTAR</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Esqueci a Senha</Text>
          <Text style={styles.subtitle}>Digite o email vinculado ao seu cadastro</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Seu Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Alterar Senha</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default RecoverPage;