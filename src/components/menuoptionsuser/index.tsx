import React from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface User {
  email?: string;
}

interface MenuOptionsProps {
  user: User | null;
  logout: () => void;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({ user, logout }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();

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
      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="document-text-outline" size={24} color={theme.iconColor} />
          <Text style={styles.menuItemText}>Termo de Uso</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={theme.iconColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="shield-checkmark-outline" size={24} color={theme.iconColor} />
          <Text style={styles.menuItemText}>Política de Privacidade</Text>
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