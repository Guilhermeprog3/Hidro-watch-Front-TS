import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Primary_theme, Secondary_theme, Tertiary_theme } from '../../colors/color';
import { useObject } from '../../hooks/Objectcontext';
import { Measurementobject } from '../../hooks/measurements';

interface RouteParams {
  deviceId: string;
}

const MeasurementPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute();
  const { deviceId } = route.params as RouteParams;
  const { getLatestMeasurement } = Measurementobject();
  const { GetObjectforId, DeleteObject } = useObject();
  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);
  const [measurement, setMeasurement] = useState({
    ph: 0,
    turbidity: 0,
    temperature: 0,
    averageMeasurement: 0,
  });
  const [objectName, setObjectName] = useState('Carregando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMode = async () => {
      const savedMode = await AsyncStorage.getItem('userMode');
      if (savedMode) {
        setMode(savedMode);
        updateColors(savedMode);
      }
    };
    loadMode();
  }, []);

  const updateColors = (mode: string) => {
    if (mode === 'Hidro') {
      setColors(Primary_theme);
    } else if (mode === 'Light') {
      setColors(Secondary_theme);
    } else {
      setColors(Tertiary_theme);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const objectData = await GetObjectforId(deviceId);
        if (objectData) {
          setObjectName(objectData.tittle);
        }

        const latestMeasurement = await getLatestMeasurement(deviceId);
        if (latestMeasurement) {
          setMeasurement({
            ph: latestMeasurement.ph || 0,
            turbidity: latestMeasurement.turbidity || 0,
            temperature: latestMeasurement.temperature || 0,
            averageMeasurement: latestMeasurement.averageMeasurement || 0,
          });
        } else {
          setMeasurement({
            ph: 0,
            turbidity: 0,
            temperature: 0,
            averageMeasurement: 0,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deviceId]);

  const handleMenuSelection = (value: string) => {
    switch (value) {
      case 'Detalhar':
        navigation.navigate('Details', { deviceId });
        break;
      case 'Deletar':
        Alert.alert(
          'Deletar Objeto',
          'Tem certeza que deseja deletar este objeto?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Deletar',
              style: 'destructive',
              onPress: async () => {
                await DeleteObject(deviceId);
                navigation.goBack();
              },
            },
          ],
        );
        break;
      default:
        break;
    }
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
      color: colors.white,
      fontSize: 18,
      marginRight: 200,
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
    circle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.navBarBackground,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 20,
    },
    circleText: {
      color: colors.white,
      fontSize: 24,
      fontWeight: 'bold',
    },
    sectionTitle: {
      color: colors.textPrimary,
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
      color: colors.white,
      fontSize: 13,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    measurementValue: {
      color: colors.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuOptions: {
      backgroundColor: colors.navBarBackground,
      borderRadius: 10,
      padding: 10,
    },
    menuOptionsContainer: {
      backgroundColor: colors.navBarBackground,
      borderRadius: 10,
      padding: 10,
      width: 100,
      marginTop: 40,
    },
    menuOptionText: {
      color: colors.white,
      fontSize: 10,
      padding: 10,
    },
    menuTrigger: {
      padding: 10,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.iconColor} />
      </View>
    );
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>VOLTAR</Text>
          <Menu>
            <MenuTrigger customStyles={{ triggerWrapper: styles.menuTrigger }}>
              <Ionicons name="ellipsis-vertical" size={24} color={colors.iconColor} />
            </MenuTrigger>
            <MenuOptions customStyles={{optionsContainer: styles.menuOptionsContainer }}>
              <MenuOption onSelect={() => handleMenuSelection('Detalhar')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="information-circle" size={20} color={colors.iconColor} />
                  <Text style={styles.menuOptionText}> Detalhar</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => handleMenuSelection('Deletar')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="trash" size={20} color="#FF4444" />
                  <Text style={[styles.menuOptionText, { color: '#FF4444' }]}> Deletar</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
        <Text style={styles.headerText}>{objectName}</Text>
        <Text style={styles.headerSubText}>Max: 14   Min: 6</Text>

        <View style={styles.circle}>
          <Text style={styles.circleText}>{measurement.averageMeasurement} MD</Text>
        </View>

        <Text style={styles.sectionTitle}>MEDIÇÕES</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.row}>
            <View style={[styles.measurementBox, { backgroundColor: '#00CC00' }]}>
              <Text style={styles.measurementLabel}>PH</Text>
              <Text style={styles.measurementValue}>{measurement.ph}</Text>
            </View>
            <View style={[styles.measurementBox, { backgroundColor: '#0000CC' }]}>
              <Text style={styles.measurementLabel}>Temperatura (°C)</Text>
              <Text style={styles.measurementValue}>{measurement.temperature}°</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.measurementBox, { backgroundColor: '#CC0000' }]}>
              <Text style={styles.measurementLabel}>TURBIDEZ (NTU)</Text>
              <Text style={styles.measurementValue}>{measurement.turbidity}</Text>
            </View>
            <View style={[styles.measurementBox, { backgroundColor: '#00CC00' }]}>
              <Text style={styles.measurementLabel}>Média</Text>
              <Text style={styles.measurementValue}>{measurement.averageMeasurement}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default MeasurementPage;