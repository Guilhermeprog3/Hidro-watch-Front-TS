"use client"
import { View, TouchableOpacity, Text, StyleSheet, Linking, Alert, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, type NavigationProp } from "@react-navigation/native"
import { useTheme } from "../../context/themecontext"
import * as Camera from "expo-camera"
import { LinearGradient } from "expo-linear-gradient"

const HeaderHome = () => {
  const navigation = useNavigation<NavigationProp<any>>()
  const { theme } = useTheme()
  const [cameraPermission, requestPermission] = Camera.useCameraPermissions()

  const handleAddDevicePress = async () => {
    if (cameraPermission?.granted) {
      navigation.navigate("QRCode")
      return
    }

    const { granted, canAskAgain } = await requestPermission()

    if (granted) {
      navigation.navigate("QRCode")
    } else if (!canAskAgain) {
      Alert.alert(
        "Permissão de Câmera Negada",
        "Você negou a permissão de câmera permanentemente. Para usar esta funcionalidade, habilite a permissão manualmente nas configurações do dispositivo.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Abrir Configurações", onPress: () => Linking.openSettings() },
        ],
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      paddingTop: Platform.OS === "ios" ? 50 : 30,
      zIndex: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 25,
      paddingBottom: 10,
      backgroundColor: "transparent",
      zIndex: 10,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginLeft: 8,
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconButton: {
      padding: 8,
      borderRadius: 20,
      marginLeft: 15,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    addButtonContainer: {
      marginTop: 20,
      marginBottom: 20,
      alignItems: "center",
      zIndex: 10,
      position: "relative",
    },
    addButton: {
      width: "90%",
      borderRadius: 40,
      overflow: "hidden",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      backgroundColor:theme.buttonBackground
    },
    gradient: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    addButtonText: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
      textShadowColor: "rgba(0, 0, 0, 0.2)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="home" size={24} color={theme.navBarIconColor} />
          <Text style={styles.headerTitle}>Início</Text>
        </View>

        <View style={styles.headerRight}>

          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Search_home")}>
            <Ionicons name="search" size={24} color={theme.navBarIconColor} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleAddDevicePress} style={styles.addButton}>
          <LinearGradient
            colors={[theme.gradientStart || "#4A90E2", theme.gradientEnd || "#5A5DE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Ionicons name="add-circle-outline" size={22} color={theme.textPrimary} />
            <Text style={styles.addButtonText}>Adicionar um Novo Dispositivo</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HeaderHome
