"use client"

import { useState, useContext, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation, type NavigationProp } from "@react-navigation/native"
import { UserContext } from "../../context/usercontext"
import { useTheme } from "../../context/themecontext"
import HeaderBack from "../../components/headerBack"
import { Ionicons } from "@expo/vector-icons"

const RecoverPage = () => {
  const navigation = useNavigation<NavigationProp<any>>()
  const { theme } = useTheme()
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)

  const { forgotPassword } = useContext(UserContext)

  useEffect(() => {
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true))
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false))

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrorMessage("Por favor, insira seu endereço de e-mail.")
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage("Por favor, insira um email válido.")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      await forgotPassword(email)
      navigation.navigate("Codepass", { email })
    } catch (error: any) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    innerContainer: {
      flex: 1,
      paddingHorizontal: 24,
    },
    headerContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      paddingBottom: keyboardVisible ? 40 : 0,
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
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderRadius: 12,
      borderColor: emailFocused ? theme.buttonBackground : errorMessage ? theme.red : "rgba(255, 255, 255, 0.3)",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      paddingHorizontal: 12,
    },
    inputIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      height: 55,
      color: theme.textPrimary,
      fontSize: 16,
    },
    errorContainer: {
      marginTop: 10, // Adicionado para dar espaço quando o erro aparece
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
    infoContainer: {
      marginTop: 24,
      padding: 16,
      borderRadius: 12,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    infoText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    infoHighlight: {
      color: theme.textPrimary,
      fontWeight: "500",
    },
  })

  return (
    <LinearGradient colors={[theme.gradientstartlogin, theme.gradientendlogin]} style={styles.container}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <HeaderBack onBackPress={() => navigation.goBack()} />
          </View>

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <View style={styles.icon}>
                  <Ionicons name="key" size={40} color={theme.textPrimary} />
                </View>
              </View>

              <Text style={styles.title}>Recuperar Senha</Text>
              <Text style={styles.subtitle}>
                Digite o email associado à sua conta e enviaremos um código de verificação para redefinir sua senha.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={22} color={theme.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Seu email"
                    placeholderTextColor={theme.textSecondary}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text)
                      setErrorMessage("")
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    selectionColor={theme.buttonBackground}
                  />
                </View>

                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={20} color={theme.red} />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}
              </View>

              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleResetPassword}
                  disabled={isLoading}
                  activeOpacity={0.9}
                >
                  {isLoading ? <ActivityIndicator color={theme.buttonText} size="small" /> : null}
                  <Text style={styles.buttonText}>{isLoading ? "Enviando..." : "Enviar Código"}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Após receber o código, você poderá criar uma <Text style={styles.infoHighlight}>nova senha</Text> para
                  sua conta. Verifique também sua pasta de spam caso não encontre o email.
                </Text>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  )
}

export default RecoverPage