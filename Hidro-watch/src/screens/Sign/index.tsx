import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authcontext';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';
import HeaderHidro from '../../components/headerhidro';

const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { login } = useContext(AuthContext);
  const { Postuser } = useContext(UserContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { theme } = useTheme();

  const handlePasswordChange = (password: string) => {
    setPassword(password);
  };
  const handleSignUp = async () => {
    if (name && email && password && confirmPassword) {
      if (password === confirmPassword) {
        await Postuser(name, email, password);
        await login(email, password);
      } else {
        setErrorMessage('As senhas não coincidem.');
      }
    } else {
      setErrorMessage('Por favor, preencha todos os campos.');
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
    },
    errorText: {
      color: theme.red,
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      borderColor: theme.textPrimary,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 40,
      color: theme.textPrimary,
    },
    showPasswordIcon: {
      marginLeft: 10,
    },
    button: {
      width: '100%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginBottom: 20,
    },
    buttonText: {
      color: theme.buttonText,
      fontWeight: 'bold',
    },
    orText: {
      color: theme.textPrimary,
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
        <HeaderHidro/>
        <Text style={styles.heading}>Criar Conta</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color={theme.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.textPrimary}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={handlePasswordChange}
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
            placeholder="Confirm Password"
            placeholderTextColor={theme.textPrimary}
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
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color={theme.iconColor} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor={theme.textPrimary}
            value={name}
            onChangeText={setName}
          />
        </View>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <LinearGradient colors={[theme.secondary, theme.secondary]} style={styles.button}>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.buttonText}>Criar Conta</Text>
          </TouchableOpacity>
        </LinearGradient>
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