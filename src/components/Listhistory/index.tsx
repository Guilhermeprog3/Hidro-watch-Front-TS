import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';
import { useObject } from '../../hooks/Objectcontext';

type Device = {
  id: string;
  tittle: string;
  location: string;
};

const ListHistorico: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();
  const { getUserObjects } = useObject();
  const [devices, setDevices] = useState<Device[]>([]);

  const fetchDevices = useCallback(async () => {
    try {
      const response = await getUserObjects();
      if (response) {
        setDevices(response);
      }
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error);
    }
  }, [getUserObjects]);

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [fetchDevices])
  );

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
    <View>
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
            <TouchableOpacity
              onPress={() => navigation.navigate('Week', { objectId: item.id })}
              style={styles.detailsButton}
            >
              <Text style={styles.detailsButtonText}>Histórico</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ListHistorico;