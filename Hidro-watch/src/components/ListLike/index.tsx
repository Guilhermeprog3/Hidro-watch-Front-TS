import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';

type Device = {
  id: string;
  tittle: string;
  location: string;
  favorite: boolean;
};

type ListLikeProps = {
  devices: Device[];
  favorites: string[];
  toggleFavorite: (deviceId: string) => void;
};

const ListLike: React.FC<ListLikeProps> = ({ devices, favorites, toggleFavorite }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
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
      fontWeight: 'bold',
    },
  });

  return (
    <View>
      <Text style={styles.sectionTitle}>Dispositivos Favoritos</Text>
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
    </View>
  );
};

export default ListLike;