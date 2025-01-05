import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const MeasurementPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <LinearGradient colors={["#01002C", "#000481"]} style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>VOLTAR</Text>
          <TouchableOpacity onPress={() => console.log('More options')}>
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>Bebedouro Do Corredor</Text>
        <Text style={styles.headerSubText}>Max: 14   Min: 7</Text>

        <View style={styles.circle}>
          <Text style={styles.circleText}>10 MD</Text>
        </View>

        <Text style={styles.sectionTitle}>MEDIÇÕES</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.row}>
            <View style={[styles.measurementBox, { backgroundColor: '#00FF11' }]}>
              <Text style={styles.measurementLabel}>PH</Text>
              <Text style={styles.measurementValue}>8</Text>
            </View>
            <View style={[styles.measurementBox, { backgroundColor: '#0011FF' }]}>
              <Text style={styles.measurementLabel}>Temperatura (°C)</Text>
              <Text style={styles.measurementValue}>20°</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.measurementBox, { backgroundColor: '#DC0016' }]}>
              <Text style={styles.measurementLabel}>TURBIDEZ (NTU)</Text>
              <Text style={styles.measurementValue}>7</Text>
            </View>
            <View style={[styles.measurementBox, { backgroundColor: '#00FF11' }]}>
              <Text style={styles.measurementLabel}>TURBIDEZ (NTU)</Text>
              <Text style={styles.measurementValue}>12</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F39',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginTop: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    marginRight: 200,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubText: {
    color: '#FFFFFF',
    fontSize: 20,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#21006E',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  circleText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  scrollContent: {
    paddingVertical: 20,
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
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  measurementValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MeasurementPage;
