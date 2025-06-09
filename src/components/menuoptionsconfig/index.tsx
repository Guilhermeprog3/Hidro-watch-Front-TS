import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, TouchableWithoutFeedback, Animated } from 'react-native';
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
  deleteUser: () => void;
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [photosEnabled, setPhotosEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
        console.error('Error fetching theme:', error);
      }
    };
    
    fetchTheme();
  }, []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: modalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [modalVisible, animation]);

  const toggleMode = async (newMode: ThemeMode) => {
    setCurrentTheme(newMode);
    toggleTheme(newMode);
    await AsyncStorage.setItem('userMode', newMode);
    
    setTimeout(() => {
      setModalVisible(false);
    }, 300);
  };

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
              navigation.navigate('Login');
            } catch (error) {
              Alert.alert('Erro', 'Ocorreu um erro ao deletar a conta.');
            }
          },
        },
      ],
    );
  };

  const handleForgotPassword = async () => {
    if (user?.user.email) {
      setIsLoading(true);
      try {
        const result = await forgotPassword(user.user.email);
        setIsLoading(false);
          navigation.navigate('Codepass', { email: user.email });
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Erro', 'Ocorreu um erro ao tentar enviar o e-mail de recuperação de senha.');
      }
    } else {
      Alert.alert('Erro', 'E-mail do usuário não encontrado.');
    }
  };

  const getCurrentThemeName = () => {
    return currentTheme;
  };

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
    separator: {
      height: 1,
      backgroundColor: theme.textSecondary,
      marginVertical: 10,
    },
    disabledButton: {
      opacity: 0.5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: theme.primaryLight,
      borderRadius: 15,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      position: 'relative',
    },
    modalHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 20,
      textAlign: 'center',
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
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    },
    themeIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 10,
    },
  });

  return (
    <View style={styles.menuContainer}>
      <Text style={styles.sectionTitle}>Preferências</Text>
      <TouchableOpacity style={styles.menuItem} onPress={() => setModalVisible(true)}>
        <Text style={styles.menuItemText}>Tema</Text>
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
        <Ionicons name="trash-outline" size={24} color={theme.iconColor} />
        <Text style={styles.menuItemText}>Deletar Conta</Text>
        <Ionicons name="chevron-forward-outline" size={24} color={theme.iconColor} />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.modalContent,
                  { transform: [{ translateY: translateY }] }
                ]}
              >
                <Text style={styles.modalHeader}>Selecione o Tema</Text>
                
                <TouchableOpacity 
                  style={[
                    styles.modalOption, 
                    getCurrentThemeName() === 'Hidro' && styles.activeOption
                  ]} 
                  onPress={() => toggleMode('Hidro')}
                >
                  <View style={[styles.themeIndicator]} />
                  <Ionicons name="water" size={24} color="#0088cc" />
                  <Text style={styles.modalOptionText}>Hidro Mode</Text>
                  {getCurrentThemeName() === 'Hidro' && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.iconColor} style={{marginLeft: 'auto'}} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.modalOption, 
                    getCurrentThemeName() === 'Light' && styles.activeOption
                  ]} 
                  onPress={() => toggleMode('Light')}
                >
                  <View style={[styles.themeIndicator]} />
                  <Ionicons name="sunny" size={24} color="#FF9500" />
                  <Text style={styles.modalOptionText}>Light Mode</Text>
                  {getCurrentThemeName() === 'Light' && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.iconColor} style={{marginLeft: 'auto'}} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.modalOption, 
                    getCurrentThemeName() === 'Dark' && styles.activeOption
                  ]} 
                  onPress={() => toggleMode('Dark')}
                >
                  <View style={[styles.themeIndicator]} />
                  <Ionicons name="moon" size={24} color="#8E8E93" />
                  <Text style={styles.modalOptionText}>Dark Mode</Text>
                  {getCurrentThemeName() === 'Dark' && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.iconColor} style={{marginLeft: 'auto'}} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default MenuOptionsConfig;