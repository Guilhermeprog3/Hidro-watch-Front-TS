import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Loading_page from '../screens/Loading';
import LoginScreen from '../screens/Login';
import SignUpScreen from '../screens/Sign';

const PublicRoutes = () => {
    const {Navigator,Screen} = createNativeStackNavigator()
    return ( 
        <Navigator>
            {/* <Screen name = "Splash" component={Loading_page}></Screen> */}
            <Screen name = "Login" component={LoginScreen}></Screen>
            <Screen name = "SignUp" component={SignUpScreen}></Screen>

        </Navigator>
     );
}
 
export default PublicRoutes;