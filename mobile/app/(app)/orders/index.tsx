import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { Colors } from '@/constants/colors';

/**
 * Pantalla placeholder de pedidos.
 * Será reemplazada en la Fase 5.
 */
export default function OrdersPlaceholder() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Ionicons name="time-outline" size={64} color={Colors.muted} />
        <Text style={styles.title}>Mis Pedidos</Text>
        <Text style={styles.subtitle}>Próximamente — Fase 5</Text>
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
  subtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.muted,
    marginTop: 6,
  },
});
