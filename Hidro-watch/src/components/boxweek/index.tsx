import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themecontext';

type InfoBoxesProps = {
  lastMeasurementDate: string;
  onLearnMore: () => void;
};

const InfoBoxes: React.FC<InfoBoxesProps> = ({ lastMeasurementDate, onLearnMore }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    qualityCard: {
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      width: '86%',
      alignSelf: 'center',
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
  });

  return (
    <View>
      <LinearGradient colors={[theme.primaryLight, theme.secondary]} style={styles.qualityCard}>
        <Text style={styles.qualityText}>Última Medição</Text>
        {lastMeasurementDate ? (
          <Text style={styles.lastMeasurementText}>{lastMeasurementDate}</Text>
        ) : (
          <Text style={styles.noMeasurementText}>Sem histórico de medição</Text>
        )}
        <TouchableOpacity onPress={onLearnMore}>
          <Text style={styles.learnMore}>Saiba Mais {'>'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.waterInfo}>
        <LinearGradient colors={[theme.primaryLight, theme.secondary]} style={styles.infoBox}>
          <Text style={styles.infoText}>0</Text>
          <Text style={styles.infoLabel}>Ácida</Text>
          <Text style={styles.infoDescription}>Água impura</Text>
        </LinearGradient>

        <LinearGradient colors={[theme.primaryLight, theme.secondary]} style={styles.infoBox}>
          <Text style={styles.infoText}>14</Text>
          <Text style={styles.infoLabel}>Alcalina</Text>
          <Text style={styles.infoDescription}>Água adequada</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

export default InfoBoxes;