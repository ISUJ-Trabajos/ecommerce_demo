import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { Colors } from '@/constants/colors';

/**
 * Pantalla placeholder del checkout.
 * Será reemplazada en la Fase 4.
 */
export default function CheckoutPlaceholder() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Ionicons name="card-outline" size={64} color={Colors.muted} />
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>Próximamente — Fase 4</Text>
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
