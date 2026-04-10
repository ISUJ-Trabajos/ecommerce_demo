import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface Props {
  visible: boolean;
}

export default function OrderSuccessOverlay({ visible }: Props) {
  const router = useRouter();

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Ionicons name="checkmark-circle" size={80} color={Colors.success} style={styles.icon} />
        <Text style={styles.title}>¡Pedido Confirmado!</Text>
        <Text style={styles.subtitle}>Tu compra se ha realizado con éxito.</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            router.dismissAll();
            router.push('/(app)/orders');
          }}
        >
          <Text style={styles.primaryButtonText}>Ver mis pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            router.dismissAll();
            router.push('/(app)/catalog');
          }}
        >
          <Text style={styles.secondaryButtonText}>Seguir comprando</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Syne_700Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 32,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontFamily: 'DMSans_700Bold',
    color: '#000',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontFamily: 'DMSans_700Bold',
    color: Colors.text,
    fontSize: 16,
  },
});
