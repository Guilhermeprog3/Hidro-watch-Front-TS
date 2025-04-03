import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/authcontext';
import { UserContext } from '../../context/usercontext';

type ThemeMode = 'hidro' | 'light' | 'dark';

const MenuOptionsConfig = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const { deleteUser, forgotPassword } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const toggleMode = async (newMode: ThemeMode) => {
    toggleTheme(newMode);
    setThemeModalVisible(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteModalVisible(false);
    try {
      await deleteUser();
      logout();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao deletar a conta. Por favor, tente novamente.');
    }
  };

  const handleForgotPassword = async () => {
    if (!user?.email) {
      Alert.alert('Erro', 'Nenhum e-mail associado à conta.');
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(user.email);
      navigation.navigate('Codepass', { email: user.email });
    } catch (error) {
      Alert.alert(
        'Erro', 
        'Falha ao enviar e-mail de recuperação. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    menuContainer: {
      marginTop: 20,
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '85%',
      backgroundColor: theme.primaryLight,
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    modalHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.secondary,
    },
    modalOptionText: {
      fontSize: 16,
      color: theme.textPrimary,
      marginLeft: 16,
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: theme.secondary,
    },
    deleteButton: {
      backgroundColor: '#ff3b30',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    closeButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      padding: 8,
      zIndex: 1,
    },
    iconContainer: {
      width: 24,
      alignItems: 'center',
    },
    warningIcon: {
      alignSelf: 'center',
      marginBottom: 15,
    },
    warningText: {
      textAlign: 'center',
      color: theme.textPrimary,
      marginBottom: 5,
    },
  });

  return (
    <View style={styles.menuContainer}>
      <Text style={styles.sectionTitle}>Preferências</Text>
      
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => setThemeModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="color-palette-outline" size={22} color={theme.iconColor} />
        </View>
        <Text style={styles.menuItemText}>Tema do Aplicativo</Text>
        <Ionicons name="chevron-forward-outline" size={20} color={theme.secondary} />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Conta</Text>
      
      <TouchableOpacity
        style={[styles.menuItem, isLoading && styles.disabledButton]}
        onPress={handleForgotPassword}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={22} color={theme.iconColor} />
        </View>
        <Text style={styles.menuItemText}>Alterar Senha</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.iconColor} />
        ) : (
          <Ionicons name="chevron-forward-outline" size={20} color={theme.secondary} />
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => setDeleteModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="trash-outline" size={22} color="#ff3b30" />
        </View>
        <Text style={[styles.menuItemText, { color: '#ff3b30' }]}>Deletar Conta</Text>
        <Ionicons name="chevron-forward-outline" size={20} color={theme.secondary} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setThemeModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setThemeModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color={theme.iconColor} />
                </TouchableOpacity>

                <Text style={styles.modalHeader}>Selecione o Tema</Text>
                
                <TouchableOpacity 
                  style={styles.modalOption} 
                  onPress={() => toggleMode('hidro')}
                >
                  <Ionicons name="water-outline" size={22} color="#2d9cdb" />
                  <Text style={styles.modalOptionText}>Hidro Mode</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalOption} 
                  onPress={() => toggleMode('light')}
                >
                  <Ionicons name="sunny-outline" size={22} color="#f2c94c" />
                  <Text style={styles.modalOptionText}>Light Mode</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalOption} 
                  onPress={() => toggleMode('dark')}
                >
                  <Ionicons name="moon-outline" size={22} color="#bb86fc" />
                  <Text style={styles.modalOptionText}>Dark Mode</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setDeleteModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color={theme.iconColor} />
                </TouchableOpacity>

                <Ionicons 
                  name="warning-outline" 
                  size={40} 
                  color="#ff3b30" 
                  style={styles.warningIcon}
                />
                
                <Text style={styles.modalHeader}>Confirmar Exclusão</Text>
                
                <Text style={styles.warningText}>
                  Você tem certeza de que deseja deletar sua conta?
                </Text>
                <Text style={styles.warningText}>
                  Esta ação não pode ser desfeita.
                </Text>

                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setDeleteModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={handleDeleteAccount}
                  >
                    <Text style={styles.buttonText}>Deletar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default MenuOptionsConfig;