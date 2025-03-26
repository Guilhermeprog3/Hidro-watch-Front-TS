import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderUser from '../../components/headeruser';
import MenuOptions from '../../components/menuoptionsuser';
import NavBar from '../../components/Navbar';
import { AuthContext } from '../../context/authcontext';
import { useTheme } from '../../context/themecontext';

const UserPage: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      marginTop:60,
      flex: 1,
    },
    navBarContainer: {
      padding: 20,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.content}>
        <HeaderUser user={user} />
        <MenuOptions
          user={user}
          logout={logout}
        />
      </View>

      <View style={styles.navBarContainer}>
        <NavBar />
      </View>
    </LinearGradient>
  );
};

export default UserPage;