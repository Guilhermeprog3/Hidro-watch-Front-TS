import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useObject } from '../../hooks/Objectcontext';
import { useTheme } from '../../context/themecontext';

const SearchHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { getUserObjects } = useObject();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();
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
      marginLeft: 'auto',
    },
    detailsButtonText: {
      color: theme.buttonText,
      fontSize: 14,
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
          <Ionicons name="cube-outline" size={50} color="rgba(255, 255, 255, 0.5)" />
          <Text style={styles.emptyText}>
            Nenhum dispositivo cadastrado
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
            placeholder="Pesquisar dispositivos..."
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
              <TouchableOpacity 
                onPress={() => navigation.navigate('Week', { objectId: item.id })} 
                style={styles.detailsButton}
              >
                <Text style={styles.detailsButtonText}>Histórico</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </LinearGradient>
  );
};

export default SearchHistoryPage;