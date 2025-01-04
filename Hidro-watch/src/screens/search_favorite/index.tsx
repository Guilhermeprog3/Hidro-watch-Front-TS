import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authContext';

const SearchFavoritePage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { getUserObjects } = useContext(AuthContext);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    async function fetchDevices() {
      const response = await getUserObjects();
      if (response) {
        setDevices(response);
      }
      setLoading(false);
    }

    fetchDevices();
  }, []);

  const filteredDevices = devices.filter(device =>
    device.tittle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfa5" />
      </View>
    );
  }

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
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.deviceContainer}>
            <View>
              <Text style={styles.deviceName}>{item.tittle}</Text>
              <Text style={styles.deviceLocation}>{item.location}</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart" size={24} color="red" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#01002C',
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
  favoriteButton: {
    padding: 10,
    borderRadius: 5,
  },
});

export default SearchFavoritePage;
