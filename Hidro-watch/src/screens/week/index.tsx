import React, { useContext, useEffect, useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Secondary_theme, Primary_theme, Tertiary_theme } from '../../colors/color';
import { MeasurementContext } from '../../context/measurementscontext';
import { ObjectContext } from '../../context/objectcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = Tertiary_theme;

type WeekScreenRouteProp = RouteProp<{ Week: { objectId: string } }, 'Week'>;

const Week_page = () => {
  const route = useRoute<WeekScreenRouteProp>();
  const { objectId } = route.params;

  const navigation = useNavigation<NavigationProp<any>>();
  const { getWeeklyAverage, getLatestMeasurement } = useContext(MeasurementContext);
  const { GetObjectforId } = useContext(ObjectContext);
  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [objectTitle, setObjectTitle] = useState<string>('Carregando...');
  const [currentStartDay, setCurrentStartDay] = useState(0);
  const [qualityStatus, setQualityStatus] = useState<string>('');
  const [lastMeasurementDate, setLastMeasurementDate] = useState<string>('');

  useEffect(() => {
    const loadMode = async () => {
      const savedMode = await AsyncStorage.getItem('userMode');
      if (savedMode) {
        setMode(savedMode);
        updateColors(savedMode);
      }
    };
    loadMode();
  }, []);

  const updateColors = (mode: string) => {
    if (mode === 'Hidro') {
      setColors(Primary_theme);
    } else if (mode === 'Light') {
      setColors(Secondary_theme);
    } else {
      setColors(Tertiary_theme);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const objectData = await GetObjectforId(objectId);
      if (objectData) {
        setObjectTitle(objectData.tittle);
      }

      const weeklyData = await getWeeklyAverage(objectId);
      if (weeklyData) {
        setWeeklyData(weeklyData);
      }

      const latestMeasurement = await getLatestMeasurement(objectId);
      if (latestMeasurement) {
        const formattedDate = new Date(latestMeasurement.createdAt).toLocaleString();
        setLastMeasurementDate(formattedDate);
      } else {
        setLastMeasurementDate('');
      }
    };

    fetchData();
  }, [objectId]);

  const roundToNearestHalf = (value: number) => {
    return Math.round(value * 2) / 2;
  };

  const prevDay = () => {
    setCurrentStartDay((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const nextDay = () => {
    setCurrentStartDay((prev) => (prev === 6 ? 0 : prev + 1));
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
  container: {
    flex: 1,
    backgroundColor: colors.gradientEnd,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    marginLeft: 10,
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubText: {
    color: colors.textPrimary,
    fontSize: 20,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
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
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  dayLabel: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  qualityCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '86%',
    alignSelf: 'center',
  },
  qualityText: {
    color: colors.buttonText,
    fontSize: 16,
  },
  lastMeasurementText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  noMeasurementText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    fontStyle: 'italic',
  },
  learnMore: {
    color: colors.buttonText,
    fontSize: 14,
    marginTop: 10,
  },
  waterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBox: {
    borderRadius: 15,
    width: '38%',
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 22,
  },
  infoText: {
    color: colors.buttonText,
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoLabel: {
    color: colors.buttonText,
    fontSize: 16,
    marginTop: 5,
  },
  infoDescription: {
    color: colors.buttonText,
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
            <Text style={styles.headerTitle}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>{objectTitle}</Text>
        <Text style={styles.headerSubText}>Max: 14   Min: 7</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Resultados da Semana</Text>
          <View style={styles.weekResults}>
            <TouchableOpacity onPress={prevDay} style={styles.arrowButton}>
              <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
            </TouchableOpacity>

            {[0, 1, 2, 3].map((index) => getDayResult(index))}

            <TouchableOpacity onPress={nextDay} style={styles.arrowButton}>
              <Ionicons name="arrow-forward" size={24} color={colors.iconColor} />
            </TouchableOpacity>
          </View>

          <LinearGradient colors={[colors.primaryLight, colors.secondary]} style={styles.qualityCard}>
            <Text style={styles.qualityText}>Última Medição</Text>
            {lastMeasurementDate ? (
              <Text style={styles.lastMeasurementText}>{lastMeasurementDate}</Text>
            ) : (
              <Text style={styles.noMeasurementText}>Sem histórico de medição</Text>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Measurement', { deviceId: objectId })}>
              <Text style={styles.learnMore}>Saiba Mais {'>'}</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.waterInfo}>
            <LinearGradient colors={[colors.primaryLight, colors.secondary]} style={styles.infoBox}>
              <Text style={styles.infoText}>0</Text>
              <Text style={styles.infoLabel}>Ácida</Text>
              <Text style={styles.infoDescription}>Água impura</Text>
            </LinearGradient>

            <LinearGradient colors={[colors.primaryLight, colors.secondary]} style={styles.infoBox}>
              <Text style={styles.infoText}>14</Text>
              <Text style={styles.infoLabel}>Alcalina</Text>
              <Text style={styles.infoDescription}>Água adequada</Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Week_page;