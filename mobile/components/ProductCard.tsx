import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Tokens } from '@/constants/colors';
import Badge from '@/components/ui/Badge';
import { Product } from '@/services/productService';
import { API_BASE_URL } from '@/constants/api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - Tokens.spacing.screen * 2 - CARD_GAP) / 2;
const IMAGE_HEIGHT = 160;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

/**
 * Tarjeta de producto para el catálogo (grid 2 columnas).
 * Muestra imagen, categoría, nombre, precio y estado de stock.
 * Si stock = 0, se muestra overlay + botón deshabilitado.
 */
export default function ProductCard({ product, onPress }: ProductCardProps) {
  const [pressed, setPressed] = useState(false);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Construir URL de imagen
  const imageUrl = product.image_url
    ? `${API_BASE_URL.replace('/api', '')}${product.image_url}`
    : null;

  const getStockInfo = () => {
    if (isOutOfStock) return { label: 'Sin stock', color: Colors.danger };
    if (isLowStock) return { label: 'Pocas unidades', color: Colors.warning };
    return { label: 'En stock', color: Colors.success };
  };

  const stockInfo = getStockInfo();

  return (
    <Pressable
      style={[styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {/* Imagen */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color={Colors.muted} />
          </View>
        )}

        {/* Badge categoría */}
        <View style={styles.categoryBadge}>
          <Badge label={product.category_name} />
        </View>

        {/* Overlay sin stock */}
        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>AGOTADO</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.price}>
          ${Number(product.price).toFixed(2)}
        </Text>

        {/* Stock badge */}
        <View style={styles.stockRow}>
          <View style={[styles.stockDot, { backgroundColor: stockInfo.color }]} />
          <Text style={[styles.stockText, { color: stockInfo.color }]}>
            {stockInfo.label}
          </Text>
        </View>
      </View>

      {/* Botón */}
      <Pressable
        style={[
          styles.addButton,
          isOutOfStock && styles.addButtonDisabled,
        ]}
        disabled={isOutOfStock}
        onPress={onPress}
      >
        <Text
          style={[
            styles.addButtonText,
            isOutOfStock && styles.addButtonTextDisabled,
          ]}
        >
          {isOutOfStock ? 'Agotado' : 'AGREGAR ▸'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: Tokens.borderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Tokens.shadow.card,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: Colors.bg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 19, 39, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    fontFamily: 'Syne_700Bold',
    fontSize: 14,
    color: Colors.danger,
    letterSpacing: 1.5,
  },
  info: {
    padding: 12,
    gap: 4,
  },
  name: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    minHeight: 36,
  },
  price: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 16,
    color: Colors.accent,
    marginTop: 2,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
  },
  addButton: {
    backgroundColor: Colors.accent,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: Tokens.borderRadius.btn,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: Colors.border,
  },
  addButtonText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: Colors.bg,
    letterSpacing: 0.5,
  },
  addButtonTextDisabled: {
    color: Colors.muted,
  },
});
