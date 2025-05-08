import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authcontext';

interface User {
  email?: string;
}

interface MenuOptionsProps {
  user: User | null;
  logout: () => void;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({ logout }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();

  const confirmLogout = () => {
    Alert.alert(
      'Confirmar Saída',
      'Você tem certeza de que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  };

  const styles = StyleSheet.create({
    menuContainer: {
      paddingBottom: 30,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textSecondary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.secondary,
    },
    menuItemText: {
      fontSize: 16,
      color: theme.textPrimary,
      marginLeft: 16,
      flex: 1,
    },
    disabledButton: {
      opacity: 0.6,
    },
    iconContainer: {
      width: 24,
      alignItems: 'center',
    },
    logoutText: {
      color: '#ff3b30',
    },
  });

  return (
    <View style={styles.menuContainer}>      
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => navigation.navigate('settings')}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="settings-outline" size={22} color={theme.iconColor} />
        </View>
        <Text style={styles.menuItemText}>Configurações</Text>
        <Ionicons name="chevron-forward-outline" size={20} color={theme.secondary} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.menuItem}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="information-circle-outline" size={22} color={theme.iconColor} />
        </View>
        <Text style={styles.menuItemText}>Sobre o Aplicativo</Text>
        <Ionicons name="chevron-forward-outline" size={20} color={theme.secondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('Terms')}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="document-text-outline" size={22} color={theme.iconColor} />
        </View>
        <Text style={styles.menuItemText}>Termos de Uso</Text>
        <Ionicons name="chevron-forward-outline" size={20} color={theme.secondary} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark-outline" size={22} color={theme.iconColor} />
        </View>
        <Text style={styles.menuItemText}>Política de Privacidade</Text>
        <Ionicons name="chevron-forward-outline" size={20} color={theme.secondary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={confirmLogout}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="exit-outline" size={22} color="#ff3b30" />
        </View>
        <Text style={[styles.menuItemText, styles.logoutText]}>Sair da Conta</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );
};

export default MenuOptions;