import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface MenuOptionsProps {
  logout: () => void;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({ logout }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    logout();
  };

  const openLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const closeLogoutModal = () => {
    setLogoutModalVisible(false);
  };

  const styles = StyleSheet.create({
    menuContainer: {
      paddingBottom: 30,
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
    iconContainer: {
      width: 24,
      alignItems: 'center',
    },
    logoutText: {
      color: '#ff3b30',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
      width: '85%',
      backgroundColor: theme.gradientEnd,
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },
    modalMessage: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: theme.secondary,
      marginRight: 8,
    },
    logoutButton: {
      backgroundColor: '#ff3b30',
      marginLeft: 8,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: theme.textPrimary,
    },
    logoutButtonText: {
      color: '#fff',
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
         onPress={() => navigation.navigate('About')}
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
         onPress={() => navigation.navigate('Privacy')}
       >
         <View style={styles.iconContainer}>
           <Ionicons name="shield-checkmark-outline" size={22} color={theme.iconColor} />
         </View>
         <Text style={styles.menuItemText}>Política de Privacidade</Text>
         <Ionicons name="chevron-forward-outline" size={20} color={theme.secondary} />
       </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.menuItem}
        onPress={openLogoutModal}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="exit-outline" size={22} color="#ff3b30" />
        </View>
        <Text style={[styles.menuItemText, styles.logoutText]}>Sair da Conta</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#ff3b30" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={closeLogoutModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeLogoutModal}>
          <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Confirmar Saída</Text>
            <Text style={styles.modalMessage}>
              Você tem certeza de que deseja sair da sua conta?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeLogoutModal}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, styles.logoutButtonText]}>Sair</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default MenuOptions;