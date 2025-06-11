import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, RouteProp,useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../context/themecontext';
import HeaderBack from '../../components/headerBack';
import WeekResults from '../../components/weekresults';
import InfoBoxes from '../../components/boxweek';

type WeekScreenRouteProp = RouteProp<{ Week: { objectId: string } }, 'Week'>;

const Week_page = () => {
  const route = useRoute<WeekScreenRouteProp>();
  const { objectId } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const { theme } = useTheme();

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
          <WeekResults objectId={objectId} />
          <InfoBoxes objectId={objectId} />
      </View>
    </LinearGradient>
  );
};

export default Week_page;