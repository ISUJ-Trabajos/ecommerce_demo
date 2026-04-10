import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Tokens } from '@/constants/colors';
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/CartItem';

export default function CartScreen() {
  const { items, total, loadCart, updateQuantity, removeItem, isLoading, error, setError } = useCart();
  const [refreshing, setRefreshing] = useState(false);
  const [itemErrors, setItemErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    loadCart();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCart();
    setRefreshing(false);
  };

  const handleUpdateQuantity = async (id: number, newQty: number) => {
    try {
      setItemErrors((prev) => ({ ...prev, [id]: '' }));
      await updateQuantity(id, newQty);
    } catch (err: any) {
      setItemErrors((prev) => ({ ...prev, [id]: err.message || 'Error de stock' }));
    }
  };

  const handleRemove = async (id: number) => {
    Alert.alert('Eliminar', '¿Seguro que deseas eliminar este artículo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => removeItem(id) }
    ]);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (isLoading && items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Mi Carrito' }} />
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {error ? (
        <View style={styles.globalError}>
          <Text style={styles.globalErrorText}>{error}</Text>
          <Pressable onPress={() => setError(null)}>
            <Ionicons name="close" size={20} color={Colors.danger} />
          </Pressable>
        </View>
      ) : null}

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color={Colors.border} />
          <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          <Pressable style={styles.exploreBtn} onPress={() => router.push('/catalog')}>
            <Text style={styles.exploreBtnText}>Explorar catálogo</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                isLoading={isLoading}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                itemError={itemErrors[item.id]}
              />
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
            </View>
            <Pressable
              style={[styles.checkoutBtn, isLoading && styles.checkoutBtnDisabled]}
              onPress={handleCheckout}
              disabled={isLoading || items.length === 0}
            >
              <Text style={styles.checkoutBtnText}>IR AL CHECKOUT</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  globalError: {
    flexDirection: 'row',
    backgroundColor: 'rgba(235, 87, 87, 0.1)',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: Tokens.borderRadius.input,
    borderWidth: 1,
    borderColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  globalErrorText: {
    fontFamily: 'DMSans_400Regular',
    color: Colors.danger,
    fontSize: 14,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 18,
    color: Colors.muted,
  },
  exploreBtn: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.accent,
    borderRadius: Tokens.borderRadius.btn,
  },
  exploreBtnText: {
    fontFamily: 'DMSans_500Medium',
    color: Colors.bg,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  footer: {
    backgroundColor: Colors.surface,
    padding: 24,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    color: Colors.text,
  },
  totalAmount: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 24,
    color: Colors.accent,
  },
  checkoutBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: Tokens.borderRadius.btn,
    alignItems: 'center',
  },
  checkoutBtnDisabled: {
    opacity: 0.6,
  },
  checkoutBtnText: {
    fontFamily: 'Syne_700Bold',
    fontSize: 16,
    color: Colors.bg,
  },
});
