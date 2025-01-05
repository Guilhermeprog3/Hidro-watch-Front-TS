import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/home';
import HistoryPage from '../screens/history';
import Search_favoritePage from '../screens/search_favorite';
import Search_homepage from '../screens/search_home';
import Search_historyPage from '../screens/search_history';
import CreatePage from '../screens/create';
import FavoritePage from '../screens/Like';
import UserPage from '../screens/user';
import MeasurementPage from '../screens/measurement';
import Week_page from '../screens/week';

const PrivateRoutes = () => {
    const { Navigator, Screen } = createNativeStackNavigator();
    return (
        <Navigator>
            
            <Screen name="Home" component={HomePage} options={{ headerShown: false}} />
            <Screen name="Like" component={FavoritePage} options={{ headerShown: false}} />
            <Screen name="History" component={HistoryPage} options={{ headerShown: false}} />
            <Screen name="Search_home" component={Search_homepage} options={{ headerShown: false}} />
            <Screen name="Search_history" component={Search_historyPage}  options={{ headerShown: false}} />
            <Screen name="Search_favorite" component={Search_favoritePage}  options={{ headerShown: false}} />
            <Screen name="Create" component={CreatePage}  options={{ headerShown: false}} />
            <Screen name="User" component={UserPage} options={{ headerShown: false}} />
            <Screen name="Week" component={Week_page} options={{ headerShown: false}} />
            <Screen name="Measurement" component={MeasurementPage} options={{ headerShown: false}} />
            
        </Navigator>
    );
};

export default PrivateRoutes;
