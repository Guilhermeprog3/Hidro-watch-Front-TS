import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/themecontext';

type StatsComponentProps = {
  connectedCount: number;
  disconnectedCount: number;
  devicesCount: number;
};

const StatsHome: React.FC<StatsComponentProps> = ({ connectedCount, disconnectedCount, devicesCount }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'transparent',
      padding: 10,
      borderRadius: 10,
      marginBottom: 20,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.textPrimary,
    },
    statText: {
      fontSize: 14,
      color: theme.textPrimary,
    },
  });

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{connectedCount}</Text>
        <Text style={styles.statText}>Conectados</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{devicesCount}</Text>
        <Text style={styles.statText}>Dispositivos</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{disconnectedCount}</Text>
        <Text style={styles.statText}>Desconectados</Text>
      </View>
    </View>
  );
};

export default StatsHome;