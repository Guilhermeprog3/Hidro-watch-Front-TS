import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themecontext';
import { Ionicons } from '@expo/vector-icons';

interface TermsOfUseModalProps {
  visible: boolean;
  onAgree: () => void;
  onDisagree: () => void;
  onViewFullTerms: () => void;
}

const TermsOfUseModal: React.FC<TermsOfUseModalProps> = ({ visible, onAgree, onDisagree, onViewFullTerms }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContainer: {
      width: '90%',
      maxHeight: '80%',
      borderRadius: 15,
      overflow: 'hidden',
    },
    gradient: {
      padding: 24,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerIcon: {
      marginRight: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.textPrimary,
      flex: 1,
    },
    scrollView: {
      maxHeight: 250,
      marginBottom: 20,
    },
    termsText: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    linkButton: {
      marginBottom: 20,
      alignSelf: 'flex-start',
    },
    linkText: {
      color: theme.buttonBackground,
      fontSize: 14,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    disagreeButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.red,
      marginRight: 10,
    },
    agreeButton: {
      backgroundColor: theme.buttonBackground,
      marginLeft: 10,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    disagreeText: {
      color: theme.red,
    },
    agreeText: {
      color: theme.buttonText,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.gradient}>
            <View style={styles.header}>
              <Ionicons name="document-text-outline" size={30} color={theme.iconColor} style={styles.headerIcon} />
              <Text style={styles.title}>Termos de Uso</Text>
            </View>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.termsText}>
                Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
                Nosso aplicativo coleta dados sobre a qualidade da água para fornecer análises e
                alertas. Suas informações de conta e dados de uso são utilizados para melhorar
                sua experiência. Não compartilhamos seus dados pessoais, exceto quando
                necessário para a operação do serviço ou exigido por lei.
              </Text>
            </ScrollView>

            <TouchableOpacity onPress={onViewFullTerms} style={styles.linkButton}>
              <Text style={styles.linkText}>Ver termos completos</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.disagreeButton]} onPress={onDisagree}>
                <Text style={[styles.buttonText, styles.disagreeText]}>Discordo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.agreeButton]} onPress={onAgree}>
                <Text style={[styles.buttonText, styles.agreeText]}>Concordo</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

export default TermsOfUseModal;