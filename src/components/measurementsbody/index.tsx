import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ColorValue } from 'react-native';
import { useTheme } from '../../context/themecontext';
import { Measurementobject } from '../../hooks/measurements';
import { useObject } from '../../hooks/Objectcontext';
import { LinearGradient } from 'expo-linear-gradient';

type MeasurementBodyProps = {
  deviceId: string;
};

const MeasurementBody: React.FC<MeasurementBodyProps> = ({ deviceId }) => {
  const { theme } = useTheme();
  const { getLatestMeasurement } = Measurementobject();
  const { GetDeviceforId } = useObject();
  const [isLoading, setIsLoading] = useState(true);
  const [objectName, setObjectName] = useState('');
  const [measurement, setMeasurement] = useState({
    ph: 0,
    turbidity: 0,
    temperature: 0,
    tds: 0,
    averageMeasurement: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [objectData, latestMeasurement] = await Promise.all([
          GetDeviceforId(deviceId),
          getLatestMeasurement(deviceId),
        ]);

        if (objectData) {
          setObjectName(objectData.title || 'Dispositivo sem nome');
        }

        if (latestMeasurement) {
          setMeasurement({
            ph: latestMeasurement.ph || 0,
            turbidity: latestMeasurement.turbidity || 0,
            temperature: latestMeasurement.temperature || 0,
            tds: latestMeasurement.tds || 0,
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

  const getGradientColors = (result: number): readonly [ColorValue, ColorValue] => {
    if (result <= 2) return ['#FF5252', '#D32F2F'] as const;
    if (result <= 4) return ['#FFD54F', '#FFA000'] as const;
    if (result <= 8) return ['#66BB6A', '#388E3C'] as const;
    if (result <= 10) return ['#42A5F5', '#1976D2'] as const;
    return ['#AB47BC', '#7B1FA2'] as const;
  };

  const getMeasurementLabel = (type: string, value: number) => {
    switch (type) {
      case 'ph':
        return `pH ${value < 7 ? '(Ácido)' : value > 7 ? '(Básico)' : '(Neutro)'}`;
      case 'temperature':
        return `Temperatura ${value > 25 ? '(Alta)' : value < 15 ? '(Baixa)' : '(Normal)'}`;
      case 'turbidity':
        return `Turbidez ${value > 5 ? '(Alta)' : '(Normal)'}`;
      case 'tds':
        return `TDS ${value > 500 ? '(Alto)' : '(Normal)'}`;
      default:
        return type;
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
      paddingHorizontal: 16,
    },
    headerText: {
      color: theme.textPrimary,
      fontSize: 24,
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
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      fontFamily: 'Inter-SemiBold',
      textAlign: 'center',
      letterSpacing: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    measurementBox: {
      borderRadius: 16,
      padding: 20,
      width: '48%',
      height: 110,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
      overflow: 'hidden',
      marginTop:10
    },
    measurementLabel: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      fontFamily: 'Inter-Medium',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    measurementValue: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'Inter-Bold',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    measurementUnit: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      opacity: 0.9,
      marginTop: 2,
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

      <Text style={styles.sectionTitle}>PARÂMETROS DE QUALIDADE</Text>

      <View style={styles.row}>
        <LinearGradient
          colors={getGradientColors(measurement.ph)}
          style={styles.measurementBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.measurementLabel}>{getMeasurementLabel('ph', measurement.ph)}</Text>
          <Text style={styles.measurementValue}>{measurement.ph}</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={getGradientColors(measurement.temperature)}
          style={styles.measurementBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.measurementLabel}>{getMeasurementLabel('temperature', measurement.temperature)}</Text>
          <Text style={styles.measurementValue}>{measurement.temperature}°</Text>
        </LinearGradient>
      </View>
      
      <View style={styles.row}>
        <LinearGradient
          colors={getGradientColors(measurement.turbidity)}
          style={styles.measurementBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.measurementLabel}>{getMeasurementLabel('turbidity', measurement.turbidity)}</Text>
          <Text style={styles.measurementValue}>{measurement.turbidity}</Text>
          <Text style={styles.measurementUnit}>uT</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={getGradientColors(measurement.tds)}
          style={styles.measurementBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.measurementLabel}>{getMeasurementLabel('tds', measurement.tds)}</Text>
          <Text style={styles.measurementValue}>{measurement.tds}</Text>
          <Text style={styles.measurementUnit}>mg/L</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

export default MeasurementBody;