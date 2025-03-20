import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';

const HeaderLike = () => {
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
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Search_favorite')}>
          <Ionicons name="search" size={24} color={theme.iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderLike;