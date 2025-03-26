import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authcontext';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';
import HeaderHidro from '../../components/headerhidro';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    if (!name) {
      setErrorMessage('Por favor, insira seu nome.');
      return;
    }

    if (!email) {
      setErrorMessage('Por favor, insira seu endereço de e-mail.');
      return;
    } else if (!email.includes('@')) {
      setErrorMessage('Por favor, insira um e-mail válido.');
      return;
    }

    if (!password) {
      setErrorMessage('Por favor, insira sua senha.');
      return;
    } else if (password.length < 8) {
      setErrorMessage('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await Postuser(name, email, password);
      await login(email, password);
    } catch (error: any) {
      setErrorMessage(error.message);
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
      width: '80%',
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
      marginBottom: 16,
      borderColor: errorMessage ? theme.red : theme.textSecondary,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      color: theme.textPrimary,
    },
    showPasswordIcon: {
      marginLeft: 10,
    },
    button: {
      width: '100%',
      backgroundColor: theme.buttonBackground,
      padding: 8,
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
      width: '48%',
      height: 40,
      borderRadius: 5,
      backgroundColor: '#DB4437',
    },
    socialButtonText: {
      color: 'white',
      marginLeft: 10,
      fontWeight: 'bold',
    },
    link: {
      color: theme.textPrimary,
      marginTop: 20,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientstartlogin, theme.gradientendlogin]} style={styles.container}>
      <View style={styles.content}>
        <HeaderHidro />
        <Text style={styles.heading}>Criar Conta</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color={theme.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Seu Nome"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color={theme.iconColor} style={styles.inputIcon} />
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

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color={theme.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Sua Senha"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color={theme.iconColor}
              style={styles.showPasswordIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color={theme.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirme sua Senha"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color={theme.iconColor}
              style={styles.showPasswordIcon}
            />
          </TouchableOpacity>
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator color={theme.buttonText} />}
          <Text style={styles.buttonText}>
            {isLoading ? 'Criando...' : 'Criar Conta'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Ou Entre com</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="google" size={24} color="white" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem Conta? Entre com Sua Conta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SignUpScreen;