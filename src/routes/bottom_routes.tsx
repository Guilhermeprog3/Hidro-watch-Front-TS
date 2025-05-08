import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/home';
import HistoryPage from '../screens/history';
import FavoritePage from '../screens/Like';
import UserPage from '../screens/user';
import { useTheme } from '../context/themecontext';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const BottomRoutes = () => {
    const { theme } = useTheme();
    const { Navigator, Screen } = createBottomTabNavigator();
    
    return (
        <Navigator
            screenOptions={{
                tabBarActiveTintColor: theme.buttonBackground,
                tabBarInactiveTintColor: theme.buttonText,
                tabBarStyle: {
                    backgroundColor: theme.gradientStart,
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: -5 },
                    height: 60,
                    paddingBottom: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 55,
                },
                headerShown: false,
            }}
        >
            <Screen 
                name="Home" 
                component={HomePage} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }} 
            />
            <Screen 
                name="Like" 
                component={FavoritePage} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="favorite" color={color} size={size} />
                    ),
                }} 
            />
            <Screen 
                name="History" 
                component={HistoryPage} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time" color={color} size={size} />
                    ),
                }} 
            />
            <Screen 
                name="User" 
                component={UserPage} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" color={color} size={size} />
                    ),
                }} 
            />
        </Navigator>
    );
};

export default BottomRoutes;