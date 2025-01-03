import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
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
  { id: '8', name: 'Bebedouro', location: 'IFMA Campus Timon' },
];

const SearchHomePage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation<NavigationProp<any>>();

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient colors={["#01002C", "#000481"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Pesquisar"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      <FlatList
        data={filteredDevices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceContainer}>
            <View>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceLocation}>{item.location}</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Detalhes</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Ionicons name="time" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Like')}>
          <Ionicons name="heart" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#01002C',
    borderRadius: 10,
    padding: 5,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    color: '#000',
    marginLeft: 10,
    marginRight: 10,
  },
  deviceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
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
  detailsButton: {
    backgroundColor: '#00bfa5',
    padding: 10,
    borderRadius: 5,
    marginLeft: 'auto',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
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

export default SearchHomePage;
