// app/(onboarding)/_layout.tsx
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardLayout() {
  const theme = useColorScheme() ?? 'light';
  const colorSet = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorSet.primary,
        tabBarInactiveTintColor: colorSet.muted,
        tabBarStyle: {
          backgroundColor: colorSet.background,
          borderTopColor: colorSet.text + '20', // corregido
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colorSet.background,
        },
        headerTintColor: colorSet.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="dash"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Statistics",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          href: null, // Esto lo ocultará de la barra de tabs
        }}
      />
         <Tabs.Screen
        name="addCard"
        options={{
          href: null, // Oculta de la barra de tabs pero permite navegación
        }}
      />
      <Tabs.Screen
        name="cardDetail"
        options={{
          href: null, // También oculto
        }}
      />
   
    </Tabs>
  );
}
