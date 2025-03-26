import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from '../../context/themecontext';

type HeaderMeasurementProps = {
  onBackPress: () => void;
  onDelete: () => void;
};

const HeaderMeasurement: React.FC<HeaderMeasurementProps> = ({ onBackPress, onDelete }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 40,
      marginTop: 20,
    },
    headerTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      marginLeft: 8,
    },
    menuOptionsContainer: {
      backgroundColor: theme.navBarBackground,
      borderRadius: 10,
      padding: 10,
      width: 100,
      marginTop: 40,
    },
    menuOptionText: {
      color: theme.textPrimary,
      fontSize: 10,
      padding: 10,
    },
    menuTrigger: {
      padding: 10,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="arrow-back" size={24} color={theme.iconColor} />
        <Text style={styles.headerTitle}>VOLTAR</Text>
      </TouchableOpacity>

      <Menu>
        <MenuTrigger customStyles={{ triggerWrapper: styles.menuTrigger }}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.iconColor} />
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: styles.menuOptionsContainer }}>
          <MenuOption onSelect={onDelete}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="trash" size={20} color="#FF4444" />
              <Text style={[styles.menuOptionText, { color: '#FF4444' }]}> Deletar</Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default HeaderMeasurement;