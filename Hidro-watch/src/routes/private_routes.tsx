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

const PrivateRoutes = () => {
    const { Navigator, Screen } = createNativeStackNavigator();
    return (
        <Navigator>
            <Screen name="Home" component={HomePage} />
            <Screen name="Like" component={FavoritePage} />
            <Screen name="History" component={HistoryPage} />
            <Screen name="Search_home" component={Search_homepage} />
            <Screen name="Search_history" component={Search_historyPage} />
            <Screen name="Search_favorite" component={Search_favoritePage} />
            <Screen name="Create" component={CreatePage} />
            <Screen name="User" component={UserPage}/>
        </Navigator>
    );
};

export default PrivateRoutes;
