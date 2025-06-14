import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { useObject } from '../../hooks/Objectcontext';
import { useTheme } from '../../context/themecontext';
import { Measurementobject } from '../../hooks/measurements';

type Device = {
  id: string;
  tittle: string;
  location: string;
  averageMeasurement: number;
};

type DeviceCardProps = {
    device: Device;
    onNavigate: (deviceId: string) => void;
    theme: any; 
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onNavigate, theme }) => {
    const isAboveAverage = device.averageMeasurement > 10;
    const statusColor = isAboveAverage ? theme.secondary : '#FFC107';

    const styles = StyleSheet.create({
        deviceContainer: {
          backgroundColor: theme.primaryLight,
          borderRadius: 15,
          padding: 20,
          marginBottom: 15,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
        },
        deviceInfoContainer: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        },
        statusIndicator: {
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 15,
        },
        textContainer: {
          flex: 1,
        },
        deviceName: {
          fontSize: 17,
          fontWeight: '600',
          color: theme.textPrimary,
        },
        deviceLocation: {
          fontSize: 14,
          color: theme.textSecondary,
          marginTop: 2,
        },
        historyButton: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
            backgroundColor: theme.buttonBackground,
            marginLeft: 10,
        },
        historyButtonText: {
            color: theme.buttonText,
            fontSize: 14,
            fontWeight: 'bold',
        }
    });

    return (
        <View style={styles.deviceContainer}>
            <View style={styles.deviceInfoContainer}>
                <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
                <Ionicons name="water" size={22} color={theme.buttonText} />
                </View>
                <View style={styles.textContainer}>
                <Text style={styles.deviceName} numberOfLines={1}>{device.tittle}</Text>
                <Text style={styles.deviceLocation} numberOfLines={1}>{device.location}</Text>
                </View>
            </View>
            <TouchableOpacity 
                style={styles.historyButton}
                onPress={() => onNavigate(device.id)}
                activeOpacity={0.7}
            >
                <Text style={styles.historyButtonText}>Histórico</Text>
            </TouchableOpacity>
        </View>
    );
};


const SearchHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { getUserObjects } = useObject();
  const { getLatestMeasurement } = Measurementobject();
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      const userDevices = await getUserObjects();
      if (userDevices) {
        const devicesWithMeasurements = await Promise.all(
          userDevices.map(async (device: Device) => {
            const latestMeasurement = await getLatestMeasurement(device.id);
            return {
              ...device,
              averageMeasurement: latestMeasurement?.averageMeasurement || 0,
            };
          })
        );
        setAllDevices(devicesWithMeasurements);
        setFilteredDevices(devicesWithMeasurements);
      }
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error);
    } finally {
      setLoading(false);
    }
  }, [getUserObjects, getLatestMeasurement]);

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [fetchDevices])
  );

  const handleSearch = () => {
    Keyboard.dismiss();
    const results = allDevices.filter(device =>
      device.tittle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDevices(results);
  };

  const handleDevicePress = (deviceId: string) => {
    navigation.navigate('Week', { objectId: deviceId });
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
      marginTop: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      borderWidth: 1,
      borderColor: theme.lightGray
    },
    searchBarContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primaryLight,
      borderRadius: 25,
      paddingLeft: 15,
      height: 50,
      borderWidth: 1,
      borderColor: theme.lightGray
    },
    searchBar: {
      flex: 1,
      height: 50,
      color: theme.textPrimary,
      fontSize: 16,
    },
    searchButton: {
      backgroundColor: theme.buttonBackground,
      height: 50,
      width: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginTop: 16,
    }
  });


  const renderEmptyList = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.buttonBackground} />
          <Text style={styles.emptyText}>Carregando dispositivos...</Text>
        </View>
      );
    }
    
    if (filteredDevices.length === 0 && allDevices.length > 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={50} color={theme.textSecondary} />
          <Text style={styles.emptyText}>
            Nenhum dispositivo encontrado para "{searchQuery}"
          </Text>
        </View>
      );
    }
    
    if (allDevices.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={50} color={theme.textSecondary} />
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
          <TextInput
            style={styles.searchBar}
            placeholder="Pesquisar dispositivos..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
           <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
            activeOpacity={0.7}
           >
            <Ionicons 
              name="search-outline" 
              size={24} 
              color={theme.buttonText} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={theme.buttonBackground} />
        </View>
      ) : (
        <FlatList
          data={filteredDevices}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={renderEmptyList}
          renderItem={({ item }) => <DeviceCard device={item} onNavigate={handleDevicePress} theme={theme} />}
        />
      )}
    </LinearGradient>
  );
};

export default SearchHistoryPage;
