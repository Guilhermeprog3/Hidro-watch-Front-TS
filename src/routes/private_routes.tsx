import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Search_favoritePage from '../screens/search_favorite';
import Search_homepage from '../screens/search_home';
import Search_historyPage from '../screens/search_history';
import MeasurementPage from '../screens/measurement';
import Week_page from '../screens/week';
import SettingsPage from '../screens/Settingss';
import QRCodeScanner from '../screens/qr_code';
import RecoverPage from '../screens/recoverpass';
import NewPassword from '../screens/newpassword';
import CodePage from '../screens/codepass';
import BottomRoutes from './bottom_routes';
import AboutScreen from '../screens/about';
import PrivacyPolicyScreen from '../screens/privacy';
import TermsOfUseScreen from '../screens/terms';


const PrivateRoutes = () => {
    const { Navigator, Screen } = createNativeStackNavigator();
    return (
        <Navigator>
            <Screen name="HomeLayout" component={BottomRoutes} options={{ headerShown: false, animation: 'fade'}} />
            <Screen name="Search_home" component={Search_homepage} options={{ headerShown: false,animation: 'fade'}} />
            <Screen name="Search_history" component={Search_historyPage}  options={{ headerShown: false,animation: 'fade'}} />
            <Screen name="Search_favorite" component={Search_favoritePage}  options={{ headerShown: false,animation: 'fade'}} />
            <Screen name="Week" component={Week_page} options={{ headerShown: false,animation: 'fade'}} />
            <Screen name="Measurement" component={MeasurementPage} options={{ headerShown: false,animation: 'fade'}} />
            <Screen name="settings" component={SettingsPage} options={{ headerShown: false,animation: 'fade'}} />
            <Screen name="QRCode" component={QRCodeScanner} options={{headerShown:false,animation: 'fade'}}/>
            <Screen name="Recoverpass" component={RecoverPage} options={{ headerShown: false }} />
            <Screen name="Codepass" component={CodePage} options={{ headerShown: false }} />
            <Screen name="Newpassword" component={NewPassword} options={{ headerShown: false }} />
            <Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
            <Screen name="Privacy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
            <Screen name="Terms" component={TermsOfUseScreen} options={{ headerShown: false }} />
        </Navigator>
    );
};

export default PrivateRoutes;
