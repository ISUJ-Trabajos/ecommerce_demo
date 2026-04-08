import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

/**
 * Pantalla placeholder del panel admin.
 * Será reemplazada en la Fase 6.
 */
export default function AdminPlaceholder() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Ionicons name="build-outline" size={64} color={Colors.accent} />
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.user}>{user?.name} ({user?.email})</Text>
        <Text style={styles.subtitle}>Próximamente — Fase 6</Text>

        <Pressable
          style={styles.backBtn}
          onPress={() => router.replace('/(app)/catalog')}
        >
          <Ionicons name="storefront-outline" size={18} color={Colors.bg} />
          <Text style={styles.backBtnText}>Ir al Catálogo</Text>
        </Pressable>

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Syne_700Bold',
    fontSize: 22,
    color: Colors.text,
    marginTop: 16,
  },
  user: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.muted,
    marginTop: 8,
  },
  subtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.muted,
    marginTop: 6,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    marginTop: 32,
  },
  backBtnText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: Colors.bg,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 10,
  },
  logoutText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: Colors.danger,
  },
});
