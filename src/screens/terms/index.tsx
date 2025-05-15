"use client"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/themecontext"
import { SafeAreaView } from "react-native-safe-area-context"
import { type NavigationProp, useNavigation } from "@react-navigation/native"

const TermsOfUseScreen = () => {
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
    acceptanceSection: {
      marginTop: 24,
      padding: 16,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: 8,
      marginBottom: 24,
    },
    acceptanceTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: 12,
    },
    contactSection: {
      marginTop: 8,
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
    bold: {
      fontWeight: "bold",
    },
  })

  // Terms of Use Sections
  const sections = [
    {
      id: "acceptance",
      title: "Aceitação dos Termos",
      content: (
        <>
          <Text style={styles.paragraph}>
            Ao acessar ou usar o aplicativo Hidro-Watch, você concorda em ficar vinculado a estes Termos de Uso. Se você
            não concordar com qualquer parte destes termos, não poderá acessar ou usar o aplicativo.
          </Text>
          <Text style={styles.paragraph}>
            Estes termos constituem um acordo legal entre você e Hidro-Watch, desenvolvido por Guilherme Silva Rios,
            referido como "nós", "nosso" ou "Hidro-Watch".
          </Text>
        </>
      ),
    },
    {
      id: "account",
      title: "Conta de Usuário",
      content: (
        <>
          <Text style={styles.paragraph}>
            Para utilizar determinados recursos do aplicativo, você pode precisar criar uma conta. Você é responsável
            por:
          </Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Manter a confidencialidade de suas credenciais de login e senha.</Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Todas as atividades que ocorrem sob sua conta.</Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Reservamo-nos o direito de encerrar contas inativas por períodos prolongados ou contas que violem estes
            termos.
          </Text>
        </>
      ),
    },
    {
      id: "usage",
      title: "Uso do Aplicativo",
      content: (
        <>
          <Text style={styles.paragraph}>Ao usar o Hidro-Watch, você concorda em:</Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Usar o aplicativo apenas para fins legais e de acordo com estes termos.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Não usar o aplicativo de maneira que possa danificar, desabilitar ou sobrecarregar nossos servidores ou
              redes.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Não tentar acessar áreas restritas do aplicativo ou tentar contornar medidas de segurança.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Não usar o aplicativo para coletar dados de outros usuários sem autorização.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Reservamo-nos o direito de suspender ou encerrar seu acesso ao aplicativo por violação destes termos.
          </Text>
        </>
      ),
    },
    {
      id: "devices",
      title: "Dispositivos de Monitoramento",
      content: (
        <>
          <Text style={styles.paragraph}>
            O Hidro-Watch conecta-se a dispositivos de monitoramento de água. Em relação a estes dispositivos:
          </Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Você é responsável pela instalação e manutenção adequadas dos dispositivos.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              O aplicativo fornece dados com base nas informações recebidas dos dispositivos, mas não pode garantir a
              precisão absoluta dessas medições.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Você deve seguir as instruções do fabricante para a instalação e uso dos dispositivos.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Não somos responsáveis por danos causados por instalação incorreta ou uso indevido dos dispositivos de
            monitoramento.
          </Text>
        </>
      ),
    },
    {
      id: "intellectual",
      title: "Propriedade Intelectual",
      content: (
        <>
          <Text style={styles.paragraph}>
            O aplicativo Hidro-Watch, incluindo seu código, design, logotipos, textos e outros conteúdos, é protegido
            por leis de propriedade intelectual.
          </Text>

          <Text style={styles.paragraph}>Você não tem permissão para:</Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Copiar, modificar, distribuir ou vender qualquer parte do aplicativo.</Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Realizar engenharia reversa ou tentar extrair o código-fonte do aplicativo.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Remover avisos de direitos autorais ou marcas registradas do aplicativo.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Concedemos a você uma licença limitada, não exclusiva e não transferível para usar o aplicativo para fins
            pessoais.
          </Text>
        </>
      ),
    },
    {
      id: "updates",
      title: "Atualizações e Modificações",
      content: (
        <>
          <Text style={styles.paragraph}>Reservamo-nos o direito de:</Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Modificar ou descontinuar, temporária ou permanentemente, o aplicativo ou qualquer parte dele.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Atualizar o aplicativo com correções de bugs, melhorias de funcionalidade ou novos recursos.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Alterar estes Termos de Uso a qualquer momento.</Text>
          </View>

          <Text style={styles.paragraph}>
            Faremos esforços razoáveis para notificá-lo sobre mudanças significativas nos termos. O uso continuado do
            aplicativo após tais alterações constitui sua aceitação dos novos termos.
          </Text>
        </>
      ),
    },
    {
      id: "disclaimer",
      title: "Isenção de Responsabilidade",
      content: (
        <>
          <Text style={styles.paragraph}>
            O aplicativo Hidro-Watch é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo,
            expressas ou implícitas.
          </Text>

          <Text style={styles.paragraph}>Não garantimos que:</Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>O aplicativo atenderá a todos os seus requisitos específicos.</Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>O aplicativo será ininterrupto, oportuno, seguro ou livre de erros.</Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Os resultados obtidos do uso do aplicativo serão precisos ou confiáveis.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Quaisquer erros no aplicativo serão corrigidos.</Text>
          </View>

          <Text style={styles.paragraph}>
            O aplicativo não substitui o julgamento profissional para decisões relacionadas à qualidade da água ou
            sistemas hidráulicos.
          </Text>
        </>
      ),
    },
    {
      id: "limitation",
      title: "Limitação de Responsabilidade",
      content: (
        <>
          <Text style={styles.paragraph}>
            Em nenhuma circunstância o Hidro-Watch, seus desenvolvedores, funcionários ou afiliados serão responsáveis
            por:
          </Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Perda de lucros, receitas, dados, uso ou outras perdas intangíveis.</Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Danos resultantes de decisões tomadas com base nas informações fornecidas pelo aplicativo.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Esta limitação se aplica independentemente da base legal da reivindicação e mesmo se tivermos sido
            informados da possibilidade de tais danos.
          </Text>
        </>
      ),
    },
    {
      id: "governing",
      title: "Lei Aplicável",
      content: (
        <>
          <Text style={styles.paragraph}>
            Estes Termos de Uso serão regidos e interpretados de acordo com as leis do Brasil, sem considerar suas
            disposições de conflito de leis.
          </Text>

          <Text style={styles.paragraph}>
            Qualquer disputa decorrente ou relacionada a estes termos será submetida à jurisdição exclusiva dos
            tribunais localizados em São Paulo, Brasil.
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
          <Text style={styles.headerTitle}>Termos de Uso</Text>
        </View>

        <Text style={styles.lastUpdated}>Última atualização: {lastUpdated}</Text>

        <Text style={styles.introduction}>
          Bem-vindo ao Hidro-Watch. Estes Termos de Uso regem seu acesso e uso do aplicativo Hidro-Watch, incluindo
          todos os recursos, funcionalidades e serviços associados. Por favor, leia atentamente estes termos antes de
          usar o aplicativo.
        </Text>

        <View style={styles.acceptanceSection}>
          <Text style={styles.acceptanceTitle}>Aceitação dos Termos</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>
              Ao usar o aplicativo Hidro-Watch, você confirma que leu, entendeu e concorda com estes Termos de Uso.
            </Text>{" "}
            Se você não concordar com qualquer parte destes termos, não use o aplicativo.
          </Text>
        </View>

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
            Se você tiver dúvidas ou preocupações sobre estes Termos de Uso, entre em contato conosco:
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

export default TermsOfUseScreen
