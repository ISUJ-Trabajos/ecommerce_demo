import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Tokens } from '@/constants/colors';
import { CartItem as CartItemType } from '@/services/cartService';
import StockAlert from '@/components/ui/StockAlert';
import { API_BASE_URL } from '@/constants/api';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, newQty: number) => void;
  onRemove: (id: number) => void;
  isLoading: boolean;
  itemError?: string; // Por si hay un error específico de este ítem
}

export default function CartItem({ item, onUpdateQuantity, onRemove, isLoading, itemError }: CartItemProps) {
  const imageUrl = item.image_url
    ? `${API_BASE_URL.replace('/api', '')}${item.image_url}`
    : null;

  const isOutOfStock = item.stock === 0;

  const handleDecrement = () => {
    if (item.quantity > 1 && !isLoading) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    // Aquí implementamos la lógica solicitada donde no se permite aumentar 
    // la cantidad por encima del stock disponible en la UI.
    if (item.quantity < item.stock && !isLoading) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  const isMaxStockReached = item.quantity >= item.stock;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <Ionicons name="image-outline" size={30} color={Colors.muted} />
        )}
        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>AGOTADO</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{item.product_name}</Text>
          <Pressable onPress={() => onRemove(item.id)} hitSlop={10} disabled={isLoading}>
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          </Pressable>
        </View>

        <Text style={styles.price}>${(Number(item.price) * item.quantity).toFixed(2)}</Text>
        
        {/* Usamos el StockAlert si el ítem excede la cantidad permitida, o hubo un error de stock */}
        {(itemError || item.quantity > item.stock) && (
          <StockAlert available={item.stock} outOfStock={isOutOfStock} />
        )}

        <View style={styles.actionsRow}>
          <View style={styles.quantityRow}>
            <Pressable
              style={[styles.qtyBtn, (item.quantity <= 1 || isLoading) && styles.qtyBtnDisabled]}
              onPress={handleDecrement}
              disabled={item.quantity <= 1 || isLoading}
            >
              <Ionicons
                name="remove"
                size={16}
                color={item.quantity <= 1 ? Colors.muted : Colors.text}
              />
            </Pressable>

            <View style={styles.qtyDisplay}>
              <Text style={styles.qtyText}>{item.quantity}</Text>
            </View>

            <Pressable
              style={[
                styles.qtyBtn,
                (isMaxStockReached || isLoading) && styles.qtyBtnDisabled,
              ]}
              onPress={handleIncrement}
              disabled={isMaxStockReached || isLoading || isOutOfStock}
            >
              <Ionicons
                name="add"
                size={16}
                color={isMaxStockReached ? Colors.muted : Colors.text}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 12,
    marginBottom: 12,
    borderRadius: Tokens.borderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: Tokens.borderRadius.input,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 19, 39, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    fontFamily: 'Syne_800ExtraBold',
    fontSize: 10,
    color: Colors.danger,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 16,
    color: Colors.accent,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Tokens.borderRadius.btn,
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyDisplay: {
    width: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  qtyText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 14,
    color: Colors.text,
  },
});
