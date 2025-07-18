import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';
import HeaderBack from '../../components/headerBack';
import WeekResults from '../../components/weekresults';
import InfoBoxes from '../../components/boxweek';
import { ObjectContext } from '../../context/objectcontext';

type WeekScreenRouteProp = RouteProp<{ Week: { deviceId: string } }, 'Week'>;

const Week_page = () => {
  const route = useRoute<WeekScreenRouteProp>();
  const { deviceId } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();
  const { GetDeviceforId } = useContext(ObjectContext);
  const [objectTitle, setObjectTitle] = useState('Carregando...');

  useEffect(() => {
    const fetchObjectTitle = async () => {
      const objectData = await GetDeviceforId(deviceId);
      if (objectData) {
        setObjectTitle(objectData.tittle);
      } else {
        setObjectTitle('Relatório Semanal');
      }
    };
    fetchObjectTitle();
  }, [deviceId]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.gradientEnd,
    },
    pageTitle: {
      color: theme.textPrimary,
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <HeaderBack onBackPress={() => navigation.goBack()} />
        <Text style={styles.pageTitle}>{objectTitle}</Text>
        <WeekResults deviceId={deviceId} />
        <InfoBoxes deviceId={deviceId} />
    </LinearGradient>
  );
};

export default Week_page;