import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function CardDetail() {
  const theme = useColorScheme() ?? 'light';
  const colorSet = Colors[theme];
  const { id, type, number, balance, expiry } = useLocalSearchParams();

  const simulatedStats = [
    { label: 'Compras', value: 120 },
    { label: 'Transporte', value: 60 },
    { label: 'Comida', value: 150 },
    { label: 'Entretenimiento', value: 90 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colorSet.background }]}>
      <Stack.Screen options={{ title: 'Card Details' }} />

      <View style={[styles.card, { backgroundColor: colorSet.primary }]}>
        <Text style={styles.cardType}>{type}</Text>
        <Text style={styles.cardNumber}>{number}</Text>
        <View style={styles.cardRow}>
          <Text style={styles.cardBalance}>{balance}</Text>
          <Text style={styles.cardExpiry}>Exp: {expiry}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={[styles.detailTitle, { color: colorSet.text }]}>Estadísticas</Text>
        {simulatedStats.map((stat, idx) => (
          <View key={idx} style={{ marginBottom: 10 }}>
            <Text style={{ color: colorSet.text, fontSize: 16 }}>
              {stat.label}: ${stat.value}
            </Text>
            <View style={{ height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' }}>
              <View
                style={{
                  width: `${(stat.value / 200) * 100}%`,
                  height: '100%',
                  backgroundColor: colorSet.primary,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    borderRadius: 15,
    padding: 20,
    height: 200,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardType: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  cardNumber: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    letterSpacing: 2,
    marginVertical: 15,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardBalance: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  cardExpiry: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16 },
  detailsContainer: { marginTop: 20 },
  detailTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
});
