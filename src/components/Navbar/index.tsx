import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';

const NavBar = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      backgroundColor: theme.navBarBackground,
      borderRadius: 0,
      position: 'absolute',
      bottom: 0,
      width: '110%',
      alignSelf: 'center',
    },
    navItem: {
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.navBar}>
      <View style={styles.navItem}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color={theme.navBarIconColor} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('History')}>
        <Ionicons name="time" size={24} color={theme.navBarIconColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Like')}>
        <Ionicons name="heart" size={24} color={theme.navBarIconColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('User')}>
        <Ionicons name="person" size={24} color={theme.navBarIconColor} />
      </TouchableOpacity>
    </View>
  );
};

export default NavBar;