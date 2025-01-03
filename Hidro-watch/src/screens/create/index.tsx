import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../../context/authContext';

const CreatePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { postUserObject } = useContext(AuthContext);
  const [Tittle, setTittle] = useState<string>('');
  const [Location, setLocation] = useState<string>('');


  const isFormValid = () => {
    return Tittle && Location ;
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      const newObject = { Tittle, Location };
      await postUserObject(newObject);
      navigation.navigate('Home');
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <LinearGradient colors={["#01002C", "#000481"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VOLTAR</Text>
      </View>
      <Text style={styles.sectionTitle}>PRENCHA OS DADOS DE MEDIÇÃO</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome da medição"
          placeholderTextColor="#aaa"
          value={Tittle}
          onChangeText={setTittle}
        />
        {Tittle ? <Ionicons name="checkmark-circle" size={24} color="green" /> : null}
        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor="#aaa"
          value={Location}
          onChangeText={setLocation}
        />
        {Location ? <Ionicons name="checkmark-circle" size={24} color="green" /> : null}
      </View>
      <Text style={styles.connectedText}>DISPOSITIVO CONECTADO</Text>
      <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
        <Text style={styles.addButtonText}>Adicionar Dispositivo</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 25,
    color: '#000',
  },
  connectedText: {
    color: 'green',
    fontSize: 28,
    textAlign: 'auto',
    width: '100%',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 15,
  },
  addButton: {
    backgroundColor: '#00bfa5',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreatePage;
