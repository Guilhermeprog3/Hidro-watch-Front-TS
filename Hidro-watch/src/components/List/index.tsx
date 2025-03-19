import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';

const DeviceList = ({ devices, favorites, toggleFavorite, navigation }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
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
      marginRight: 10,
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
  });

  return (
    <FlatList
      data={devices}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.deviceContainer}>
          <View>
            <Text style={styles.deviceName}>{item.tittle}</Text>
            <Text style={styles.deviceLocation}>{item.location}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item.id)}
            >
              <Ionicons
                name={favorites.includes(item.id) ? "heart" : "heart-outline"}
                size={24}
                color={favorites.includes(item.id) ? theme.red : theme.iconColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Measurement', { deviceId: item.id })}
              style={styles.detailsButton}
            >
              <Text style={styles.detailsButtonText}>Detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

export default DeviceList;