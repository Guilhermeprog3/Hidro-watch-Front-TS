import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const Week_page = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const [currentStartDay, setCurrentStartDay] = React.useState(0);

    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const results = [0, 0, 3, 7, 14, 0, 0];

    const nextDay = () => {
        setCurrentStartDay((currentStartDay + 1) % 7);
    };

    const prevDay = () => {
        setCurrentStartDay((currentStartDay + 6) % 7); 
    };

    const getBackgroundColor = (result: number) => {
        if (result <= 2) return '#DC0016';
        if (result <= 4) return '#F2EE00';
        if (result <= 8) return '#00FF11';
        if (result <= 10) return '#0011FF';
        if (result <= 13) return '#000483';
        return '#580D78';
    };

    const getDayResult = (index: number) => {
        const dayIndex = (currentStartDay + index) % 7;
        return (
            <View key={index} style={[styles.dayResult, { backgroundColor: getBackgroundColor(results[dayIndex]) }]}>
                <Text style={styles.dayText}>{results[dayIndex]}</Text>
                <Text style={styles.dayLabel}>{days[dayIndex]}</Text>
            </View>
        );
    };

    return (
        <LinearGradient colors={["#01002C", "#000481"]} style={styles.container}>
            <View>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>VOLTAR</Text>
                </View>
                <Text style={styles.headerText}>Bebedouro Do Corredor</Text>
                <Text style={styles.headerSubText}>Max: 14   Min: 7</Text>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.sectionTitle}>Resultados da Semana</Text>
                    <View style={styles.weekResults}>
                        <TouchableOpacity onPress={prevDay} style={styles.arrowButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        {[0, 1, 2, 3].map(i => getDayResult(i))}

                        <TouchableOpacity onPress={nextDay} style={styles.arrowButton}>
                            <Ionicons name="arrow-forward" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <LinearGradient colors={["#3E2D8F", "#9D52AC"]} style={styles.qualityCard}>
                        <Text style={styles.qualityText}>Média de Resultados</Text>
                        <Text style={styles.qualityStatus}>Boa Qualidade</Text>
                        <TouchableOpacity>
                            <Text style={styles.learnMore}>Saiba Mais {'>'}</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                    <View style={styles.waterInfo}>
                        <LinearGradient colors={["#3E2D8F", "#9D52AC"]} style={styles.infoBox}>
                            <Text style={styles.infoText}>0</Text>
                            <Text style={styles.infoLabel}>Ácida</Text>
                            <Text style={styles.infoDescription}>Água impura</Text>
                        </LinearGradient>

                        <LinearGradient colors={["#3E2D8F", "#9D52AC"]} style={styles.infoBox}>
                            <Text style={styles.infoText}>14</Text>
                            <Text style={styles.infoLabel}>Alcalina</Text>
                            <Text style={styles.infoDescription}>Água adequada</Text>
                        </LinearGradient>
                    </View>
                </ScrollView>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0F39',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        marginLeft: 10,
    },
    backButton: {
        color: '#FFFFFF',
        fontSize: 16,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    headerText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerSubText: {
        color: '#FFFFFF',
        fontSize: 20,
        marginTop: 8,
        textAlign: 'center',
        marginBottom: 20,
    },
    scrollContent: {
        paddingVertical: 20,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    weekResults: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    arrowButton: {
        padding: 0,
    },
    dayResult: {
        width: 60,
        height: 130,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    dayLabel: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    qualityCard: {
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        width: '86%',
        alignSelf: 'center',
    },
    qualityText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    qualityStatus: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    learnMore: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    waterInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoBox: {
        borderRadius: 15,
        width: '38%',
        padding: 15,
        alignItems: 'center',
        marginHorizontal: 22,
    },
    infoText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 5,
    },
    infoDescription: {
        color: '#A9A9A9',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
});

export default Week_page;
