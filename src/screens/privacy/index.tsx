"use client"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/themecontext"
import { SafeAreaView } from "react-native-safe-area-context"
import { type NavigationProp, useNavigation } from "@react-navigation/native"

const PrivacyPolicyScreen = () => {
  const { theme } = useTheme()
  const navigation = useNavigation<NavigationProp<any>>()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const lastUpdated = "15 de Maio de 2025"

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId))
    } else {
      setExpandedSections([...expandedSections, sectionId])
    }
  }

  const isSectionExpanded = (sectionId: string) => {
    return expandedSections.includes(sectionId)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.gradientStart,
    },
    content: {
      padding: 16,
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
    lastUpdated: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 24,
    },
    introduction: {
      fontSize: 15,
      color: theme.textPrimary,
      lineHeight: 22,
      marginBottom: 24,
    },
    sectionContainer: {
      marginBottom: 16,
      borderRadius: 8,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      overflow: "hidden",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
    },
    sectionContent: {
      padding: 16,
    },
    paragraph: {
      fontSize: 15,
      color: theme.textPrimary,
      lineHeight: 22,
      marginBottom: 12,
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: 8,
      paddingLeft: 8,
    },
    bullet: {
      fontSize: 15,
      color: theme.textPrimary,
      marginRight: 8,
      marginTop: 2,
    },
    bulletText: {
      fontSize: 15,
      color: theme.textPrimary,
      lineHeight: 22,
      flex: 1,
    },
    subheading: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
      marginTop: 16,
      marginBottom: 8,
    },
    contactSection: {
      marginTop: 24,
      padding: 16,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: 8,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: 12,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    contactIcon: {
      marginRight: 12,
    },
    contactText: {
      fontSize: 15,
      color: theme.textPrimary,
    },
  })

  const sections = [
    {
      id: "collection",
      title: "Coleta de Informações",
      content: (
        <>
          <Text style={styles.paragraph}>
            O Hidro-Watch coleta os seguintes tipos de informações para fornecer e melhorar nossos serviços:
          </Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={{ fontWeight: "bold" }}>Dados de dispositivos:</Text> Informações sobre os dispositivos de
              monitoramento de água conectados, incluindo identificadores, localização e medições.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={{ fontWeight: "bold" }}>Informações de conta:</Text> Nome, endereço de e-mail e outras informações fornecidas durante o registro.
            </Text>
          </View>

        </>
      ),
    },
    {
      id: "use",
      title: "Uso das Informações",
      content: (
        <>
          <Text style={styles.paragraph}>Utilizamos as informações coletadas para:</Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Fornecer, manter e melhorar os serviços do Hidro-Watch.</Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Processar e analisar dados de qualidade da água para gerar relatórios.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Enviar notificações sobre anomalias e alertas de consumo.</Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Comunicar atualizações, novos recursos e informações relacionadas ao serviço.
            </Text>
          </View>
        </>
      ),
    },
    {
      id: "sharing",
      title: "Compartilhamento de Dados",
      content: (
        <>
          <Text style={styles.paragraph}>
            O Hidro-Watch não vende ou aluga suas informações pessoais a terceiros. Podemos compartilhar informações nas
            seguintes circunstâncias:
          </Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={{ fontWeight: "bold" }}>Provedores de serviços:</Text> Compartilhamos dados com terceiros que
              nos ajudam a operar, fornecer e melhorar nossos serviços (como hospedagem em nuvem e análise de dados).
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={{ fontWeight: "bold" }}>Conformidade legal:</Text> Podemos divulgar informações quando
              exigido por lei ou para proteger direitos, propriedade ou segurança.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={{ fontWeight: "bold" }}>Com seu consentimento:</Text> Compartilharemos informações com
              terceiros quando você nos autorizar explicitamente a fazê-lo.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Todos os terceiros com quem compartilhamos dados estão sujeitos a obrigações de confidencialidade e só podem
            processar seus dados para os fins especificados.
          </Text>
        </>
      ),
    },
    {
      id: "security",
      title: "Segurança de Dados",
      content: (
        <>
          <Text style={styles.paragraph}>
            Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações contra acesso
            não autorizado, alteração, divulgação ou destruição. Estas medidas incluem:
          </Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Criptografia de dados em trânsito e em repouso.</Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Acesso restrito a informações pessoais.</Text>
          </View>

          <Text style={styles.paragraph}>
            Embora nos esforcemos para proteger suas informações, nenhum método de transmissão pela Internet ou
            armazenamento eletrônico é 100% seguro. Portanto, não podemos garantir segurança absoluta.
          </Text>
        </>
      ),
    },

    {
      id: "retention",
      title: "Retenção de Dados",
      content: (
        <>
          <Text style={styles.paragraph}>
            Mantemos seus dados pessoais pelo tempo necessário para fornecer os serviços solicitados e cumprir nossas
            obrigações legais. Os períodos de retenção específicos dependem do tipo de informação e dos requisitos
            legais aplicáveis.
          </Text>

          <Text style={styles.paragraph}>
            Dados de medição de água são mantidos por até 14 dias para permitir análises históricas e comparativas.
            Informações da conta são mantidas enquanto sua conta estiver ativa.
          </Text>

          <Text style={styles.paragraph}>
            Quando seus dados não forem mais necessários, serão excluídos ou anonimizados de forma segura.
          </Text>
        </>
      ),
    },
    {
      id: "changes",
      title: "Alterações na Política",
      content: (
        <>
          <Text style={styles.paragraph}>
            Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou
            por outros motivos operacionais, legais ou regulatórios.
          </Text>

          <Text style={styles.paragraph}>
            Notificaremos você sobre quaisquer alterações materiais através de um aviso no aplicativo ou por e-mail
            antes que as mudanças entrem em vigor. Recomendamos que você revise esta política regularmente para estar
            ciente de como protegemos suas informações.
          </Text>

          <Text style={styles.paragraph}>
            A data da última atualização será sempre indicada no início desta política.
          </Text>
        </>
      ),
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Política de Privacidade</Text>
        </View>

        <Text style={styles.lastUpdated}>Última atualização: {lastUpdated}</Text>

        <Text style={styles.introduction}>
          A Hidro-Watch está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como
          coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nosso aplicativo de
          monitoramento de água.
        </Text>

        {sections.map((section) => (
          <View key={section.id} style={styles.sectionContainer}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(section.id)}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Ionicons
                name={isSectionExpanded(section.id) ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
            {isSectionExpanded(section.id) && <View style={styles.sectionContent}>{section.content}</View>}
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Entre em Contato</Text>
          <Text style={styles.paragraph}>
            Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre nossas práticas de
            tratamento de dados, entre em contato conosco:
          </Text>

          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.contactIcon} />
            <Text style={styles.contactText}>hidro-watch@gmail.com</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PrivacyPolicyScreen
