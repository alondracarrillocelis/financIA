import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';

  const isFormComplete = email && password;

  const handleLogin = () => {
    // Aquí podrías validar las credenciales o hacer login simulado
    router.replace('/dashboard/dash');
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <Text style={[styles.title, { color: Colors[theme].text }]}>Log In</Text>

      <TextInput
        style={[styles.input, { borderColor: Colors[theme].text, color: Colors[theme].text }]}
        placeholder="Email"
        placeholderTextColor={Colors[theme].text + '80'}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, { borderColor: Colors[theme].text, color: Colors[theme].text }]}
        placeholder="Password"
        placeholderTextColor={Colors[theme].text + '80'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        onPress={handleLogin}
        disabled={!isFormComplete}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: isFormComplete
              ? Colors[theme].tint
              : Colors[theme].tint + '60',
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={styles.buttonText}>Log In</Text>
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
