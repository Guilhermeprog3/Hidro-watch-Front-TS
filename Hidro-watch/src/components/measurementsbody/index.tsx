import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/themecontext';

type MeasurementBodyProps = {
  objectName: string;
  averageMeasurement: number;
  ph: number;
  temperature: number;
  turbidity: number;
};

const MeasurementBody: React.FC<MeasurementBodyProps> = ({
  objectName,
  averageMeasurement,
  ph,
  temperature,
  turbidity,
}) => {
  const { theme } = useTheme();

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

  const styles = StyleSheet.create({
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
    circle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.navBarBackground,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 20,
    },
    circleText: {
      color: theme.textPrimary,
      fontSize: 24,
      fontWeight: 'bold',
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'left',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    measurementBox: {
      borderRadius: 10,
      padding: 20,
      width: '48%',
      height: 90,
      alignItems: 'center',
    },
    measurementLabel: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    measurementValue: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View>
      <Text style={styles.headerText}>{objectName}</Text>
      <Text style={styles.headerSubText}>Max: 14   Min: 6</Text>

      <View style={styles.circle}>
        <Text style={styles.circleText}>{roundToNearestHalf(averageMeasurement)} MD</Text>
      </View>

      <Text style={styles.sectionTitle}>MEDIÇÕES</Text>

      <View style={styles.row}>
        <View style={[styles.measurementBox, { backgroundColor: getBackgroundColor(ph) }]}>
          <Text style={styles.measurementLabel}>PH</Text>
          <Text style={styles.measurementValue}>{ph}</Text>
        </View>
        <View style={[styles.measurementBox, { backgroundColor: getBackgroundColor(temperature) }]}>
          <Text style={styles.measurementLabel}>Temperatura (°C)</Text>
          <Text style={styles.measurementValue}>{temperature}°</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.measurementBox, { backgroundColor: getBackgroundColor(turbidity) }]}>
          <Text style={styles.measurementLabel}>TURBIDEZ (NTU)</Text>
          <Text style={styles.measurementValue}>{turbidity}</Text>
        </View>
        <View style={[styles.measurementBox, { backgroundColor: getBackgroundColor(averageMeasurement) }]}>
          <Text style={styles.measurementLabel}>Média</Text>
          <Text style={styles.measurementValue}>{roundToNearestHalf(averageMeasurement)}</Text>
        </View>
      </View>
    </View>
  );
};

export default MeasurementBody;