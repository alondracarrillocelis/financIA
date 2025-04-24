import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function ready() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';

  return (
    <ScrollView style={{ backgroundColor: Colors[theme].background }}>
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <Text style={[styles.title, { color: Colors[theme].text }]}>You're almost ready!</Text>
        <Text style={[styles.subtitle, { color: Colors[theme].muted }]}>
          We've analyzed your answers and prepared an initial proposal.
        </Text>

        {/* Hardcoded Pre-Proposal */}
        <View style={[styles.proposalContainer, { backgroundColor: Colors[theme].card || '#f5f5f5', borderColor: Colors[theme].border || '#e0e0e0' }]}>
          <Text style={[styles.proposalTitle, { color: Colors[theme].text }]}>
            Financial Pre-Proposal
          </Text>

          <Text style={[styles.proposalSubtitle, { color: Colors[theme].tint }]}>
            AI Analysis based on your answers
          </Text>

          <View style={styles.proposalItem}>
            <Text style={[styles.proposalLabel, { color: Colors[theme].muted }]}>Risk profile:</Text>
            <Text style={[styles.proposalValue, { color: Colors[theme].text }]}>Moderate</Text>
          </View>

          <View style={styles.proposalItem}>
            <Text style={[styles.proposalLabel, { color: Colors[theme].muted }]}>Savings recommendation:</Text>
            <Text style={[styles.proposalValue, { color: Colors[theme].text }]}>20% of monthly income</Text>
          </View>

          <View style={styles.proposalItem}>
            <Text style={[styles.proposalLabel, { color: Colors[theme].muted }]}>Focus areas:</Text>
            <Text style={[styles.proposalValue, { color: Colors[theme].text }]}>Financial education, Budgeting</Text>
          </View>

          <View style={styles.proposalItem}>
            <Text style={[styles.proposalLabel, { color: Colors[theme].muted }]}>Budget plan:</Text>
            <Text style={[styles.proposalValue, { color: Colors[theme].text }]}>Personalized 50/30/20 plan</Text>
          </View>

          <View style={styles.proposalItem}>
            <Text style={[styles.proposalLabel, { color: Colors[theme].muted }]}>Goal strategy:</Text>
            <Text style={[styles.proposalValue, { color: Colors[theme].text }]}>Scheduled monthly savings to meet your short-term goals</Text>
          </View>

          <Text style={[styles.proposalNote, { color: Colors[theme].muted }]}>
            This is an initial assessment. We'll continue to personalize your experience as you use the app.
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/onboarding/register')}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: Colors[theme].tint,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  proposalContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  proposalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  proposalSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  proposalItem: {
    marginBottom: 16,
  },
  proposalLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  proposalValue: {
    fontSize: 16,
    paddingLeft: 10,
  },
  proposalNote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});