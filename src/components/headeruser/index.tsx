import React, { useState,useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/themecontext';
import { UserContext } from '../../context/usercontext';

interface User {
  name?: string;
  email?: string;
  profilePicture?: string; 
}

interface HeaderProps {
  user: User | null;
}

const HeaderUser: React.FC<HeaderProps> = ({ user }) => {
  const { theme } = useTheme();
  const { updateProfilePicture } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(user?.profilePicture || '');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria para escolher uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await updateProfilePicture(result.assets[0].uri);
    }
  };

  const styles = StyleSheet.create({
    header: {
      paddingBottom: 30,
      alignItems: 'center',
    },
    profileSection: {
      alignItems: 'center',
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    profileEmail: {
      fontSize: 16,
      color: theme.textPrimary,
    },
    editButton: {
      marginTop: 10,
      padding: 8,
      backgroundColor: theme.buttonBackground,
      borderRadius: 5,
    },
    editButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
  });

  if (!user) {
    return (
      <View style={styles.header}>
        <Text style={styles.profileName}>Usuário não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: profileImage || 'https://via.placeholder.com/100' }}
          style={styles.profilePicture}
        />
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>

        <TouchableOpacity style={styles.editButton} onPress={pickImage}>
          <Text style={styles.editButtonText}>Alterar Foto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderUser;
