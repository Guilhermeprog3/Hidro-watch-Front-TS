"use client"

import { useState, useContext, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, type RouteProp, type NavigationProp } from "@react-navigation/native"
import { UserContext } from "../../context/usercontext"
import { AuthContext } from "../../context/authcontext"
import { useTheme } from "../../context/themecontext"
import HeaderBack from "../../components/headerBack"

type RootStackParamList = {
  Login: undefined
  Newpassword: { code: string }
  HomeLayout: undefined
}

type NewPasswordRouteProp = RouteProp<RootStackParamList, "Newpassword">

const NewPassword = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, "Newpassword">>()
  const route = useRoute<NewPasswordRouteProp>()
  const { user } = useContext(AuthContext)
  const { theme } = useTheme()
  const [password, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const shakeAnim = useRef(new Animated.Value(0)).current
  const successAnim = useRef(new Animated.Value(0)).current

  const { resetPassword } = useContext(UserContext)
  const { code } = route.params

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true))
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false))

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start()
  }

  const animateSuccess = () => {
    Animated.timing(successAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  const validateFields = () => {
    if (!password || !confirmPassword) {
      setErrorMessage("A senha não pode estar vazia.")
      shakeError()
      return false
    } else if (password.length < 8) {
      setErrorMessage("A senha deve ter no mínimo 8 caracteres.")
      shakeError()
      return false
    }  else if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.")
      shakeError()
      return false
    }

    setErrorMessage("")
    return true
  }

  const handleResetPassword = async () => {
    if (!validateFields()) {
      return
    }

    setIsLoading(true)

    try {
      await resetPassword(code, password)
      animateSuccess()
      setIsModalVisible(true)
    } catch (error: any) {
      setErrorMessage(error.message)
      shakeError()
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    const token = user?.token
    if (token) {
      navigation.navigate("HomeLayout")
    } else {
      navigation.navigate("Login")
    }
  }

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword)
  }

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return theme.red
    if (passwordStrength <= 3) return "#FFA500" 
    return "#4CAF50"
  }

  const getStrengthText = () => {
    if (!password) return ""
    if (passwordStrength <= 1) return "Fraca"
    if (passwordStrength <= 3) return "Média"
    return "Forte"
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingBottom: keyboardVisible ? 20 : 0,
    },
    headerContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    iconContainer: {
      marginBottom: 30,
      alignItems: "center",
    },
    icon: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: 16,
      borderRadius: 50,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 16,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 32,
      textAlign: "center",
      lineHeight: 22,
    },
    inputContainer: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: 8,
      marginLeft: 4,
    },
    passwordInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderRadius: 12,
      marginBottom: 16,
      borderColor: passwordFocused ? theme.buttonBackground : errorMessage ? theme.red : "rgba(255, 255, 255, 0.3)",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    passwordInput: {
      flex: 1,
      height: 55,
      paddingHorizontal: 16,
      color: theme.textPrimary,
      fontSize: 16,
    },
    eyeIcon: {
      padding: 12,
    },
    strengthContainer: {
      marginBottom: 20,
    },
    strengthText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 6,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    strengthBarContainer: {
      height: 6,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 3,
      overflow: "hidden",
      flexDirection: "row",
    },
    strengthBar: {
      height: "100%",
      borderRadius: 3,
    },
    strengthLabelContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
    },
    strengthLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    button: {
      backgroundColor: theme.buttonBackground,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      flexDirection: "row",
      justifyContent: "center",
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: isLoading ? 12 : 0,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContent: {
      backgroundColor: theme.gradientEnd,
      padding: 24,
      borderRadius: 16,
      alignItems: "center",
      width: "85%",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    successIconContainer: {
      backgroundColor: "rgba(76, 175, 80, 0.2)",
      borderRadius: 50,
      padding: 16,
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textPrimary,
      marginBottom: 8,
      textAlign: "center",
    },
    modalText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 24,
      textAlign: "center",
      lineHeight: 22,
    },
    modalButton: {
      backgroundColor: theme.buttonBackground,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      width: "100%",
      alignItems: "center",
    },
    modalButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: "bold",
    },
    errorContainer: {
      marginBottom: 20,
      padding: 12,
      borderRadius: 8,
      backgroundColor: "rgba(255, 0, 0, 0.1)",
      borderLeftWidth: 4,
      borderLeftColor: theme.red,
      flexDirection: "row",
      alignItems: "center",
    },
    errorText: {
      fontSize: 14,
      color: theme.red,
      flex: 1,
      marginLeft: 8,
    },
    passwordRequirements: {
      marginTop: 8,
      marginBottom: 16,
    },
    requirementItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    requirementText: {
      fontSize: 13,
      color: theme.textSecondary,
      marginLeft: 8,
    },
  })

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.headerContainer}>
        <HeaderBack onBackPress={() => navigation.goBack()} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.iconContainer}>
              <View style={styles.icon}>
                <Ionicons name="lock-closed" size={40} color={theme.textPrimary} />
              </View>
            </View>

            <Text style={styles.title}>Redefinir Senha</Text>
            <Text style={styles.subtitle}>
              Crie uma nova senha segura para sua conta. Recomendamos usar uma combinação de letras, números e símbolos.
            </Text>

            <Animated.View style={[styles.inputContainer, { transform: [{ translateX: shakeAnim }] }]}>
              <Text style={styles.inputLabel}>Nova Senha</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Digite sua nova senha"
                  placeholderTextColor={theme.textSecondary}
                  value={password}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  selectionColor={theme.buttonBackground}
                />
                <TouchableOpacity onPress={toggleShowNewPassword} style={styles.eyeIcon}>
                  <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Confirmar Senha</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirme sua nova senha"
                  placeholderTextColor={theme.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  selectionColor={theme.buttonBackground}
                />
                <TouchableOpacity onPress={toggleShowConfirmPassword} style={styles.eyeIcon}>
                  <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color={theme.red} />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}
            </Animated.View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? <ActivityIndicator color="white" size="small" /> : null}
              <Text style={styles.buttonText}>{isLoading ? "Redefinindo..." : "Redefinir Senha"}</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: successAnim,
                transform: [
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
            </View>
            <Text style={styles.modalTitle}>Senha Redefinida!</Text>
            <Text style={styles.modalText}>
              Sua senha foi alterada com sucesso. Você já pode fazer login com sua nova senha.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal} activeOpacity={0.8}>
              <Text style={styles.modalButtonText}>Continuar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </LinearGradient>
  )
}

export default NewPassword
