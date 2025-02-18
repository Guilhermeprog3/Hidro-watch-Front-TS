import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Secondary_theme,Primary_theme,Tertiary_theme } from '../../colors/color';

const colors = Tertiary_theme;

const Week_page = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [currentStartDay, setCurrentStartDay] = React.useState(0);

  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const results = [0, 0, 3, 7, 14, 0, 0];

  const nextDay = () => {
    setCurrentStartDay((currentStartDay + 1) % 7);
  };

  const prevDay = () => {
    setCurrentStartDay((currentStartDay + 6) % 7); 
  };

  const getBackgroundColor = (result: number) => {
    if (result <= 2) return '#DC0016';
    if (result <= 4) return '#F2EE00';
    if (result <= 8) return '#00FF11';
    if (result <= 10) return '#0011FF';
    if (result <= 13) return '#000483';
    return '#580D78';
  };

  const getDayResult = (index: number) => {
    const dayIndex = (currentStartDay + index) % 7;
    return (
      <View key={index} style={[styles.dayResult, { backgroundColor: getBackgroundColor(results[dayIndex]) }]}>
        <Text style={styles.dayText}>{results[dayIndex]}</Text>
        <Text style={styles.dayLabel}>{days[dayIndex]}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>VOLTAR</Text>
        </View>
        <Text style={styles.headerText}>Bebedouro Do Corredor</Text>
        <Text style={styles.headerSubText}>Max: 14   Min: 7</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Resultados da Semana</Text>
          <View style={styles.weekResults}>
            <TouchableOpacity onPress={prevDay} style={styles.arrowButton}>
              <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
            </TouchableOpacity>

            {[0, 1, 2, 3].map(i => getDayResult(i))}

            <TouchableOpacity onPress={nextDay} style={styles.arrowButton}>
              <Ionicons name="arrow-forward" size={24} color={colors.iconColor} />
            </TouchableOpacity>
          </View>

          <LinearGradient colors={[colors.primaryLight, colors.secondary]} style={styles.qualityCard}>
            <Text style={styles.qualityText}>Média de Resultados</Text>
            <Text style={styles.qualityStatus}>Boa Qualidade</Text>
            <TouchableOpacity>
              <Text style={styles.learnMore}>Saiba Mais {'>'}</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.waterInfo}>
            <LinearGradient colors={[colors.primaryLight, colors.secondary]} style={styles.infoBox}>
              <Text style={styles.infoText}>0</Text>
              <Text style={styles.infoLabel}>Ácida</Text>
              <Text style={styles.infoDescription}>Água impura</Text>
            </LinearGradient>

            <LinearGradient colors={[colors.primaryLight, colors.secondary]} style={styles.infoBox}>
              <Text style={styles.infoText}>14</Text>
              <Text style={styles.infoLabel}>Alcalina</Text>
              <Text style={styles.infoDescription}>Água adequada</Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradientEnd,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  headerTitle: {
    color: colors.iconColor,
    fontSize: 18,
    marginLeft: 10,
  },
  backButton: {
    color: colors.iconColor,
    fontSize: 16,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubText: {
    color: colors.textPrimary,
    fontSize: 20,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  weekResults: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  arrowButton: {
    padding: 0,
  },
  dayResult: {
    width: 60,
    height: 130,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  dayLabel: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  qualityCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '86%',
    alignSelf: 'center',
  },
  qualityText: {
    color: colors.buttonText,
    fontSize: 16,
  },
  qualityStatus: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  learnMore: {
    color: colors.buttonText,
    fontSize: 14,
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
    color: colors.buttonText,
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoLabel: {
    color: colors.buttonText,
    fontSize: 16,
    marginTop: 5,
  },
  infoDescription: {
    color: colors.buttonText,
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default Week_page;
