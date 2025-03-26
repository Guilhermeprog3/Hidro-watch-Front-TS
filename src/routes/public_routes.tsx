import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import SignUpScreen from '../screens/Sign';
import RecoverPage from '../screens/recoverpass';
import CodePage from '../screens/codepass';
import NewPassword from '../screens/newpassword';

const PublicRoutes = () => {
  const { Navigator, Screen } = createNativeStackNavigator();

  return (
    <Navigator>
      <Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Screen name="Recoverpass" component={RecoverPage} options={{ headerShown: false }} />
      <Screen name="Codepass" component={CodePage} options={{ headerShown: false }} />
      <Screen name="Newpassword" component={NewPassword} options={{ headerShown: false }} />
    </Navigator>
  );
};

export default PublicRoutes;