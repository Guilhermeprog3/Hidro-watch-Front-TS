import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themecontext';
import HeaderLike from '../../components/headerLike';
import ListLike from '../../components/ListLike';

const FavoritePage = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    decorativeImage: {
      position: 'absolute',
      width: '115%',
      height: 180,
      resizeMode: 'cover',
      marginBottom: 200,
      padding: 0,
      zIndex: 0,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <Image source={require('../../../assets/images/entradaifma.jpeg')} style={styles.decorativeImage} />
      <HeaderLike />
      <ListLike />
    </LinearGradient>
  );
};

export default FavoritePage;