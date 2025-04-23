import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function CardDetail() {
  const theme = useColorScheme() ?? 'light';
  const colorSet = Colors[theme];
  const { id, type, number, balance, expiry } = useLocalSearchParams();

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
        <Text style={[styles.detailTitle, { color: colorSet.text }]}>Transaction History</Text>
        {/* Aquí puedes agregar la lista de transacciones */}
        <Text style={[styles.comingSoon, { color: colorSet.muted }]}>Coming soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    height: 200,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardType: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardNumber: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    letterSpacing: 2,
    marginVertical: 15,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardBalance: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardExpiry: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  comingSoon: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});