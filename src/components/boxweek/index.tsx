import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themecontext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MeasurementContext } from '../../context/measurementscontext';
import { ObjectContext } from '../../context/objectcontext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type InfoBoxesProps = {
  objectId: string;
};

const InfoBoxes: React.FC<InfoBoxesProps> = ({ objectId }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const { getLatestMeasurement } = useContext(MeasurementContext);
  const { GetObjectforId } = useContext(ObjectContext);
  const [lastMeasurementDate, setLastMeasurementDate] = useState<string>('');
  const [objectTitle, setObjectTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [objectData, latestMeasurement] = await Promise.all([
          GetObjectforId(objectId),
          getLatestMeasurement(objectId),
        ]);

        if (objectData) {
          setObjectTitle(objectData.tittle);
        }

        if (latestMeasurement?.createdAt) {
          const formattedDate = new Date(latestMeasurement.createdAt).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          setLastMeasurementDate(formattedDate);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [objectId]);

  const handleLearnMore = () => {
    navigation.navigate('Measurement', { deviceId: objectId });
  };

  // Função para obter cores do gradiente
  const getGradientColors = (type: 'primary' | 'acidic' | 'alkaline'): readonly [ColorValue, ColorValue] => {
    switch (type) {
      case 'primary':
        return ['#3949AB', '#1A237E'] as const; // Azul profundo
      case 'acidic':
        return ['#E53935', '#B71C1C'] as const; // Vermelho
      case 'alkaline':
        return ['#43A047', '#1B5E20'] as const; // Verde
      default:
        return ['#3949AB', '#1A237E'] as const;
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    qualityCard: {
      borderRadius: 16,
      marginBottom: 20,
      width: '92%',
      alignSelf: 'center',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 6,
    },
    qualityCardContent: {
      padding: 20,
    },
    deviceInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    deviceIcon: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    qualityTextContainer: {
      flex: 1,
    },
    qualityTitle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Inter-Bold',
    },
    qualityText: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: 14,
      fontFamily: 'Inter-Medium',
    },
    lastMeasurementText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
      fontFamily: 'Inter-SemiBold',
    },
    noMeasurementText: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
      fontStyle: 'italic',
      fontFamily: 'Inter-SemiBold',
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      marginVertical: 12,
      width: '100%',
    },
    learnMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginTop: 5,
    },
    learnMore: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
      marginRight: 5,
      fontFamily: 'Inter-SemiBold',
    },
    waterInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '92%',
      alignSelf: 'center',
    },
    infoBox: {
      borderRadius: 16,
      width: '48%',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 6,
    },
    infoBoxContent: {
      padding: 16,
      alignItems: 'center',
    },
    infoIconContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    infoText: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: 'bold',
      fontFamily: 'Inter-Bold',
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    infoLabel: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 5,
      fontFamily: 'Inter-SemiBold',
    },
    infoDescription: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: 13,
      marginTop: 5,
      textAlign: 'center',
      fontFamily: 'Inter-Regular',
    },
    loadingContainer: {
      height: 200,
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
    <View style={styles.container}>
      <View style={styles.qualityCard}>
        <LinearGradient
          colors={getGradientColors('primary')}
          style={styles.qualityCardContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.deviceInfoRow}>
            <View style={styles.deviceIcon}>
              <Ionicons name="water-outline" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.qualityTextContainer}>
              <Text style={styles.qualityTitle}>{objectTitle || 'Dispositivo'}</Text>
              <Text style={styles.qualityText}>Monitoramento de qualidade da água</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {lastMeasurementDate ? (
            <>
              <Text style={styles.qualityText}>Última medição:</Text>
              <Text style={styles.lastMeasurementText}>{lastMeasurementDate}</Text>
            </>
          ) : (
            <Text style={styles.noMeasurementText}>Sem histórico de medição</Text>
          )}

          <TouchableOpacity style={styles.learnMoreButton} onPress={handleLearnMore} activeOpacity={0.8}>
            <Text style={styles.learnMore}>Detalhes completos</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.waterInfo}>
        <View style={styles.infoBox}>
          <LinearGradient
            colors={getGradientColors('acidic')}
            style={styles.infoBoxContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.infoIconContainer}>
              <MaterialCommunityIcons name="flask" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.infoText}>0</Text>
            <Text style={styles.infoLabel}>Ácida</Text>
            <Text style={styles.infoDescription}>Água imprópria para consumo, pH baixo</Text>
          </LinearGradient>
        </View>

        <View style={styles.infoBox}>
          <LinearGradient
            colors={getGradientColors('alkaline')}
            style={styles.infoBoxContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.infoIconContainer}>
              <MaterialCommunityIcons name="water-check" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.infoText}>14</Text>
            <Text style={styles.infoLabel}>Alcalina</Text>
            <Text style={styles.infoDescription}>Água adequada para consumo, pH elevado</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

export default InfoBoxes;