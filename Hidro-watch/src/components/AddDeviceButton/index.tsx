import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/themecontext';

const AddDeviceButton = ({ onPress }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    addButton: {
      backgroundColor: theme.buttonBackground,
      padding: 15,
      borderRadius: 40,
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 90,
    },
    addButtonText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.addButton}>
      <Text style={styles.addButtonText}>Adicionar um Novo Dispositivo</Text>
    </TouchableOpacity>
  );
};

export default AddDeviceButton;