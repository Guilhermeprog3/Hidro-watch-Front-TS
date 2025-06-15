import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/themecontext';
import { MeasurementContext } from '../../context/measurementscontext';
import { Ionicons } from '@expo/vector-icons';
import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';

type WeekResultsProps = {
  deviceId: string;
};

type ChartData = {
  labels: string[];
  datasets: Dataset[];
  legend: string[];
  title: string;
};

type TooltipState = {
  x: number;
  y: number;
  visible: boolean;
  value: number;
};

const ParameterStandardCard = ({ icon, name, value }: { icon: keyof typeof Ionicons.glyphMap, name: string, value: string }) => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    standardCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 12,
      padding: 12,
      width: '48%',
      marginBottom: 10,
    },
    standardIcon: {
      marginRight: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: 6,
      borderRadius: 8,
    },
    standardTextContainer: {
      flex: 1,
    },
    standardName: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: '600',
    },
    standardValue: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.standardCard}>
      <View style={styles.standardIcon}>
        <Ionicons name={icon} size={22} color={theme.iconColor} />
      </View>
      <View style={styles.standardTextContainer}>
        <Text style={styles.standardName}>{name}</Text>
        <Text style={styles.standardValue}>{value}</Text>
      </View>
    </View>
  );
};

const WeekResults: React.FC<WeekResultsProps> = ({ deviceId }) => {
  const { theme } = useTheme();
  const { getWeeklyAverage } = useContext(MeasurementContext);
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      setIsLoading(true);
      try {
        const data = await getWeeklyAverage(deviceId);
        if (data && data.length > 0) {
          const labels = data.map((d: any) => d.day);
          
          const parameterData = [
            { title: 'pH', data: data.map((d: any) => parseFloat(d.ph) || 0), color: (opacity=1) => `rgba(134, 65, 244, ${opacity})` },
            { title: 'Turbidez (NTU)', data: data.map((d: any) => parseFloat(d.turbidity) || 0), color: (opacity=1) => `rgba(255, 165, 0, ${opacity})` },
            { title: 'Temperatura (°C)', data: data.map((d: any) => parseFloat(d.temperature) || 0), color: (opacity=1) => `rgba(255, 99, 71, ${opacity})` },
            { title: 'TDS (ppm)', data: data.map((d: any) => parseFloat(d.tds) || 0), color: (opacity=1) => `rgba(0, 191, 255, ${opacity})` },
          ];

          const chartArray = parameterData.map(param => ({
            labels,
            datasets: [{
              data: param.data,
              color: param.color,
              strokeWidth: 2,
            }],
            legend: [param.title],
            title: `Média Semanal de ${param.title}`
          }));

          setCharts(chartArray);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeeklyData();
  }, [deviceId]);

  const goToPrevious = () => {
    setActiveIndex(prev => (prev === 0 ? charts.length - 1 : prev - 1));
    setTooltip(null);
  };
  
  const goToNext = () => {
    setActiveIndex(prev => (prev === charts.length - 1 ? 0 : prev + 1));
    setTooltip(null);
  };

  const handleDataPointClick = (data: {
    value: number;
    x: number;
    y: number;
  }) => {
    if (tooltip && tooltip.x === data.x && tooltip.y === data.y) {
      setTooltip(null);
      return;
    }
    setTooltip({
      x: data.x,
      y: data.y,
      visible: true,
      value: data.value,
    });
  };
  
  const activeChartData = charts[activeIndex];

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navButton: {
        padding: 10,
    },
    chartWrapper: {
        alignItems: 'center',
    },
    title: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    loadingContainer: {
      height: 220,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: theme.red,
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 15,
      marginBottom: 10,
    },
    dot: {
      height: 8,
      width: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: theme.buttonBackground,
      width: 16,
    },
    standardsContainer: {
        width: '100%',
        paddingHorizontal: 15,
        marginTop: 20,
    },
    standardsTitle: {
        color: theme.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    standardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    tooltipContainer: {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 8,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    tooltipText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
  });

  if (isLoading) {
    return <View style={[styles.container, styles.loadingContainer]}><ActivityIndicator size="large" color={theme.iconColor} /></View>;
  }

  if (charts.length === 0) {
    return <View style={styles.container}><Text style={styles.errorText}>Não há dados para exibir.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <TouchableOpacity style={styles.navButton} onPress={goToPrevious}>
            <Ionicons name="chevron-back" size={28} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.chartWrapper}>
          <Text style={styles.title}>{activeChartData.title}</Text>
          <LineChart
            data={{
                labels: activeChartData.labels,
                datasets: activeChartData.datasets,
            }}
            width={Dimensions.get('window').width - 100}
            height={260}
            onDataPointClick={handleDataPointClick}
            decorator={() => {
                if (tooltip && tooltip.visible) {
                  const tooltipX = Math.min(Math.max(tooltip.x - 30, 0), Dimensions.get('window').width - 110);
                  return (
                    <View 
                      key={Math.random()} 
                      style={[styles.tooltipContainer, { top: tooltip.y - 40, left: tooltipX }]}
                    >
                      <Text style={styles.tooltipText}>{tooltip.value.toFixed(1)}</Text>
                    </View>
                  );
                }
                return null;
              }}
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
                r: '8',
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

        <TouchableOpacity style={styles.navButton} onPress={goToNext}>
            <Ionicons name="chevron-forward" size={28} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
      <View style={styles.paginationContainer}>
        {charts.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex ? styles.activeDot : {}]}
          />
        ))}
      </View>
       <View style={styles.standardsContainer}>
         <Text style={styles.standardsTitle}>Padrões de Qualidade</Text>
         <View style={styles.standardsGrid}>
             <ParameterStandardCard icon="water-outline" name="pH" value="6.5 - 8.5" />
             <ParameterStandardCard icon="eye-outline" name="Turbidez" value="< 5 NTU" />
             <ParameterStandardCard icon="thermometer-outline" name="Temperatura" value="10°C - 25°C" />
             <ParameterStandardCard icon="leaf-outline" name="TDS" value="< 500 ppm" />
         </View>
       </View>
    </View>
  );
};

export default WeekResults;