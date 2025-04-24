import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  useColorScheme
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useCards } from '../context/useCards';

export default function AddCardScreen() {
  const { addCard } = useCards();
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const colorSet = Colors[theme];

  const [type, setType] = useState('');
  const [number, setNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleSave = () => {
    if (!type || !number || !balance || !expiry) {
      Alert.alert('Campos incompletos', 'Por favor, completa todos los campos.');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      Alert.alert('Fecha inválida', 'La fecha debe tener el formato MM/YY.');
      return;
    }

    addCard({
      id: Date.now().toString(),
      type,
      number,
      balance,
      expiry,
      color: '#607D8B', // gris por defecto
    });

    router.back(); // Regresa al dashboard
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colorSet.background }]}>
      <Text style={[styles.title, { color: colorSet.text }]}>Agregar Nueva Tarjeta</Text>

      <Text style={[styles.label, { color: colorSet.text }]}>Tipo de Tarjeta</Text>
      <TextInput
        style={[styles.input, { color: colorSet.text, borderColor: colorSet.muted }]}
        placeholder="Visa, Mastercard, etc."
        placeholderTextColor={colorSet.muted}
        value={type}
        onChangeText={setType}
      />

      <Text style={[styles.label, { color: colorSet.text }]}>Número (últimos 4 dígitos)</Text>
      <TextInput
        style={[styles.input, { color: colorSet.text, borderColor: colorSet.muted }]}
        placeholder="•••• •••• •••• 1234"
        placeholderTextColor={colorSet.muted}
        value={number}
        onChangeText={setNumber}
      />

      <Text style={[styles.label, { color: colorSet.text }]}>Saldo</Text>
      <TextInput
        style={[styles.input, { color: colorSet.text, borderColor: colorSet.muted }]}
        placeholder="$0.00"
        placeholderTextColor={colorSet.muted}
        keyboardType="numeric"
        value={balance}
        onChangeText={setBalance}
      />

      <Text style={[styles.label, { color: colorSet.text }]}>Vencimiento</Text>
      <TextInput
        style={[styles.input, { color: colorSet.text, borderColor: colorSet.muted }]}
        placeholder="MM/YY"
        placeholderTextColor={colorSet.muted}
        value={expiry}
        onChangeText={setExpiry}
        maxLength={5}
      />

      <View style={styles.buttonContainer}>
        <Button title="Guardar Tarjeta" color={colorSet.primary} onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
