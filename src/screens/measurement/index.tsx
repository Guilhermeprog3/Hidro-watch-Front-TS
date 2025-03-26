import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import { Measurementobject } from '../../hooks/measurements';
import { useObject } from '../../hooks/Objectcontext';
import { useTheme } from '../../context/themecontext';
import HeaderMeasurement from '../../components/headermeasurements';
import MeasurementBody from '../../components/measurementsbody';
import DeviceInfo from '../../components/deviceinfo';

interface RouteParams {
  deviceId: string;
}

const MeasurementPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const { deviceId } = route.params as RouteParams;
  const { getLatestMeasurement } = Measurementobject();
  const { GetObjectforId, DeleteObject } = useObject();
  const { theme } = useTheme();
  const [measurement, setMeasurement] = useState({
    ph: 0,
    turbidity: 0,
    temperature: 0,
    averageMeasurement: 0,
  });
  const [objectName, setObjectName] = useState('Carregando...');
  const [lastMeasurementDate, setLastMeasurementDate] = useState<string>('Nenhuma medição');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [objectData, latestMeasurement] = await Promise.all([
          GetObjectforId(deviceId),
          getLatestMeasurement(deviceId),
        ]);

        if (objectData) {
          setObjectName(objectData.tittle);
          setIsConnected(objectData.connected);
        }

        if (latestMeasurement) {
          setMeasurement({
            ph: latestMeasurement.ph || 0,
            turbidity: latestMeasurement.turbidity || 0,
            temperature: latestMeasurement.temperature || 0,
            averageMeasurement: latestMeasurement.averageMeasurement || 0,
          });
          setLastMeasurementDate(new Date(latestMeasurement.createdAt).toLocaleString());
        } else {
          setMeasurement({
            ph: 0,
            turbidity: 0,
            temperature: 0,
            averageMeasurement: 0,
          });
          setLastMeasurementDate('Nenhuma medição');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [deviceId]);

  const handleDelete = async () => {
    Alert.alert(
      "Deletar Objeto",
      "Tem certeza que deseja deletar este objeto?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Deletar", 
          onPress: async () => {
            await DeleteObject(deviceId);
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.gradientStart,
      paddingHorizontal: 20,
    },
    scrollContent: {
      paddingVertical: 20,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <HeaderMeasurement onBackPress={() => navigation.goBack()} onDelete={handleDelete} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MeasurementBody
          objectName={objectName}
          averageMeasurement={measurement.averageMeasurement}
          ph={measurement.ph}
          temperature={measurement.temperature}
          turbidity={measurement.turbidity}
        />
        <DeviceInfo isConnected={isConnected} lastMeasurementDate={lastMeasurementDate} />
      </ScrollView>
    </LinearGradient>
  );
};

export default MeasurementPage;