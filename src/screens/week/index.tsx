import React, { useContext, useEffect, useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MeasurementContext } from '../../context/measurementscontext';
import { ObjectContext } from '../../context/objectcontext';
import { useTheme } from '../../context/themecontext';
import HeaderBack from '../../components/headerBack';
import WeekResults from '../../components/weekresults';
import InfoBoxes from '../../components/boxweek';

type WeekScreenRouteProp = RouteProp<{ Week: { objectId: string } }, 'Week'>;

const Week_page = () => {
  const route = useRoute<WeekScreenRouteProp>();
  const { objectId } = route.params;

  const navigation = useNavigation<NavigationProp<any>>();
  const { getWeeklyAverage, getLatestMeasurement } = useContext(MeasurementContext);
  const { GetObjectforId } = useContext(ObjectContext);
  const { theme } = useTheme();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [objectTitle, setObjectTitle] = useState<string>('Carregando...');
  const [currentStartDay, setCurrentStartDay] = useState(0);
  const [lastMeasurementDate, setLastMeasurementDate] = useState<string>('');

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

  const prevDay = () => {
    setCurrentStartDay((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const nextDay = () => {
    setCurrentStartDay((prev) => (prev === 6 ? 0 : prev + 1));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.gradientEnd,
      paddingHorizontal: 15,
    },
    headerText: {
      color: theme.textPrimary,
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    headerSubText: {
      color: theme.textPrimary,
      fontSize: 20,
      marginTop: 8,
      textAlign: 'center',
      marginBottom: 20,
    },
    scrollContent: {
      paddingVertical: 20,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 30,
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <HeaderBack onBackPress={() => navigation.goBack()} />
      <View>
        <Text style={styles.headerText}>{objectTitle}</Text>
        <Text style={styles.headerSubText}>Max: 14   Min: 7</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Resultados da Semana</Text>
          <WeekResults
            weeklyData={weeklyData}
            currentStartDay={currentStartDay}
            onPrevDay={prevDay}
            onNextDay={nextDay}
          />
          <InfoBoxes
            lastMeasurementDate={lastMeasurementDate}
            onLearnMore={() => navigation.navigate('Measurement', { deviceId: objectId })}
          />
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Week_page;