import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, useColorScheme, Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useUser } from '../context/UserContext';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const colorSet = Colors[theme];
  const { name, gender } = useUser();

  // Datos falsos para las tarjetas
  const cards = [
    {
      id: 1,
      type: 'Visa',
      number: '•••• •••• •••• 1234',
      balance: '$2,450.50',
      expiry: '09/25',
      color: '#3A5A78'
    },
    {
      id: 2,
      type: 'Mastercard',
      number: '•••• •••• •••• 5678',
      balance: '$1,230.75',
      expiry: '12/24',
      color: '#6D4C41'
    }
  ];

  // Estadísticas falsas
  const stats = [
    { category: 'Food', amount: '$420', percentage: 35 },
    { category: 'Transport', amount: '$300', percentage: 25 },
    { category: 'Shopping', amount: '$280', percentage: 23 },
    { category: 'Entertainment', amount: '$200', percentage: 17 }
  ];

  // Obtener icono según género
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

  // Mensaje motivacional basado en la hora del día
  const getMotivationalMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! Time to conquer your financial goals!';
    if (hour < 18) return 'Good afternoon! Keep up with your savings!';
    return 'Good evening! Review your daily progress!';
  };

  const handleCardPress = (card: any) => {
    router.push({
      pathname: '/dashboard/cardDetail',
      params: {
        id: card.id.toString(),
        type: card.type,
        number: card.number,
        balance: card.balance,
        expiry: card.expiry,
        color: card.color
      }
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colorSet.background }]}>
      {/* Sección de perfil */}
      <View style={styles.profileSection}>
        <Image 
          source={getGenderIcon()} 
          style={styles.profileIcon} 
          resizeMode="contain"
        />
        <Text style={[styles.userName, { color: colorSet.text }]}>{name || 'User'}</Text>
        <Text style={[styles.motivationText, { color: colorSet.muted }]}>
          {getMotivationalMessage()}
        </Text>
      </View>

      {/* Sección de tarjetas */}
      <Text style={[styles.sectionTitle, { color: colorSet.text }]}>Your Cards</Text>
      <View style={styles.cardsContainer}>
        {cards.map((card) => (
          <Pressable
            key={card.id}
            onPress={() => handleCardPress(card)}
            style={({ pressed }) => [
              styles.cardPressable,
              { opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <View style={[styles.card, { backgroundColor: card.color }]}>
              <Text style={styles.cardType}>{card.type}</Text>
              <Text style={styles.cardNumber}>{card.number}</Text>
              <View style={styles.cardRow}>
                <Text style={styles.cardBalance}>{card.balance}</Text>
                <Text style={styles.cardExpiry}>Exp: {card.expiry}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Sección de estadísticas */}
      <Text style={[styles.sectionTitle, { color: colorSet.text }]}>Monthly Expenses</Text>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={[styles.statCategory, { color: colorSet.text }]}>{stat.category}</Text>
              <Text style={[styles.statAmount, { color: colorSet.text }]}>{stat.amount}</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill,
                  { 
                    width: `${stat.percentage}%`,
                    backgroundColor: colorSet.primary
                  }
                ]}
              />
            </View>
            <Text style={[styles.statPercentage, { color: colorSet.muted }]}>{stat.percentage}%</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  motivationText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  cardsContainer: {
    marginBottom: 30,
  },
  cardPressable: {
    marginBottom: 15,
  },
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
  cardType: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardNumber: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    letterSpacing: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBalance: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardExpiry: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    alignSelf: 'flex-end',
  },
  statsContainer: {
    marginBottom: 30,
  },
  statItem: {
    marginBottom: 15,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statCategory: {
    fontSize: 16,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statPercentage: {
    fontSize: 14,
    textAlign: 'right',
  },
});