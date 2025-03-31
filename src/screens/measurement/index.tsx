import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
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
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.gradientStart,
      paddingHorizontal: 20,
    },
    
  });

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <HeaderMeasurement 
        deviceId={deviceId}
        onBackPress={() => navigation.goBack()} 
      />
        <MeasurementBody deviceId={deviceId} />
        <DeviceInfo deviceId={deviceId} />
    </LinearGradient>
  );
};

export default MeasurementPage;