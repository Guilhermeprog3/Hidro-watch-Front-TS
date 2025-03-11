import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ObjectContext } from '../../context/objectcontext';

const CreatePage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { postUserObject } = useContext(ObjectContext);
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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome da medição"
            placeholderTextColor="#aaa"
            value={Tittle}
            onChangeText={setTittle}
          />
          
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#aaa"
            value={Location}
            onChangeText={setLocation}
          />
  
        </View>
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
    marginBottom: 30,
    marginTop: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 25,
  },
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'white',
    borderRadius:10,
    padding: 10,
    color: '#fff',
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
