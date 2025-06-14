"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/themecontext"
import { SafeAreaView } from "react-native-safe-area-context"
import { type NavigationProp, useNavigation } from "@react-navigation/native"

const AboutScreen = () => {
  const { theme } = useTheme()
  const appVersion = "1.0.0"
  const navigation = useNavigation<NavigationProp<any>>()

  const openPortfolio = () => {
    Linking.openURL("https://guilhermeriosdev.vercel.app");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.gradientStart,
    },
    content: {
      padding: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    appSection: {
      alignItems: "center",
      marginBottom: 30,
    },
    logoContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    logoIcon: {
      color: theme.iconColor,
    },
    appName: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 4,
    },
    tagline: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 8,
    },
    version: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
      paddingBottom: 8,
    },
    paragraph: {
      fontSize: 15,
      color: theme.textPrimary,
      lineHeight: 22,
      marginBottom: 12,
    },
    creatorSection: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    creatorAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    creatorInfo: {
      flex: 1,
    },
    creatorName: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 4,
    },
    creatorRole: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    featureIcon: {
      marginRight: 12,
      width: 24,
      alignItems: "center",
    },
    featureText: {
      fontSize: 15,
      color: theme.textPrimary,
      flex: 1,
    },
    contactButton: {
      backgroundColor: theme.buttonBackground,
      borderRadius: 8,
      padding: 14,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    contactButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: "500",
      marginLeft: 8,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sobre</Text>
        </View>

        <View style={styles.appSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="water-outline" size={64} style={styles.logoIcon} />
          </View>
          <Text style={styles.appName}>Hidro-Watch</Text>
          <Text style={styles.tagline}>Monitoramento inteligente de água</Text>
          <Text style={styles.version}>Versão {appVersion}</Text>
        </View>

        <View style={styles.creatorSection}>
          <View style={styles.creatorAvatar}>
            <Ionicons name="person" size={32} color={theme.textSecondary} />
          </View>
          <View style={styles.creatorInfo}>
            <Text style={styles.creatorName}>Guilherme Silva Rios</Text>
            <Text style={styles.creatorRole}>Desenvolvedor & Fundador</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
          <Text style={styles.paragraph}>
            O Hidro-Watch é uma solução avançada para monitoramento de água, projetada para ajudar usuários a acompanhar
            e gerenciar a qualidade da água em tempo real.
          </Text>
          <Text style={styles.paragraph}>
            Nosso aplicativo conecta-se a dispositivos de monitoramento para fornecer dados precisos e alertas
            importantes sobre o seu sistema de água.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Principais Funcionalidades</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="analytics-outline" size={20} color={theme.iconColor} />
            </View>
            <Text style={styles.featureText}>Monitoramento em tempo real da qualidade de água</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="notifications-outline" size={20} color={theme.iconColor} />
            </View>
            <Text style={styles.featureText}>Alertas e notificações de anomalias</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="bar-chart-outline" size={20} color={theme.iconColor} />
            </View>
            <Text style={styles.featureText}>relatórios semanais de qualidade</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="options-outline" size={20} color={theme.iconColor} />
            </View>
            <Text style={styles.featureText}>Configuração personalizada de dispositivos</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.contactButton} onPress={() => openPortfolio()}>
          <Ionicons name="mail-outline" size={20} color={theme.buttonText} />
          <Text style={styles.contactButtonText}>Entre em Contato</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AboutScreen
