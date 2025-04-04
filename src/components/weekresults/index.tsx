import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';
import { MeasurementContext } from '../../context/measurementscontext';

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

  const getBackgroundColor = (result: number) => {
    if (result <= 2) return 'rgba(220, 0, 22, 0.8)';
    if (result <= 4) return 'rgba(242, 238, 0, 0.8)';
    if (result <= 8) return 'rgba(0, 255, 17, 0.8)';
    if (result <= 10) return 'rgba(0, 17, 255, 0.8)';
    if (result <= 13) return 'rgba(0, 4, 131, 0.8)';
    return 'rgba(88, 13, 120, 0.8)';
  };

  const getDayResult = (index: number) => {
    const dayIndex = (currentStartDay + index) % 7;
    const dayData = weeklyData[dayIndex];
    if (!dayData) return null;

    const roundedAverage = roundToNearestHalf(dayData.average_measurement);

    return (
      <View key={dayIndex} style={[styles.dayResult, { backgroundColor: getBackgroundColor(roundedAverage) }]}>
        <Text style={styles.dayText}>{roundedAverage}</Text>
        <Text style={styles.dayLabel}>{dayData.day}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    weekResults: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
    },
    arrowButton: {
      padding: 0,
    },
    dayResult: {
      width: 60,
      height: 130,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayText: {
      color: theme.textPrimary,
      fontSize: 24,
      fontWeight: 'bold',
    },
    dayLabel: {
      color: theme.textPrimary,
      fontSize: 16,
    },
    loadingContainer: {
      height: 130,
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
    <View style={styles.weekResults}>
      <TouchableOpacity onPress={prevDay} style={styles.arrowButton}>
        <Ionicons name="arrow-back" size={24} color={theme.iconColor} />
      </TouchableOpacity>

      {[0, 1, 2, 3].map((index) => getDayResult(index))}

      <TouchableOpacity onPress={nextDay} style={styles.arrowButton}>
        <Ionicons name="arrow-forward" size={24} color={theme.iconColor} />
      </TouchableOpacity>
    </View>
  );
};

export default WeekResults;