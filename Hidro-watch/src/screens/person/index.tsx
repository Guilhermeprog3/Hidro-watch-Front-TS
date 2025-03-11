import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ObjectContext } from '../../context/objectcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Primary_theme, Secondary_theme, Tertiary_theme } from '../../colors/color';

const Person = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { postUserObject } = useContext(ObjectContext);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [mode, setMode] = useState('Light');
  const [colors, setColors] = useState(Secondary_theme);

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

  const isFormValid = () => {
    return name && email && password;
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      const newObject = { name, email, password };
      await postUserObject(newObject);
      navigation.navigate('Home');
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VOLTAR</Text>
      </View>
      <Text style={styles.sectionTitle}>Profile</Text>

      <View style={styles.form}>
        <View style={styles.profilePictureContainer}>
          <Image source={require('../../../assets/images/profilePicture.jpeg')} style={styles.profilePicture} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={colors.iconColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save changes</Text>
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
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: 'white',
    padding: 10,
    color: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  passwordInput: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 10,
    color: '#fff',
  },
  eyeIcon: {
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#00bfa5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Person;