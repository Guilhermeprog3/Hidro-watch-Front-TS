"use client"
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, type NavigationProp } from "@react-navigation/native"
import { useTheme } from "../../context/themecontext"

const HeaderUtil = () => {
  const navigation = useNavigation<NavigationProp<any>>()
  const { theme } = useTheme()

  const styles = StyleSheet.create({
    container: {
      paddingTop: Platform.OS === "ios" ? 50 : 30,
      zIndex: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="time-outline" size={24} color={theme.gradientEnd || "#FFFFFF"} />
          <Text style={styles.headerTitle}>Historico</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Search_history")}>
            <Ionicons name="search" size={24} color={theme.gradientEnd || "#FFFFFF"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default HeaderUtil
