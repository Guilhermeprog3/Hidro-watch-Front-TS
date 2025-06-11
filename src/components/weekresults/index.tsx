import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ActivityIndicator, ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';
import { MeasurementContext } from '../../context/measurementscontext';
import { LinearGradient } from 'expo-linear-gradient';

type WeekResultsProps = {
  objectId: string;
};

const WeekResults: React.FC<WeekResultsProps> = ({ objectId }) => {
  const { theme } = useTheme();
  const { getWeeklyAverage } = useContext(MeasurementContext);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [currentStartDay, setCurrentStartDay] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      setIsLoading(true);
      try {
        const data = await getWeeklyAverage(objectId);
        if (data) {
          setWeeklyData(data);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyData();
  }, [objectId]);

  const prevDay = () => {
    setCurrentStartDay((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const nextDay = () => {
    setCurrentStartDay((prev) => (prev === 6 ? 0 : prev + 1));
  };

  const roundToNearestHalf = (value: number) => {
    return Math.round(value * 2) / 2;
  };

  const getGradientColors = (result: number): readonly [ColorValue, ColorValue] => {
    if (result <= 2) return ['#FF5252', '#D32F2F'] as const;
    if (result <= 4) return ['#FFD54F', '#FFA000'] as const;
    if (result <= 8) return ['#66BB6A', '#388E3C'] as const;
    if (result <= 10) return ['#42A5F5', '#1976D2'] as const;
    if (result <= 13) return ['#5C6BC0', '#303F9F'] as const;
    return ['#AB47BC', '#7B1FA2'] as const;
  };

  const getQualityLabel = (value: number): string => {
    if (value <= 2) return 'Ruim';
    if (value <= 4) return 'Regular';
    if (value <= 8) return 'Bom';
    if (value <= 10) return 'Ótimo';
    if (value <= 13) return 'Excelente';
    return 'Superior';
  };

  const getDayResult = (index: number) => {
    const dayIndex = (currentStartDay + index) % 7;
    const dayData = weeklyData[dayIndex];
    if (!dayData) return null;

    const roundedAverage = roundToNearestHalf(dayData.average_measurement);
    const gradientColors = getGradientColors(roundedAverage);
    const qualityLabel = getQualityLabel(roundedAverage);

    return (
      <View key={dayIndex} style={styles.dayContainer}>
        <LinearGradient
          colors={gradientColors}
          style={styles.dayResult}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Text style={styles.dayText}>{roundedAverage}</Text>
          <View style={styles.divider} />
          <Text style={styles.dayLabel}>{dayData.day}</Text>
          <Text style={styles.qualityLabel}>{qualityLabel}</Text>
        </LinearGradient>
      </View>
    );
  };

  const styles = StyleSheet.create({
    weekResults: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
      paddingHorizontal: 8,
    },
    arrowButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.secondary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    dayContainer: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 6,
      borderRadius: 30,
    },
    dayResult: {
      width: 65,
      height: 150,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    dayText: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: 'bold',
      fontFamily: 'Inter-Bold',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    dayLabel: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Inter-Medium',
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    qualityLabel: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      marginTop: 4,
      opacity: 0.9,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    divider: {
      width: '80%',
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      marginVertical: 8,
    },
    loadingContainer: {
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
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
    <View style={styles.weekResults}>
      
    </View>
  );
};

export default WeekResults;