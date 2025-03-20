import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../context/themecontext';

const HeaderHidro = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 0,
    },
    logo: {
      width: 50,
      height: 50,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginLeft: 10,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textPrimary,
      marginBottom: 20,
      marginLeft: 70,
    },
  });

  return (
    <View>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/logo_hidro.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>HYDROWATCH</Text>
      </View>
      <Text style={styles.subtitle}>Porque cada gota importa</Text>
    </View>
  );
};

export default HeaderHidro;