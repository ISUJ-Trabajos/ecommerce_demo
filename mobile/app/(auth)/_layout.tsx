import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

/**
 * Layout para pantallas de autenticación (login, registro).
 * Sin Tab Bar. Stack Navigator con estilo dark.
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.accent,
        headerTitleStyle: {
          fontFamily: 'Syne_700Bold',
          color: Colors.text,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.bg },
      }}
    >
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="register"
        options={{ title: 'Crear Cuenta' }}
      />
    </Stack>
  );
}
