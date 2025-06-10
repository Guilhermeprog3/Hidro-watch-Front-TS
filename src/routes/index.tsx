import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, useNavigation, NavigationProp } from '@react-navigation/native';
import PublicRoutes from './public_routes';
import PrivateRoutes from './private_routes';
import { useAuth } from '../hooks/Auth';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler, Alert, ActivityIndicator, View, Platform, StyleSheet } from 'react-native';
import TermsOfUseModal from '../components/TermsUse';

const RoutesContent = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const notificationListener = useRef<Subscription | null>(null);
  const responseListener = useRef<Subscription | null>(null);

  const [isLoadingTerms, setIsLoadingTerms] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const checkTermsStatus = async () => {
      try {
        const termsAccepted = await AsyncStorage.getItem('@termsAccepted');
        if (termsAccepted !== 'true') {
          setShowTermsModal(true);
        }
      } catch (e) {
        console.error("Failed to fetch terms status from storage", e);
        setShowTermsModal(true); 
      } finally {
        setIsLoadingTerms(false);
      }
    };

    checkTermsStatus();
  }, []);
  
  useEffect(() => {
    if (user) {
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notificação recebida:', notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Interação com notificação:', response);
        const objectId = response.notification.request.content.data.objectId as string | undefined;
        if (objectId) {
            navigation.navigate('Measurement', { deviceId: objectId });
        }
      });

      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      };
    }
  }, [user]);

  const handleAgreeToTerms = async () => {
    try {
      await AsyncStorage.setItem('@termsAccepted', 'true');
      setShowTermsModal(false);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar sua preferência. Tente novamente.');
    }
  };

  const handleDisagreeToTerms = () => {
    Alert.alert(
      'Termos Não Aceitos',
      'Você precisa aceitar os Termos de Uso para utilizar o aplicativo. O aplicativo será fechado.',
      [{ text: 'OK', onPress: () => BackHandler.exitApp() }]
    );
  };
  
  const handleViewFullTerms = () => {
    setShowTermsModal(false);
    navigation.navigate('Terms');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const termsAccepted = await AsyncStorage.getItem('@termsAccepted');
      if (termsAccepted !== 'true') {
        setShowTermsModal(true);
      }
    });
    return unsubscribe;
  }, [navigation]);

  if (isLoadingTerms) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  const renderAppContent = () => (
    <>
      {user?.token ? <PrivateRoutes /> : <PublicRoutes />}
      <TermsOfUseModal
        visible={showTermsModal}
        onAgree={handleAgreeToTerms}
        onDisagree={handleDisagreeToTerms}
        onViewFullTerms={handleViewFullTerms}
      />
    </>
  );

  return renderAppContent();
};

const Routes = () => {
  return (
    <NavigationContainer>
      <RoutesContent />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A1128',
  },
});

export default Routes;