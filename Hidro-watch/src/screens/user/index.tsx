import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authcontext';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';

const UserPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user, logout } = useContext(AuthContext);
  const { deleteUser, forgotPassword } = useContext(UserContext);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza de que deseja deletar sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: deleteUser,
        },
      ],
    );
  };

  const confirmLogout = () => {
    Alert.alert(
      'Confirmar Saída',
      'Você tem certeza de que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: logout,
        },
      ],
    );
  };

  const handleForgotPassword = async () => {
    if (user?.email) {
      setIsLoading(true);
      try {
        await forgotPassword(user.email);
        setIsLoading(false);
        navigation.navigate('Codepass', { email: user.email });
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Erro', 'Não foi possível enviar o e-mail de recuperação de senha. Tente novamente.');
      }
    } else {
      Alert.alert('Erro', 'E-mail do usuário não encontrado.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
    },
    header: {
      paddingBottom: 30,
      alignItems: 'center',
    },
    profileSection: {
      alignItems: 'center',
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    profileEmail: {
      fontSize: 16,
      color: theme.textPrimary,
    },
    menuContainer: {
      marginTop: 20,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
    },
    menuItemText: {
      fontSize: 18,
      color: theme.textPrimary,
      marginLeft: 10,
      flex: 1,
    },
    disabledButton: {
      opacity: 0.5,
    },
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      backgroundColor: theme.navBarBackground,
      borderRadius: 0,
      position: 'absolute',
      bottom: 0,
      width: '100%',
      alignSelf: 'center',
    },
    navItem: {
      alignItems: 'center',
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image source={require('../../../assets/images/profilePicture.jpeg')} style={styles.profilePicture} />
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('settings')}>
          <Ionicons name="settings-outline" size={24} color={theme.iconColor} />
          <Text style={styles.menuItemText}>Configuração</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={theme.iconColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="information-circle-outline" size={24} color={theme.iconColor} />
          <Text style={styles.menuItemText}>Sobre</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={theme.iconColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, isLoading && styles.disabledButton]}
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          <Ionicons name="lock-closed-outline" size={24} color={theme.iconColor} />
          <Text style={styles.menuItemText}>Alterar Senha</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.iconColor} />
          ) : (
            <Ionicons name="chevron-forward-outline" size={24} color={theme.iconColor} />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={confirmDeleteAccount}>
          <Ionicons name="trash-outline" size={24} color={theme.iconColor} />
          <Text style={styles.menuItemText}>Deletar Conta</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={theme.iconColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={confirmLogout}>
          <Ionicons name="exit-outline" size={24} color={theme.iconColor} />
          <Text style={styles.menuItemText}>Sair</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={theme.iconColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.navBar}>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color={theme.navBarIconColor} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Ionicons name="time" size={24} color={theme.navBarIconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Like')}>
          <Ionicons name="heart" size={24} color={theme.navBarIconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
          <Ionicons name="person" size={24} color={theme.navBarIconColor} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default UserPage;