import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../context/themecontext';

interface User {
  name?: string;
  email?: string;
}

interface HeaderProps {
  user: User | null;
}

const HeaderUser: React.FC<HeaderProps> = ({ user }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    header: {
      paddingBottom: 30,
      alignItems: 'center',
    },
    profileSection: {
      alignItems: 'center',
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    profileEmail: {
      fontSize: 16,
      color: theme.textPrimary,
    },
  });

  if (!user) {
    return (
      <View style={styles.header}>
        <Text style={styles.profileName}>Usuário não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.profileSection}>
        <Image source={require('../../../assets/images/profilePicture.jpeg')} style={styles.profilePicture} />
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>
    </View>
  );
};

export default HeaderUser;