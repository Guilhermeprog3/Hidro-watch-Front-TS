import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  user: any;
  email?: string;
}

interface MenuOptionsConfigProps {
  user: User | null;
  deleteUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean }>;
  logout: () => void;
}

type ThemeMode = 'Hidro' | 'Light' | 'Dark';

const MenuOptionsConfig: React.FC<MenuOptionsConfigProps> = ({
  user,
  deleteUser,
  forgotPassword,
  logout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('Hidro');
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('userMode');
        if (savedTheme) {
          setCurrentTheme(savedTheme as ThemeMode);
        }
      } catch (error) {
      }
    };
    fetchTheme();
  }, []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: themeModalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [themeModalVisible, animation]);

  const toggleMode = async (newMode: ThemeMode) => {
    setCurrentTheme(newMode);
    toggleTheme(newMode);
    await AsyncStorage.setItem('userMode', newMode);
    setTimeout(() => {
      setThemeModalVisible(false);
    }, 300);
  };

  const confirmDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUser();
      await logout();
      setDeleteModalVisible(false);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao deletar a conta.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (user?.user.email) {
      setIsLoading(true);
      try {
        await forgotPassword(user.user.email);
        navigation.navigate('Codepass', { email: user.user.email });
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao tentar enviar o e-mail de recuperação de senha.');
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Erro', 'E-mail do usuário não encontrado.');
    }
  };

  const getCurrentThemeName = () => currentTheme;

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const styles = StyleSheet.create({
    menuContainer: {
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.textSecondary,
      paddingHorizontal: 16,
    },
    menuItemText: {
      fontSize: 18,
      color: theme.textPrimary,
      marginLeft: 10,
      flex: 1,
    },
    deleteMenuItemText: {
      fontSize: 18,
      color: '#ff3b30',
      marginLeft: 10,
      flex: 1,
    },
    disabledButton: {
      opacity: 0.5,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: theme.gradientEnd,
      borderRadius: 15,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    deleteModalContainer: {
        width: '85%',
        backgroundColor: theme.gradientEnd,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    modalHeader: {
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
    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.textSecondary,
    },
    modalOptionText: {
      fontSize: 18,
      color: theme.textPrimary,
      marginLeft: 15,
    },
    closeButton: {
      marginTop: 20,
      padding: 15,
      backgroundColor: theme.secondary,
      borderRadius: 10,
      alignItems: 'center',
    },
    closeButtonText: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    activeOption: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 12,
    },
    themeIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 10,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      width: '100%',
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    cancelButton: {
      backgroundColor: theme.secondary,
      marginRight: 8,
    },
    confirmDeleteButton: {
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
    confirmButtonText: {
      color: '#fff',
    },
  });

  return (
    <View style={styles.menuContainer}>
      <Text style={styles.sectionTitle}>Preferências</Text>
      <TouchableOpacity style={styles.menuItem} onPress={() => setThemeModalVisible(true)}>
        <Ionicons name="color-palette-outline" size={24} color={theme.iconColor} />
        <Text style={styles.menuItemText}>Tema</Text>
        <Text style={{ color: theme.textSecondary, marginRight: 8 }}>{getCurrentThemeName()}</Text>
        <Ionicons name="chevron-forward-outline" size={24} color={theme.iconColor} />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Conta</Text>
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
        <Ionicons name="trash-outline" size={24} color="#ff3b30" />
        <Text style={styles.deleteMenuItemText}>Deletar Conta</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#ff3b30" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setThemeModalVisible(false)}>
          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY }] }]}
          >
            <Pressable>
              <Text style={styles.modalHeader}>Selecione o Tema</Text>
              <TouchableOpacity
                style={[styles.modalOption, getCurrentThemeName() === 'Hidro' && styles.activeOption]}
                onPress={() => toggleMode('Hidro')}
              >
                <Ionicons name="water" size={24} color="#0088cc" />
                <Text style={styles.modalOptionText}>Hidro Mode</Text>
                {getCurrentThemeName() === 'Hidro' && <Ionicons name="checkmark-circle" size={24} color={theme.iconColor} style={{ marginLeft: 'auto' }} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalOption, getCurrentThemeName() === 'Light' && styles.activeOption]}
                onPress={() => toggleMode('Light')}
              >
                <Ionicons name="sunny" size={24} color="#FF9500" />
                <Text style={styles.modalOptionText}>Light Mode</Text>
                {getCurrentThemeName() === 'Light' && <Ionicons name="checkmark-circle" size={24} color={theme.iconColor} style={{ marginLeft: 'auto' }} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalOption, getCurrentThemeName() === 'Dark' && styles.activeOption]}
                onPress={() => toggleMode('Dark')}
              >
                <Ionicons name="moon" size={24} color="#8E8E93" />
                <Text style={styles.modalOptionText}>Dark Mode</Text>
                {getCurrentThemeName() === 'Dark' && <Ionicons name="checkmark-circle" size={24} color={theme.iconColor} style={{ marginLeft: 'auto' }} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setThemeModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => !isDeleting && setDeleteModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => !isDeleting && setDeleteModalVisible(false)}>
          <Pressable style={styles.deleteModalContainer}>
            <Text style={styles.modalHeader}>Confirmar Exclusão</Text>
            <Text style={styles.modalMessage}>
              Esta ação é irreversível. Você tem certeza de que deseja deletar sua conta permanentemente?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, isDeleting && styles.disabledButton]}
                onPress={() => setDeleteModalVisible(false)}
                disabled={isDeleting}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmDeleteButton, isDeleting && styles.disabledButton]}
                onPress={handleDeleteAccount}
                disabled={isDeleting}
                activeOpacity={0.8}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                ) : null}
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default MenuOptionsConfig;