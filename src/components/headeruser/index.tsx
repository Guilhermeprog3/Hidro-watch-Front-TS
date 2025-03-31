import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/themecontext';
import { UserContext } from '../../context/usercontext';

interface User {
  id?: string;
  name?: string;
  email?: string;
  profile_picture?: string;
}

const HeaderUser = () => {
  const { theme } = useTheme();
  const { GetUserforId, updateProfilePicture } = useContext(UserContext);
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await GetUserforId();
        if (userData) {
          setUser(userData);
          setProfileImage(userData.profile_picture || null);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };
    

    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0].uri) {
        setIsLoading(true);

        const updatedUser = await updateProfilePicture(result.assets[0].uri);

        setProfileImage(updatedUser.profile_picture ?? null);
      }
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a foto.');
    } finally {
      setIsLoading(false);
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
      backgroundColor: theme.gradientendlogin,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginTop: 5,
    },
    profileEmail: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 10,
    },
    editButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: theme.buttonBackground,
      borderRadius: 20,
      minWidth: 150,
      alignItems: 'center',
    },
    editButtonText: {
      color: theme.buttonText,
      fontWeight: 'bold',
    },
    loadingText: {
      color: theme.textSecondary,
      marginTop: 5,
    },
  });

  if (!user) {
    return (
      <View style={styles.header}>
        <Text style={styles.profileName}>Carregando usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: profileImage || 'https://www.gravatar.com/avatar/?d=mp',
            cache: 'reload',
          }}
          style={styles.profilePicture}
        />

        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={pickImage}
          disabled={isLoading}
        >
          <Text style={styles.editButtonText}>
            {isLoading ? 'Enviando...' : 'Alterar Foto'}
          </Text>
        </TouchableOpacity>

        {isLoading && <Text style={styles.loadingText}>Atualizando...</Text>}
      </View>
    </View>
  );
};

export default HeaderUser;
