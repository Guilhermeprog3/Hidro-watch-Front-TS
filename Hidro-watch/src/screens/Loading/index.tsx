import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useNavigation, NavigationProp, StackActions } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

const LoadingPage= () => {
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        navigation.dispatch(
          StackActions.replace('Login')
        );
      }
    }
    prepare();
  }, [navigation]);

  return (
    <LinearGradient colors={["#180041", "#000481", "#5C00FC"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logo_hidro.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>HYDROWATCH</Text>
        </View>
        <Text style={styles.subtitle}>Porque cada gota importa</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'serif',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 8,
  },
  logo: {
    width: 50,
    height: 50,
  },
});

export default LoadingPage;
