import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';

const HeaderUtil = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: 20,
      zIndex: 1,
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Search_history')}>
        <Ionicons name="search" size={24} color={theme.iconColor} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderUtil;