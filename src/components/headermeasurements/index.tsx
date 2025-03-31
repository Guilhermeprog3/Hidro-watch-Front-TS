import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    Alert.alert(
      "Deletar Objeto",
      "Tem certeza que deseja deletar este objeto? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Deletar", 
          onPress: async () => {
            setIsDeleting(true);
            try {
              await DeleteObject(deviceId);
              navigation.navigate('Home');
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar o objeto. Tente novamente.");
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginTop: 20,
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
      width: 120,
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
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    menuOptionText: {
      fontSize: 14,
      marginLeft: 8,
      fontFamily: 'Inter-Regular',
    },
    menuTrigger: {
      padding: 10,
    },
    loadingIndicator: {
      marginRight: 10,
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
          {isDeleting ? (
            <ActivityIndicator size="small" color={theme.iconColor} style={styles.loadingIndicator} />
          ) : (
            <Ionicons name="ellipsis-vertical" size={24} color={theme.iconColor} />
          )}
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: styles.menuOptionsContainer }}>
          <MenuOption onSelect={handleDelete}>
            <View style={styles.menuOption}>
              <Ionicons name="trash-outline" size={18} color="#FF4444" />
              <Text style={[styles.menuOptionText, { color: '#FF4444' }]}>Deletar</Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default HeaderMeasurement;