import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { Colors } from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import { orderService } from '@/services/orderService';
import OrderSuccessOverlay from '@/components/OrderSuccessOverlay';
import { useRouter } from 'expo-router';
import SwipeToPay from '@/components/SwipeToPay';
import { API_BASE_URL } from '@/constants/api';

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
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <OrderSuccessOverlay visible={showSuccess} />

        {/* Header con botón de retorno */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/cart')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Checkout</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Zona de productos — ocupa el espacio restante */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Tus Productos</Text>
          <ScrollView
            showsVerticalScrollIndicator={true}
            indicatorStyle="white"
            style={styles.productScroll}
            contentContainerStyle={styles.productScrollContent}
          >
            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.imagePlaceholder}>
                  {item.image_url ? (
                    <Image source={{ uri: `${API_BASE_URL.replace('/api', '')}${item.image_url}` }} style={styles.image} />
                  ) : (
                    <Ionicons name="image-outline" size={24} color={Colors.muted} />
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.product_name}</Text>
                  <Text style={styles.itemQty}>Cant: {item.quantity}</Text>
                </View>
                <View style={styles.itemPriceInfo}>
                  <Text style={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
                  <Text style={styles.subtotalText}>
                    Subt: ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Zona fija inferior — Resumen + SwipeToPay pegados */}
        <View style={styles.bottomSection}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total de ítems:</Text>
              <Text style={styles.summaryValue}>{items.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Costo de envío:</Text>
              <Text style={styles.summaryValue}>¡Gratis!</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total a Pagar:</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
          <SwipeToPay
            onConfirm={handleCheckout}
            disabled={loading || items.length === 0}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  pageTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 22,
    color: Colors.text,
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
  },
  productScroll: {
    flex: 1,
  },
  productScrollContent: {
    paddingRight: 12, // espacio para la barra de scroll
    scrollbarColor: Colors.accent,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: Colors.bg,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  itemQty: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: Colors.accent,
  },
  itemPriceInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemPrice: {
    fontFamily: 'Syne_700Bold',
    fontSize: 15,
    color: Colors.text,
  },
  subtotalText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: Colors.muted,
    marginTop: 4,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: Colors.muted,
  },
  summaryValue: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  totalValue: {
    fontFamily: 'Syne_700Bold',
    fontSize: 22,
    color: Colors.accent,
  },
});
