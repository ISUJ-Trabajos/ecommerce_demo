import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';

/**
 * Layout para pantallas de administración.
 * Guard: solo permite acceso a usuarios con role='admin'.
 * Sin Tab Bar de cliente.
 */
export default function AdminLayout() {
  const { user, token, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  // Sin sesión → login
  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  // No es admin → catálogo
  if (!user || user.role !== 'admin') {
    return <Redirect href="/(app)/catalog" />;
  }

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
    />
  );
}
