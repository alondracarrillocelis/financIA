import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { useUserInfo } from '../context/UserInfoContext';

export default function NameGenderScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const { firstName, setFirstName, gender, setGender, isRegistered } = useUserInfo();

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <Text style={[styles.label, { color: Colors[theme].text }]}>What is your name?</Text>
      <TextInput
        style={[styles.input, { borderColor: Colors[theme].text, color: Colors[theme].text }]}
        placeholder="Enter your name"
        placeholderTextColor={Colors[theme].text + '80'}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={[styles.label, { color: Colors[theme].text, marginTop: 24 }]}>Choose your gender</Text>
      <View style={styles.genderContainer}>
        {['male', 'female'].map((option) => (
          <Pressable
            key={option}
            onPress={() => setGender(option as 'male' | 'female')}
            style={[
              styles.genderButton,
              {
                backgroundColor: gender === option ? Colors[theme].tint : Colors[theme].background,
                borderColor: Colors[theme].tint,
              },
            ]}
          >
            <Text
              style={{
                color: gender === option ? '#fff' : Colors[theme].text,
                fontWeight: '500',
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => router.push('/onboarding/questions')}
        disabled={!isRegistered}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: isRegistered
              ? Colors[theme].tint
              : Colors[theme].tint + '60',
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    marginBottom: 40,
  },
  genderButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
