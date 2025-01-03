import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type Device = {
  id: string;
  name: string;
  location: string;
};

const devices: Device[] = [
  { id: '1', name: 'Bebedouro', location: 'IFMA Campus Timon' },
  { id: '2', name: 'Bebedouro', location: 'IFMA Campus Timon' },
  { id: '3', name: 'Bebedouro', location: 'IFMA Campus Timon' },
  { id: '4', name: 'Bebedouro', location: 'IFMA Campus Timon' },
  { id: '5', name: 'Bebedouro', location: 'IFMA Campus Timon' },
  { id: '6', name: 'Bebedouro', location: 'IFMA Campus Timon' },
  { id: '7', name: 'Bebedouro', location: 'IFMA Campus Timon' },
];

const FavoritePage = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <LinearGradient colors={["#01002C", "#000481"]} style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../../assets/images/profilePicture.jpeg')} style={styles.profilePicture} />
        <TouchableOpacity onPress={() => navigation.navigate('Search_favorite')}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Image source={require('../../../assets/images/decorativeImage.png')} style={styles.decorativeImage} />
      
      <Text style={styles.sectionTitle}>Dispositivos Registrados</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceContainer}>
            <View>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceLocation}>{item.location}</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
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
                    <TouchableOpacity onPress={() => navigation.navigate('Like')}>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: 1,
  },
  decorativeImage: {
    position: 'absolute',
    width: '110%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 200,
    padding: 0,
    zIndex: 0,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 140,
  },
  deviceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  deviceLocation: {
    fontSize: 14,
    color: '#a9a9a9',
  },
  favoriteButton: {
    padding: 10,
    borderRadius: 5,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#21006E',
    borderRadius: 0,
    position: 'absolute',
    bottom: 0,
    width: '110%',
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

export default FavoritePage;
