import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authContext';

const HistoryPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { getUserObjects } = useContext(AuthContext);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDevices() {
      const response = await getUserObjects();
      if (response) {
        setDevices(response);
      }
    }

    fetchDevices();
  }, []);

  return (
    <LinearGradient colors={["#01002C", "#000481"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Search_history')}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Image source={require('../../../assets/images/decorativeImage.png')} style={styles.decorativeImage} />
      
      <Text style={styles.sectionTitle}>Dispositivos Registrados</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.deviceContainer}>
            <View>
              <Text style={styles.deviceName}>{item.tittle}</Text>
              <Text style={styles.deviceLocation}>{item.location}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Week')} style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Historico</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.navBar}>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  decorativeImage: {
    position: 'absolute',
    width: '110%',
    height: 180,
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
  detailsButton: {
    backgroundColor: '#00bfa5',
    padding: 10,
    borderRadius: 5,
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
});

export default HistoryPage;
