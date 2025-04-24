import { Stack } from 'expo-router';
import { UserInfoProvider } from './context/UserInfoContext';

export default function RootLayout() {
  return (
    <UserInfoProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </UserInfoProvider>
  );
}
