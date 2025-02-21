import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Primary_theme, Secondary_theme, Tertiary_theme } from '../../colors/color';

const UserPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user, logout, deleteUser } = useContext(AuthContext);

  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);

  useEffect(() => {
    const loadMode = async () => {
      const savedMode = await AsyncStorage.getItem('userMode');
      if (savedMode) {
        setMode(savedMode);
        updateColors(savedMode);
      }
    };
    loadMode();
  }, []);

  const updateColors = (mode: string) => {
    if (mode === 'Hidro') {
      setColors(Primary_theme);
    } else if (mode === 'Light') {
      setColors(Secondary_theme);
    } else {
      setColors(Tertiary_theme);
    }
  };

  const toggleMode = async () => {
    let newMode;
    if (mode === 'Hidro') {
      newMode = 'Light';
    } else if (mode === 'Light') {
      newMode = 'Dark';
    } else {
      newMode = 'Hidro';
    }
    setMode(newMode);
    updateColors(newMode);
    await AsyncStorage.setItem('userMode', newMode);
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza de que deseja deletar sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: deleteUser
        }
      ]
    );
  };

  const confirmLogout = () => {
    Alert.alert(
      "Confirmar Saida",
      "Você tem certeza de que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: logout
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
    },
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
      color: colors.textPrimary,
    },
    profileEmail: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    menuContainer: {
      marginTop: 20,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
    },
    menuItemText: {
      fontSize: 18,
      color: colors.textPrimary,
      marginLeft: 10,
      flex: 1,
    },
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      backgroundColor: colors.navBarBackground,
      borderRadius: 0,
      position: 'absolute',
      bottom: 0,
      width: '100%',
      alignSelf: 'center',
    },
    navItem: {
      alignItems: 'center',
    },
  });

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image source={require('../../../assets/images/profilePicture.jpeg')} style={styles.profilePicture} />
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuItem} onPress={toggleMode}>
        <Ionicons 
          name={
          mode === 'Hidro' ? 'sunny' :
          mode === 'Light' ? 'moon' :
          'water'
          }
          size={24}
          color={colors.iconColor} 
          />
        <Text style={styles.menuItemText}>
          {mode === 'Hidro' ? 'Light Mode' : mode === 'Light' ? 'Dark Mode' : 'Hidro Mode'}
        </Text>
      <Ionicons name="chevron-forward-outline" size={24} color={colors.iconColor} />
      </TouchableOpacity>


        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="person" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Informações</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="settings-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Configuração</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="information-circle-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Sobre</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={confirmDeleteAccount}>
          <Ionicons name="trash-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Deletar Conta</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={confirmLogout}>
          <Ionicons name="exit-outline" size={24} color={colors.iconColor} />
          <Text style={styles.menuItemText}>Sair</Text>
          <Ionicons name="chevron-forward-outline" size={24} color={colors.iconColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.navBar}>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color={colors.navBarIconColor} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Ionicons name="time" size={24} color={colors.navBarIconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Like')}>
          <Ionicons name="heart" size={24} color={colors.navBarIconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
          <Ionicons name="person" size={24} color={colors.navBarIconColor} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default UserPage;
