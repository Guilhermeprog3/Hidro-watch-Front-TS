import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import SignUpScreen from '../screens/Sign';

const PublicRoutes = () => {
    const {Navigator,Screen} = createNativeStackNavigator()
    return ( 
        <Navigator>
            <Screen name = "Login" component={LoginScreen} options={{ headerShown: false}} ></Screen>
            <Screen name = "SignUp" component={SignUpScreen} options={{ headerShown: false}} ></Screen>
        </Navigator>
     );
}
 
export default PublicRoutes;