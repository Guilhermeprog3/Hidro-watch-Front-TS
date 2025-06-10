import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import SignUpScreen from '../screens/SignUp';
import VerifySignUpCodeScreen from '../screens/VerifySignUpCode';
import CompleteSignUpScreen from '../screens/Sign';
import RecoverPage from '../screens/recoverpass';
import CodePage from '../screens/codepass';
import NewPassword from '../screens/newpassword';
import TermsOfUseScreen from '../screens/terms';

const PublicRoutes = () => {
  const { Navigator, Screen } = createNativeStackNavigator();

  return (
    <Navigator>
      <Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Screen name="VerifySignUpCode" component={VerifySignUpCodeScreen} options={{ headerShown: false }} />
      <Screen name="CompleteSignUp" component={CompleteSignUpScreen} options={{ headerShown: false }} />
      <Screen name="Recoverpass" component={RecoverPage} options={{ headerShown: false }} />
      <Screen name="Codepass" component={CodePage} options={{ headerShown: false }} />
      <Screen name="Newpassword" component={NewPassword} options={{ headerShown: false }} />
      <Screen name="Terms" component={TermsOfUseScreen} options={{ headerShown: false }} />
    </Navigator>
  );
};

export default PublicRoutes;