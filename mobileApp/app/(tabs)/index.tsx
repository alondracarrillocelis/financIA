import { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useUser } from '../context/UserContext';

export const screenOptions = {
  headerShown: false,
};

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const colorSet = Colors[theme];
  const { isRegistered } = useUser();

  useEffect(() => {
    if (isRegistered) {
      router.replace('/dashboard/dash'); // Redirige si ya está registrado
    }
  }, [isRegistered]);

  return (
    <View style={[styles.container, { backgroundColor: colorSet.background }]}>
      <Image
        source={require('../../assets/images/welcome.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: colorSet.text }]}>Welcome to the App</Text>
      <Text style={[styles.subtitle, { color: colorSet.muted }]}>
        Your journey starts here. Let's set up your profile.aaaa
      </Text>

      <Pressable
        onPress={() => router.push('/onboarding/nameGender')}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colorSet.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>

      <Text style={[styles.signInText, { color: colorSet.primary }]}>
        Sign In
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: '80%',
    height: 250,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  signInText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
