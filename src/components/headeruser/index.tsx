import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/themecontext';
import { UserContext } from '../../context/usercontext';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id?: string;
  name?: string;
  email?: string;
  profile_picture?: string;
}

const { width } = Dimensions.get('window');

const HeaderUser = () => {
  const { theme } = useTheme();
  const { GetUserforId, updateProfilePicture } = useContext(UserContext);
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await GetUserforId();
        if (userData) {
          setUser(userData);
          setProfileImage(userData.profile_picture || null);
          
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        }
      } catch (error) {
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
      Alert.alert('Erro', 'Não foi possível atualizar a foto.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const styles = StyleSheet.create({
    header: {
      paddingVertical: 30,
      alignItems: 'center',
      width: '100%',
    },
    profileSection: {
      alignItems: 'center',
      width: '100%',
    },
    profileImageContainer: {
      position: 'relative',
      marginBottom: 20,
    },
    profilePicture: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: 'rgba(3, 0, 0, 0.2)',
    },
    initialsContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.buttonBackground,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: theme.textPrimary,
    },
    initialsText: {
      fontSize: 40,
      fontWeight: 'bold',
      color: 'white',
    },
    editIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.buttonBackground,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    profileName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 5,
      textAlign: 'center',
    },
    profileEmail: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: theme.textSecondary,
      marginTop: 10,
      fontSize: 14,
    },
    skeletonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 30,
    },
    skeletonCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      marginBottom: 20,
    },
    skeletonLine: {
      height: 20,
      width: 150,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
      marginBottom: 10,
    },
    skeletonLineSmall: {
      height: 16,
      width: 200,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
    },
  });

  if (!user) {
    return (
      <View style={styles.header}>
        <View>
          <View style={styles.skeletonContainer}>
            <View style={styles.skeletonCircle} />
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLineSmall} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      <View>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image
                source={{
                  uri: profileImage,
                  cache: 'reload',
                }}
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initialsText}>{getInitials(user.name)}</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.editIconContainer}
              onPress={pickImage}
              disabled={isLoading}
            >
              <Ionicons name="camera" size={20} color={theme.buttonText} />
            </TouchableOpacity>
            
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.buttonText} />
              </View>
            )}
          </View>

          <View>
            <Text style={styles.profileName}>{user.name || 'Usuário'}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default HeaderUser;