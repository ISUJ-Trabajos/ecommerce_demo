import { Redirect, Tabs, router } from 'expo-router';
import { ActivityIndicator, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { Colors, Tokens } from '@/constants/colors';

/**
 * Layout para pantallas protegidas del cliente.
 * Tab Bar inferior: Catálogo · Carrito · Pedidos.
 * Guard de sesión: redirige a login si no hay JWT.
 */
export default function AppLayout() {
  const { user, token, isLoading, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  // Mientras carga la sesión, mostrar spinner
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  // Guard: sin token → login
  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Global Persistente */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>ECM</Text>
          <Text style={[styles.headerTitle, { color: Colors.accent }]}>DEMO</Text>
        </View>
        <View style={styles.headerRight}>
          {user?.role === 'admin' && (
            <Pressable
              style={styles.headerBtn}
              onPress={() => router.push('/(admin)')}
            >
              <Ionicons name="build-outline" size={20} color={Colors.accent} />
            </Pressable>
          )}
          <Pressable style={styles.headerBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.muted} />
          </Pressable>
        </View>
      </View>

      <Tabs
        screenOptions={{
          headerShown: false, // Desactivamos el header por pantalla para usar el global
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: Colors.accent,
          tabBarInactiveTintColor: Colors.muted,
          tabBarLabelStyle: {
            fontFamily: 'DMSans_500Medium',
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="catalog"
          options={{
            title: 'Catálogo',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Carrito',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bag-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Pedidos',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
          }}
        />
        {/* Ocultar checkout y otras sub-pantallas de la tab bar */}
        <Tabs.Screen
          name="checkout"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    height: 60,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Tokens.spacing.screen,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 25,
    color: Colors.text,
    letterSpacing: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 8,
  },
});