import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface User {
  email?: string;
}

interface MenuOptionsProps {
  user: User | null;
  logout: () => void;
  deleteUser: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean }>;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({ user, logout, deleteUser, forgotPassword }) => {
  const navigation = useNavigation<NavigationProp<any>>();
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
          onPress: async () => {
            try {
              await deleteUser();
              logout();
            } catch (error) {
              Alert.alert('Erro', 'Ocorreu um erro ao deletar a conta.');
            }
          },
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
        const result = await forgotPassword(user.email);
        setIsLoading(false);
        if (result.success) {
          navigation.navigate('Codepass', { email: user.email });
        } else {
          Alert.alert('Erro', 'Não foi possível enviar o e-mail de recuperação de senha.');
        }
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Erro', 'Ocorreu um erro ao tentar enviar o e-mail de recuperação de senha.');
      }
    } else {
      Alert.alert('Erro', 'E-mail do usuário não encontrado.');
    }
  };

  const styles = StyleSheet.create({
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
  });

  return (
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
  );
};

export default MenuOptions;