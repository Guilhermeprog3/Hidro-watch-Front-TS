import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from '../../context/themecontext';
import { useObject } from '../../hooks/Objectcontext';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type HeaderMeasurementProps = {
  deviceId: string;
  onBackPress: () => void;
};

const HeaderMeasurement: React.FC<HeaderMeasurementProps> = ({ deviceId, onBackPress }) => {
  const { theme } = useTheme();
  const { DeleteObject } = useObject();
  const navigation = useNavigation<NavigationProp<any>>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeletePress = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await DeleteObject(deviceId);
      onBackPress()
    } catch (error) {
      Alert.alert("Erro", "Não foi possível deletar o objeto. Tente novamente.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginTop: 50,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      marginLeft: 8,
      fontFamily: 'Inter-Medium',
    },
    menuOptionsContainer: {
      backgroundColor: theme.navBarBackground,
      borderRadius: 10,
      padding: 8,
      width: 150,
      marginTop: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    menuOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    menuOptionText: {
      fontSize: 15,
      marginLeft: 10,
      fontFamily: 'Inter-Regular',
    },
    menuTrigger: {
      padding: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: theme.gradientStart,
      borderRadius: 16,
      padding: 24,
      width: '85%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 10,
    },
    modalTitle: {
      color: theme.textPrimary,
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      marginBottom: 16,
      textAlign: 'center',
    },
    modalText: {
      color: theme.textSecondary,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 22,
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 6,
    },
    cancelButton: {
      backgroundColor: theme.red,
      borderWidth: 1,
      borderColor: theme.gradientEnd,
    },
    deleteButton: {
      backgroundColor: '#FF3B30',
    },
    buttonText: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
    },
    cancelButtonText: {
      color: theme.textPrimary,
    },
    deleteButtonText: {
      color: 'white',
    },
    icon: {
      marginRight: 8,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.iconColor} />
        <Text style={styles.headerTitle}>VOLTAR</Text>
      </TouchableOpacity>

      <Menu>
        <MenuTrigger customStyles={{ triggerWrapper: styles.menuTrigger }}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.iconColor} />
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: styles.menuOptionsContainer }}>
          <MenuOption onSelect={handleDeletePress}>
            <View style={styles.menuOption}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" style={styles.icon} />
              <Text style={[styles.menuOptionText, { color: '#FF3B30' }]}>Deletar Objeto</Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons 
              name="warning-outline" 
              size={40} 
              color="#FF3B30" 
              style={{ alignSelf: 'center', marginBottom: 12 }} 
            />
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalText}>
              Tem certeza que deseja deletar este objeto permanentemente? Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDelete}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDelete}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, styles.deleteButtonText]}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HeaderMeasurement;
