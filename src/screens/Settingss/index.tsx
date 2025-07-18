import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';
import HeaderBack from '../../components/headerBack';
import MenuOptionsConfig from '../../components/menuoptionsconfig';
import { AuthContext } from '../../context/authcontext';
import { UserContext } from '../../context/usercontext';

const SettingsPage: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { deleteUser, forgotPassword } = useContext(UserContext);
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <HeaderBack onBackPress={() => navigation.goBack()} />
      <MenuOptionsConfig 
        user={user} 
        deleteUser={deleteUser} 
        forgotPassword={forgotPassword} 
        logout={logout} 
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão: 1.0</Text>
      </View>
    </LinearGradient>
  );
};

export default SettingsPage;