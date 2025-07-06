import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions
} from 'react-native';
import { useTheme } from '../../context/themecontext';

const { width } = Dimensions.get('window');

const HeaderHidro = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 20,
      paddingHorizontal: 16,
      width: '100%',
    },
    headerContent: {
      alignItems: 'center',
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      backgroundColor: 'transparent',
      borderRadius: 30,
      padding: 5,
      position: 'relative',
    },
    logo: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    titleContainer: {
      marginLeft: 15,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.textPrimary,
      letterSpacing: 1.5,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    subtitleContainer: {
      marginTop: 8,
      alignItems: 'center',
      width: '100%',
    },
    subtitleBackground: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textPrimary,
      fontStyle: 'italic',
      letterSpacing: 0.5,
    },
    divider: {
      height: 2,
      width: width * 0.7,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      marginTop: 20,
      borderRadius: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/logo_hidro.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>HIDROWATCH</Text>
          </View>
        </View>
        
        <View style={styles.subtitleContainer}>
          <View style={styles.subtitleBackground}>
            <Text style={styles.subtitle}>Porque cada gota importa</Text>
          </View>
          
          <View style={styles.divider} />
        </View>
      </View>
    </View>
  );
};

export default HeaderHidro;