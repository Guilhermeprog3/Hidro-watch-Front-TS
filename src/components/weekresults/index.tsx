import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/themecontext';
import { MeasurementContext } from '../../context/measurementscontext';

type WeekResultsProps = {
  objectId: string;
};

type ChartData = {
    labels: string[];
    datasets: {
        data: number[];
        color: (opacity: number) => string;
        strokeWidth: number;
    }[];
    legend: string[];
};

const WeekResults: React.FC<WeekResultsProps> = ({ objectId }) => {
  const { theme } = useTheme();
  const { getWeeklyAverage } = useContext(MeasurementContext);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      setIsLoading(true);
      try {
        const data = await getWeeklyAverage(objectId);
        if (data && data.length > 0) {
            
          const labels = data.map((d: any) => d.day);
          
          const phData = data.map((d: any) => d.ph || 0);
          const turbidityData = data.map((d: any) => d.turbidity || 0);
          const temperatureData = data.map((d: any) => d.temperature || 0);
          const tdsData = data.map((d: any) => d.tds || 0);

          setChartData({
            labels,
            datasets: [
              { data: phData, color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, strokeWidth: 2 },
              { data: turbidityData, color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, strokeWidth: 2 },
              { data: temperatureData, color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, strokeWidth: 2 },
              { data: tdsData, color: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`, strokeWidth: 2 },
            ],
            legend: ["pH", "Turbidez", "Temp (°C)", "TDS (ppm)"]
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados da semana para o gráfico:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyData();
  }, [objectId]);

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      paddingVertical: 16,
      marginBottom: 20,
      marginTop:20
    },
    title: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    loadingContainer: {
      height: 220,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: theme.red,
    }
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.iconColor} />
      </View>
    );
  }

  if (!chartData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Não foi possível carregar os dados do gráfico.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Métricas da Semana</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={250}
        chartConfig={{
          backgroundColor: theme.gradientEnd,
          backgroundGradientFrom: theme.gradientStart,
          backgroundGradientTo: theme.gradientEnd,
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: theme.secondary,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default WeekResults;