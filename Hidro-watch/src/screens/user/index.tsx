import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../hooks/Auth';

type Order = {
  id: string;
  title: string;
};

const UserPage = () => {

  const navigation = useNavigation<NavigationProp<any>>();
  const { logout, deleteUser } = useAuth();

  return (
    <LinearGradient colors={['#01002C', '#000481']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image source={require('../../../assets/images/profilePicture.jpeg')} style={styles.profilePicture} />
          <Text style={styles.profileName}>Guilherme Silva Rios</Text>
          <Text style={styles.profileEmail}>GuiRios@gmail.com</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="moon" size={24} color="white" />
          <Text style={styles.menuItemText}>Dark Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="person" size={24} color="white" />
          <Text style={styles.menuItemText}>Informações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="settings-outline" size={24} color="white" />
          <Text style={styles.menuItemText}>Configuração</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Ionicons name="information-circle-outline" size={24} color="white" />
          <Text style={styles.menuItemText}>Sobre</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={deleteUser}>
          <Ionicons name="trash-outline" size={24} color="white" />
          <Text style={styles.menuItemText}>Deletar Conta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={logout}>
          <Ionicons name="exit-outline" size={24} color="white" />
          <Text style={styles.menuItemText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navBar}>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.activeDot} />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Ionicons name="time" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
          <Ionicons name="heart" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
          <Ionicons name="person" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
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
    color: 'white',
  },
  profileEmail: {
    fontSize: 16,
    color: 'white',
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
    color: 'white',
    marginLeft: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#21006E',
    borderRadius: 0,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
  },
  navItem: {
    alignItems: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
    marginTop: 2,
  },
});

export default UserPage;
