import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themecontext';

interface MenuOptionsProps {
  onThemePress: () => void;
  onNotificationsToggle: (value: boolean) => void;
  onCameraToggle: (value: boolean) => void;
  onPhotosToggle: (value: boolean) => void;
  notificationsEnabled: boolean;
  cameraEnabled: boolean;
  photosEnabled: boolean;
}

const MenuOptionsConfig: React.FC<MenuOptionsProps> = ({
  onThemePress,
  onNotificationsToggle,
  onCameraToggle,
  onPhotosToggle,
  notificationsEnabled,
  cameraEnabled,
  photosEnabled,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    menuContainer: {
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textPrimary,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.textSecondary,
      paddingHorizontal: 16,
    },
    menuItemText: {
      fontSize: 18,
      color: theme.textPrimary,
      marginLeft: 10,
      flex: 1,
    },
    separator: {
      height: 1,
      backgroundColor: theme.textSecondary,
      marginVertical: 10,
    },
  });

  return (
    <View style={styles.menuContainer}>
      <Text style={styles.sectionTitle}>Preferências</Text>
      <TouchableOpacity style={styles.menuItem} onPress={onThemePress}>
        <Text style={styles.menuItemText}>Tema</Text>
        <Ionicons name="chevron-forward-outline" size={24} color={theme.iconColor} />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Permissões</Text>
      <View style={styles.menuItem}>
        <Ionicons name="notifications-outline" size={24} color={theme.iconColor} />
        <Text style={styles.menuItemText}>Notificações</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={onNotificationsToggle}
          trackColor={{ false: "#767577", true: theme.iconColor }}
          thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>
      <View style={styles.menuItem}>
        <Ionicons name="camera-outline" size={24} color={theme.iconColor} />
        <Text style={styles.menuItemText}>Câmera</Text>
        <Switch
          value={cameraEnabled}
          onValueChange={onCameraToggle}
          trackColor={{ false: "#767577", true: theme.iconColor }}
          thumbColor={cameraEnabled ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>
      <View style={styles.menuItem}>
        <Ionicons name="image-outline" size={24} color={theme.iconColor} />
        <Text style={styles.menuItemText}>Fotos e Vídeos</Text>
        <Switch
          value={photosEnabled}
          onValueChange={onPhotosToggle}
          trackColor={{ false: "#767577", true: theme.iconColor }}
          thumbColor={photosEnabled ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>

      <Text style={styles.sectionTitle}>Sobre</Text>
      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Ionicons name="document-text-outline" size={24} color={theme.iconColor} />
        <Text style={styles.menuItemText}>Termo de Uso</Text>
        <Ionicons name="chevron-forward-outline" size={24} color={theme.iconColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Ionicons name="shield-checkmark-outline" size={24} color={theme.iconColor} />
        <Text style={styles.menuItemText}>Política de Privacidade</Text>
        <Ionicons name="chevron-forward-outline" size={24} color={theme.iconColor} />
      </TouchableOpacity>
    </View>
  );
};

export default MenuOptionsConfig;