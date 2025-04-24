import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useUserInfo } from '../context/UserInfoContext';
import { Ionicons } from '@expo/vector-icons';

interface Card {
  id: string;
  type: string;
  number: string;
  balance: string;
  expiry: string;
  color: string;
}

interface Stat {
  category: string;
  amount: string;
  percentage: number;
}

const expenseCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health'];

export default function DashboardScreen() {
  const theme = useColorScheme() ?? 'light';
  const colorSet = Colors[theme];
  const { firstName, lastName, gender } = useUserInfo();

  const [cards, setCards] = useState<Card[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [number, setNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [expiry, setExpiry] = useState('');
  const [color, setColor] = useState('#4a90e2');
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    if (cards.length > 0) {
      const totalBalance = cards.reduce((acc, card) => acc + parseFloat(card.balance), 0);
      const newStats = expenseCategories.map((cat) => {
        const randomAmount = Math.floor(Math.random() * 500);
        const percentage = Math.round((randomAmount / totalBalance) * 100);
        return {
          category: cat,
          amount: `$${randomAmount}`,
          percentage: isNaN(percentage) ? 0 : percentage,
        };
      });
      setStats(newStats);
    } else {
      setStats([]);
    }
  }, [cards]);

  const handleCardNumberChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, '');
    const formatted = digitsOnly.match(/.{1,4}/g)?.join('-') ?? '';
    setNumber(formatted);
  };

  const handleExpiryChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, '').slice(0, 4);
    const formatted =
      digitsOnly.length > 2 ? `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}` : digitsOnly;
    setExpiry(formatted);
  };

  const handleAddCard = () => {
    if (!type || !number || !balance || !expiry) {
      Alert.alert('Error', 'Todos los campos son requeridos');
      return;
    }

    const rawNumber = number.replace(/-/g, '');
    if (!/^\d{16}$/.test(rawNumber)) {
      Alert.alert('Error', 'Card number must be 16 digits');
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(balance)) {
      Alert.alert('Error', 'Balance must be a valid number (e.g. 1200 or 1200.50)');
      return;
    }

    const rawExpiry = expiry.replace(/\D/g, '');
    if (rawExpiry.length !== 4) {
      Alert.alert('Error', 'Expiry must be in MM/YY format');
      return;
    }

    const newCard: Card = {
      id: Date.now().toString(),
      type,
      number,
      balance,
      expiry,
      color,
    };

    setCards((prevCards) => [...prevCards, newCard]);

    setModalVisible(false);
    setType('');
    setNumber('');
    setBalance('');
    setExpiry('');
  };

  const getGenderIcon = () => {
    switch (gender) {
      case 'male':
        return require('../../assets/images/male-icon.png');
      case 'female':
        return require('../../assets/images/female-icon.png');
      default:
        return require('../../assets/images/female-icon.png');
    }
  };

  const getMotivationalMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! Time to conquer your financial goals!';
    if (hour < 18) return 'Good afternoon! Keep up with your savings!';
    return 'Good evening! Review your daily progress!';
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colorSet.background }]}>
        <View style={styles.profileSection}>
          <Image source={getGenderIcon()} style={styles.profileIcon} resizeMode="contain" />
          <Text style={[styles.userName, { color: colorSet.text }]}>{firstName || 'User'}</Text>
          <Text style={[styles.motivationText, { color: colorSet.muted }]}>
            {getMotivationalMessage()}
          </Text>
        </View>

        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, { color: colorSet.text }]}>Your Cards</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={28} color={colorSet.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardsContainer}>
          {cards.length === 0 ? (
            <Text style={{ color: colorSet.muted }}>There is any card yet. Add One!</Text>
          ) : (
            cards.map((card) => (
              <View key={card.id} style={styles.cardPressable}>
                <View style={[styles.card, { backgroundColor: card.color }]}>
                  <Text style={styles.cardType}>{card.type}</Text>
                  <Text style={styles.cardNumber}>{card.number}</Text>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardBalance}>{card.balance}</Text>
                    <Text style={styles.cardExpiry}>Exp: {card.expiry}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {stats.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colorSet.text }]}>Estimated Expenses</Text>
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <View style={styles.statHeader}>
                    <Text style={[styles.statCategory, { color: colorSet.text }]}>
                      {stat.category}
                    </Text>
                    <Text style={[styles.statAmount, { color: colorSet.text }]}>
                      {stat.amount}
                    </Text>
                  </View>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${stat.percentage}%`,
                          backgroundColor: colorSet.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.statPercentage, { color: colorSet.muted }]}>
                    {stat.percentage}%
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colorSet.card || colorSet.background },
            ]}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ position: 'absolute', right: 15, top: 15, zIndex: 10 }}
            >
              <Ionicons name="close" size={24} color={colorSet.text} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: colorSet.text }]}>Agregar Tarjeta</Text>
            <TextInput
              placeholder="Tipo (e.g. Visa, MasterCard)"
              style={[styles.input, { color: colorSet.text, borderColor: colorSet.border }]}
              value={type}
              onChangeText={setType}
            />
            <TextInput
              placeholder="Número (16 dígitos)"
              style={[styles.input, { color: colorSet.text, borderColor: colorSet.border }]}
              value={number}
              onChangeText={handleCardNumberChange}
              keyboardType="numeric"
              maxLength={19}
            />
            <TextInput
              placeholder="Expiración (MM/AA)"
              style={[styles.input, { color: colorSet.text, borderColor: colorSet.border }]}
              value={expiry}
              onChangeText={handleExpiryChange}
              keyboardType="numeric"
              maxLength={5}
            />
            <TextInput
              placeholder="Balance (ej: 1200)"
              style={[styles.input, { color: colorSet.text, borderColor: colorSet.border }]}
              value={balance}
              onChangeText={setBalance}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleAddCard}
                style={[styles.modalButton, { backgroundColor: colorSet.primary }]}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: colorSet.border }]}
              >
                <Text style={[styles.modalButtonText, { color: colorSet.text }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  profileSection: { alignItems: 'center', marginBottom: 30 },
  profileIcon: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  userName: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  motivationText: { fontSize: 16, textAlign: 'center', paddingHorizontal: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 20, fontWeight: '600' },
  cardsContainer: { marginBottom: 30 },
  cardPressable: { marginBottom: 15 },
  card: {
    borderRadius: 15,
    padding: 20,
    height: 180,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardType: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cardNumber: { color: 'rgba(255,255,255,0.8)', fontSize: 16, letterSpacing: 1 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardBalance: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  cardExpiry: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  statsContainer: { marginBottom: 30 },
  statItem: { marginBottom: 15 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  statCategory: { fontSize: 16 },
  statAmount: { fontSize: 16, fontWeight: '600' },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 4 },
  statPercentage: { fontSize: 14, textAlign: 'right' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContent: { borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: { fontWeight: 'bold', color: 'white' },
});
