import HeaderUser from '../../components/headeruser';
import MenuOptions from '../../components/menuoptionsuser';
import NavBar from '../../components/Navbar';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../../context/authcontext';
import { UserContext } from '../../context/usercontext';
import { useTheme } from '../../context/themecontext';


const UserPage: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { deleteUser,forgotPassword } = useContext(UserContext);
  const { theme } = useTheme();

  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <HeaderUser user={user} />
      <MenuOptions
        user={user}
        logout={logout}
        deleteUser={deleteUser}
        forgotPassword={forgotPassword}
      />
      <NavBar />
      
    </LinearGradient>
  );
};

export default UserPage;