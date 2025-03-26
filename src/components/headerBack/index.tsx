import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';

interface HeaderProps {
  onBackPress: () => void;
}

const HeaderBack: React.FC<HeaderProps> = ({ onBackPress }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 20,
      paddingHorizontal: 5,
    },
    headerTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="arrow-back" size={24} color={theme.iconColor} />
        <Text style={styles.headerTitle}>VOLTAR</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderBack;