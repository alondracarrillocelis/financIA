// app/_layout.tsx
import { UserProvider } from './context/UserContext';
import { Slot, Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <UserProvider>
      {/* <Slot />;
       */}

      <Stack
        screenOptions={{
          headerShown: false, // ocultamos headers globales
        }}
      />
    </UserProvider>
  );
}
