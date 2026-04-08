import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

/**
 * Pantalla placeholder del catálogo.
 * Será reemplazada por el catálogo real en la Fase 2.
 */
export default function CatalogPlaceholder() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.badge}>
          <Ionicons
            name={user?.role === 'admin' ? 'shield-checkmark' : 'person'}
            size={16}
            color={Colors.text}
          />
          <Text style={styles.badgeText}>{user?.role === 'admin' ? 'Administrador' : 'Cliente'}</Text>
        </View>

        <Text style={styles.placeholder}>
          Catálogo de productos{'\n'}(Próximamente — Fase 2)
        </Text>

        {user?.role === 'admin' && (
          <Pressable
            style={styles.adminBtn}
            onPress={() => router.push('/(admin)/')}
          >
            <Ionicons name="build-outline" size={18} color={Colors.bg} />
            <Text style={styles.adminBtnText}>Panel Admin</Text>
          </Pressable>
        )}

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
    paddingVertical: 40,
  },
  title: {
    fontFamily: 'Syne_800ExtraBold',
    fontSize: 28,
    color: Colors.text,
    marginTop: 20,
  },
  name: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 18,
    color: Colors.text,
    marginTop: 8,
  },
  email: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.muted,
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: Colors.text,
  },
  placeholder: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 40,
    lineHeight: 22,
  },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    marginTop: 24,
  },
  adminBtnText: {
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
