import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { Colors } from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import { orderService } from '@/services/orderService';
import OrderSuccessOverlay from '@/components/OrderSuccessOverlay';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const { total, items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Añade productos a tu carrito antes de continuar.');
      return;
    }

    setLoading(true);
    try {
      await orderService.createOrder();
      clearCart();
      setShowSuccess(true);
    } catch (error: any) {
      if (error.response?.status === 409) {
        Alert.alert(
          'Problema de Stock',
          error.response.data?.message || 'Uno de los productos ya no tiene stock suficiente.',
          [{ text: 'Entendido', onPress: () => router.push('/(app)/cart') }]
        );
      } else {
        Alert.alert('Error', 'No se pudo procesar tu pedido. Inténtalo de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <OrderSuccessOverlay visible={showSuccess} />

        <Text style={styles.pageTitle}>Checkout</Text>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen del pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Cantidad de items:</Text>
            <Text style={styles.summaryValue}>{items.length}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total a Pagar:</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.checkoutButton, (loading || items.length === 0) && styles.checkoutButtonDisabled]} 
          onPress={handleCheckout}
          disabled={loading || items.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.checkoutButtonText}>Confirmar y Pagar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: Colors.muted,
  },
  summaryValue: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  totalValue: {
    fontFamily: 'Syne_700Bold',
    fontSize: 24,
    color: Colors.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 'auto',
    marginBottom: 16,
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 18,
    color: '#000',
  },
});
