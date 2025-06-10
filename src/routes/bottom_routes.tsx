import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/home';
import HistoryPage from '../screens/history';
import FavoritePage from '../screens/Like';
import UserPage from '../screens/user';
import { useTheme } from '../context/themecontext';
import { Ionicons } from '@expo/vector-icons';

const BottomRoutes = () => {
    const { theme } = useTheme();
    const { Navigator, Screen } = createBottomTabNavigator();
    
    const styles = StyleSheet.create({
        tabBar: {
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 30 : 20,
            left: 20,
            right: 20,
            borderRadius: 20,
            height: 65,
            backgroundColor: theme.gradientStart,
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        },
        iconContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            width: '100%',
        },

        activeIcon: {
            transform: [{ scale: 1.2 }, { translateY: -5 }],
        }
    });

    const getIconName = (routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';
        switch (routeName) {
            case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
            case 'Like':
                iconName = focused ? 'heart' : 'heart-outline';
                break;
            case 'History':
                iconName = focused ? 'time' : 'time-outline';
                break;
            case 'User':
                iconName = focused ? 'person' : 'person-outline';
                break;
        }
        return iconName;
    };

    return (
        <Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: theme.buttonBackground,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarIcon: ({ color, size, focused }) => {
                    const iconName = getIconName(route.name, focused);
                    return (
                        <View style={styles.iconContainer}>
                            <Ionicons 
                                name={iconName} 
                                color={color} 
                                size={focused ? size + 2 : size} 
                                style={[ focused && styles.activeIcon]}
                            />
                        </View>
                    );
                },
            })}
        >
            <Screen name="Home" component={HomePage} />
            <Screen name="Like" component={FavoritePage} />
            <Screen name="History" component={HistoryPage} />
            <Screen name="User" component={UserPage} />
        </Navigator>
    );
};

export default BottomRoutes;
