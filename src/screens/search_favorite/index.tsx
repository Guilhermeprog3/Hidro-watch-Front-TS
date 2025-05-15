import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useObject } from '../../hooks/Objectcontext';
import { useTheme } from '../../context/themecontext';

const SearchFavoritePage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { getUserObjects, markFavorite } = useObject();
  const [devices, setDevices] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();

  const fetchDevices = async () => {
    const response = await getUserObjects();
    if (response) {
      const favoriteDevices = response.filter((device: any) => device.favorite);
      setDevices(favoriteDevices);
      setFavorites(favoriteDevices.map((device: any) => device.id));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const toggleFavorite = async (deviceId: string) => {
    const updatedDevices = devices.map((device) => {
      if (device.id === deviceId) {
        device.favorite = !device.favorite;
      }
      return device;
    });
    setDevices(updatedDevices);

    if (favorites.includes(deviceId)) {
      setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== deviceId));
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, deviceId]);
    }

    try {
      await markFavorite(deviceId);
      fetchDevices();
    } catch (error) {
      console.error('Erro ao marcar como favorito:', error);
    }
  };

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
      backgroundColor: theme.gradientEnd,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    searchBarContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 25,
      paddingHorizontal: 15,
      height: 50,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchBar: {
      flex: 1,
      height: 50,
      color: theme.textPrimary,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
    },
    clearButton: {
      padding: 5,
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
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    favoriteButton: {
      padding: 10,
      borderRadius: 5,
      marginRight: 10,
    },
    detailsButton: {
      backgroundColor: theme.buttonBackground,
      padding: 10,
      borderRadius: 5,
    },
    detailsButtonText: {
      color: theme.buttonText,
      fontWeight: 'bold',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
    },
    emptyText: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      textAlign: 'center',
      marginTop: 16,
    },
  });

  const renderEmptyList = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="rgba(255, 255, 255, 0.8)" />
          <Text style={styles.emptyText}>Carregando dispositivos...</Text>
        </View>
      );
    }
    
    if (searchQuery && filteredDevices.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={50} color="rgba(255, 255, 255, 0.5)" />
          <Text style={styles.emptyText}>
            Nenhum dispositivo encontrado para "{searchQuery}"
          </Text>
        </View>
      );
    }
    
    if (devices.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={50} color="rgba(255, 255, 255, 0.5)" />
          <Text style={styles.emptyText}>
            Nenhum dispositivo favorito
          </Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.iconColor} />
        </TouchableOpacity>
        
        <View style={styles.searchBarContainer}>
          <Ionicons 
            name="search-outline" 
            size={20} 
            color={theme.iconColor} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Pesquisar favoritos..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setSearchQuery('')}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color={theme.iconColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {loading ? (
        renderEmptyList()
      ) : (
        <FlatList
          data={filteredDevices}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={renderEmptyList}
          renderItem={({ item }) => (
            <View style={styles.deviceContainer}>
              <View>
                <Text style={styles.deviceName}>{item.tittle}</Text>
                <Text style={styles.deviceLocation}>{item.location || 'Localização não definida'}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(item.id)}
                >
                  <Ionicons
                    name={item.favorite ? "heart" : "heart-outline"}
                    size={24}
                    color={item.favorite ? theme.red : theme.iconColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Measurement', { deviceId: item.id })} style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </LinearGradient>
  );
};

export default SearchFavoritePage;