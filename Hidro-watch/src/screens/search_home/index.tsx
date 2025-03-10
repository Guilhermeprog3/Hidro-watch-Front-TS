import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Secondary_theme, Primary_theme, Tertiary_theme } from '../../colors/color';
import { useObject } from '../../hooks/objectcontext';

const SearchHomePage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { getUserObjects } = useObject();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);
  const navigation = useNavigation<NavigationProp<any>>();

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.gradientEnd,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      backgroundColor: colors.gradientStart,
      borderRadius: 10,
      padding: 5,
    },
    searchBar: {
      backgroundColor: colors.white,
      borderRadius: 10,
      padding: 10,
      flex: 1,
      color: colors.textPrimary,
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
      color: colors.textPrimary,
    },
    deviceLocation: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    detailsButton: {
      backgroundColor: colors.buttonBackground,
      padding: 10,
      borderRadius: 5,
      marginLeft: 'auto',
    },
    detailsButtonText: {
      color: colors.buttonText,
      fontSize: 14,
    },
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      backgroundColor: colors.navBarBackground,
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

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Pesquisar"
          placeholderTextColor={colors.textSecondary}
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
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Detalhes</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color={colors.navBarIconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Ionicons name="time" size={24} color={colors.navBarIconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Like')}>
          <Ionicons name="heart" size={24} color={colors.navBarIconColor} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person" size={24} color={colors.navBarIconColor} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SearchHomePage;
