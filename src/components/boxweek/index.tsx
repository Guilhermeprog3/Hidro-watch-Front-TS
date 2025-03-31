import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themecontext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MeasurementContext } from '../../context/measurementscontext';
import { ObjectContext } from '../../context/objectcontext';

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

  const styles = StyleSheet.create({
    qualityCard: {
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      width: '86%',
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: theme.gradientEnd,
    },
    qualityText: {
      color: theme.buttonText,
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
      color: theme.buttonText,
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
      borderWidth: 1,
      borderColor: theme.gradientEnd,
    },
    infoText: {
      color: theme.buttonText,
      fontSize: 24,
      fontWeight: 'bold',
    },
    infoLabel: {
      color: theme.buttonText,
      fontSize: 16,
      marginTop: 5,
    },
    infoDescription: {
      color: theme.buttonText,
      fontSize: 14,
      marginTop: 5,
      textAlign: 'center',
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
    <View>
      <LinearGradient colors={[theme.navBarBackground, theme.navBarBackground]} style={styles.qualityCard}>
        <Text style={styles.qualityText}>{objectTitle || 'Dispositivo'}</Text>
        {lastMeasurementDate ? (
          <Text style={styles.lastMeasurementText}>{lastMeasurementDate}</Text>
        ) : (
          <Text style={styles.noMeasurementText}>Sem histórico de medição</Text>
        )}
        <TouchableOpacity onPress={handleLearnMore}>
          <Text style={styles.learnMore}>Saiba Mais {'>'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.waterInfo}>
        <LinearGradient colors={[theme.navBarBackground, theme.navBarBackground]} style={styles.infoBox}>
          <Text style={styles.infoText}>0</Text>
          <Text style={styles.infoLabel}>Ácida</Text>
          <Text style={styles.infoDescription}>Água impura</Text>
        </LinearGradient>

        <LinearGradient colors={[theme.navBarBackground, theme.navBarBackground]} style={styles.infoBox}>
          <Text style={styles.infoText}>14</Text>
          <Text style={styles.infoLabel}>Alcalina</Text>
          <Text style={styles.infoDescription}>Água adequada</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

export default InfoBoxes;