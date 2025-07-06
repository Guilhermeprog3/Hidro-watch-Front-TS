import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themecontext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MeasurementContext } from '../../context/measurementscontext';
import { Ionicons } from '@expo/vector-icons';

type InfoBoxesProps = {
  deviceId: string;
};

const InfoBoxes: React.FC<InfoBoxesProps> = ({ deviceId }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const { getLatestMeasurement } = useContext(MeasurementContext);
  const [lastMeasurementDate, setLastMeasurementDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const latestMeasurement = await getLatestMeasurement(deviceId);

        if (latestMeasurement?.createdAt) {
          const formattedDate = new Date(latestMeasurement.createdAt).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          setLastMeasurementDate(formattedDate);
        } else {
          setLastMeasurementDate('Nenhuma medição encontrada');
        }
      } catch (error) {
        setLastMeasurementDate('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [deviceId]);

  const handleLearnMore = () => {
    navigation.navigate('Measurement', { deviceId: deviceId });
  };

  const getGradientColors = (): readonly [ColorValue, ColorValue] => {
    return [theme.primaryLight, theme.gradientEnd] as const;
  };

  const styles = StyleSheet.create({
    container: {
      width: '92%',
      alignSelf: 'center',
      marginTop:15
    },
    card: {
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 6,
    },
    gradientContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    measurementContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 12,
    },
    textContainer: {
      flexShrink: 1, 
    },
    lastMeasurementLabel: {
      color: theme.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    lastMeasurementDate: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: 'bold',
    },
    detailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.buttonBackground,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 20,
    },
    detailsButtonText: {
      color: theme.buttonText,
      fontSize: 14,
      fontWeight: 'bold',
      marginRight: 6,
    },
    loadingContainer: {
      height: 70, 
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      width: '92%',
      alignSelf: 'center',
      marginBottom: 20,
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={theme.iconColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LinearGradient
          colors={getGradientColors()}
          style={styles.gradientContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.measurementContainer}>
            <Ionicons name="time-outline" size={24} color={theme.iconColor} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.lastMeasurementLabel}>ÚLTIMA MEDIÇÃO</Text>
              <Text style={styles.lastMeasurementDate}>{lastMeasurementDate}</Text>
            </View>
          </View>
          

        </LinearGradient>
      </View>
    </View>
  );
};

export default InfoBoxes;