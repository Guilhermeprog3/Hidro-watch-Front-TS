import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../context/themecontext';
import { Measurementobject } from '../../hooks/measurements';
import { useObject } from '../../hooks/Objectcontext';

type MeasurementBodyProps = {
  deviceId: string;
};

const MeasurementBody: React.FC<MeasurementBodyProps> = ({ deviceId }) => {
  const { theme } = useTheme();
  const { getLatestMeasurement } = Measurementobject();
  const { GetObjectforId } = useObject();
  const [isLoading, setIsLoading] = useState(true);
  const [objectName, setObjectName] = useState('');
  const [measurement, setMeasurement] = useState({
    ph: 0,
    turbidity: 0,
    temperature: 0,
    averageMeasurement: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [objectData, latestMeasurement] = await Promise.all([
          GetObjectforId(deviceId),
          getLatestMeasurement(deviceId),
        ]);

        if (objectData) {
          setObjectName(objectData.tittle || 'Dispositivo sem nome');
        }

        if (latestMeasurement) {
          setMeasurement({
            ph: latestMeasurement.ph || 0,
            turbidity: latestMeasurement.turbidity || 0,
            temperature: latestMeasurement.temperature || 0,
            averageMeasurement: latestMeasurement.averageMeasurement || 0,
          });
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do dispositivo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [deviceId]);

  const roundToNearestHalf = (value: number) => {
    return Math.round(value * 2) / 2;
  };

  const getBackgroundColor = (result: number) => {
    if (result <= 2) return 'rgba(207, 6, 6, 0.76)';
    if (result <= 4) return 'rgba(180, 177, 6, 0.8)';
    if (result <= 8) return 'rgba(8, 175, 19, 0.8)';
    if (result <= 10) return 'rgba(7, 18, 170, 0.8)';
    if (result <= 13) return 'rgba(2, 4, 81, 0.8)';
    return 'rgba(118, 7, 165, 0.8)';
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 30,
    },
    headerText: {
      color: theme.textPrimary,
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'Inter-Bold',
      marginBottom: 5,
    },
    headerSubText: {
      color: theme.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 25,
      fontFamily: 'Inter-Regular',
    },
    circle: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: theme.navBarBackground,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 30,
      borderWidth: 3,
      borderColor: theme.secondary,
    },
    circleText: {
      color: theme.textPrimary,
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'Inter-Bold',
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      fontFamily: 'Inter-SemiBold',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    measurementBox: {
      borderRadius: 12,
      padding: 20,
      width: '48%',
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    measurementLabel: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      fontFamily: 'Inter-Medium',
      textAlign: 'center',
    },
    measurementValue: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: 'Inter-Bold',
    },
    loadingContainer: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.iconColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{objectName}</Text>
      <Text style={styles.headerSubText}>Max: 14   Min: 6</Text>

      <View style={styles.circle}>
        <Text style={styles.circleText}>{roundToNearestHalf(measurement.averageMeasurement)} MD</Text>
      </View>

      <Text style={styles.sectionTitle}>MEDIÇÕES</Text>

      <View style={styles.row}>
        <View style={[styles.measurementBox, { backgroundColor: getBackgroundColor(measurement.ph) }]}>
          <Text style={styles.measurementLabel}>PH</Text>
          <Text style={styles.measurementValue}>{measurement.ph}</Text>
        </View>
        <View style={[styles.measurementBox, { backgroundColor: getBackgroundColor(measurement.temperature) }]}>
          <Text style={styles.measurementLabel}>Temperatura (°C)</Text>
          <Text style={styles.measurementValue}>{measurement.temperature}°</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.measurementBox, { backgroundColor: getBackgroundColor(measurement.turbidity) }]}>
          <Text style={styles.measurementLabel}>TURBIDEZ (NTU)</Text>
          <Text style={styles.measurementValue}>{measurement.turbidity}</Text>
        </View>
        <View style={[styles.measurementBox, { backgroundColor: getBackgroundColor(measurement.averageMeasurement) }]}>
          <Text style={styles.measurementLabel}>Média</Text>
          <Text style={styles.measurementValue}>{roundToNearestHalf(measurement.averageMeasurement)}</Text>
        </View>
      </View>
    </View>
  );
};

export default MeasurementBody;