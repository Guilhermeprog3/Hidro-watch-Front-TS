import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import { ObjectContext } from '../../context/objectcontext';
import { useObject } from '../../hooks/Objectcontext';
import { Measurementobject } from '../../hooks/measurements';

interface RouteParams {
  deviceId: string;
}

const DetailsPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const { deviceId } = route.params as RouteParams;
  const { postUserObject } = useContext(ObjectContext);
  const { GetObjectforId } = useObject();
  const { getLatestMeasurement } = Measurementobject();
  const [Tittle, setTittle] = useState<string>('');
  const [Location, setLocation] = useState<string>('');
  const [lastMeasurementDate, setLastMeasurementDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const objectData = await GetObjectforId(deviceId);
        if (objectData) {
          setTittle(objectData.tittle);
          setLocation(objectData.location);
        }

        const latestMeasurement = await getLatestMeasurement(deviceId);
        if (latestMeasurement) {
          setLastMeasurementDate(new Date(latestMeasurement.createdAt).toLocaleString());
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deviceId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#01002C", "#000481"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VOLTAR</Text>
      </View>
      <Text style={styles.sectionTitle}>DETALHES DA MEDIÇÃO</Text>

      <View style={styles.form}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Nome da medição:</Text>
          <Text style={styles.infoText}>{Tittle}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Localização:</Text>
          <Text style={styles.infoText}>{Location}</Text>
        </View>
      </View>
      <Text style={styles.connectedText}>DISPOSITIVO CONECTADO</Text>
      <Text style={styles.sectionTitle}>Última Medição: {lastMeasurementDate}</Text>
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
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  form: {
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 25,
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 5,
  },
  infoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  connectedText: {
    color: 'green',
    fontSize: 28,
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#01002C',
  },
});

export default DetailsPage;