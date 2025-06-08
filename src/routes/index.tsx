import React, { useEffect, useRef } from 'react';
import { NavigationContainer, useNavigation, NavigationProp } from '@react-navigation/native';
import PublicRoutes from './public_routes';
import PrivateRoutes from './private_routes';
import { useAuth } from '../hooks/Auth';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-notifications';

const RoutesContent = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const notificationListener = useRef<Subscription | null>(null);
  const responseListener = useRef<Subscription | null>(null);

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

  return user?.token ? <PrivateRoutes /> : <PublicRoutes />;
};

const Routes = () => {
  return (
    <NavigationContainer>
      <RoutesContent />
    </NavigationContainer>
  );
}

export default Routes;