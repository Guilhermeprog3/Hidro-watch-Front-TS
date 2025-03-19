import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useObject } from '../../hooks/Objectcontext';
import { useTheme } from '../../context/themecontext';

const HistoryPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { getUserObjects } = useObject();
  const [devices, setDevices] = useState<any[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchDevices() {
      const response = await getUserObjects();
      if (response) {
        setDevices(response);
      }
    }

    fetchDevices();
  }, []);

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
      width: '115%',
      height: 180,
      resizeMode: 'cover',
      marginBottom: 200,
      padding: 0,
      zIndex: 0,
    },
    sectionTitle: {
      color: theme.textPrimary,
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
      color: theme.textPrimary,
    },
    deviceLocation: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    detailsButton: {
      backgroundColor: theme.buttonBackground,
      padding: 10,
      borderRadius: 5,
    },
    detailsButtonText: {
      color: theme.buttonText,
      fontSize: 14,
    },
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      backgroundColor: theme.navBarBackground,
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

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Search_history')}>
          <Ionicons name="search" size={24} color={theme.iconColor} />
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
            <TouchableOpacity onPress={() => navigation.navigate('Week', { objectId: item.id })} style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Histórico</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.navBar}>
        <View style={styles.navItem}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={24} color={theme.navBarIconColor} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Ionicons name="time" size={24} color={theme.navBarIconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Like')}>
          <Ionicons name="heart" size={24} color={theme.navBarIconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('User')}>
          <Ionicons name="person" size={24} color={theme.navBarIconColor} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default HistoryPage;