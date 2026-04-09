import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Tokens } from '@/constants/colors';
import Badge from '@/components/ui/Badge';
import StockAlert from '@/components/ui/StockAlert';
import { getProductById, Product } from '@/services/productService';
import { API_BASE_URL } from '@/constants/api';
import { useCart } from '@/hooks/useCart';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_HEIGHT = 260;

/**
 * Pantalla de Detalle de Producto — MOD-03
 * Imagen ampliada, información completa, indicador de stock,
 * selector de cantidad y botón agregar al carrito.
 */
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addPressed, setAddPressed] = useState(false);
  const { addItemToCart, isLoading: isAddingToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    getProductById(Number(id))
      .then(setProduct)
      .catch((err) => {
        console.error('Error al cargar producto:', err);
        if (err.response?.status === 404) {
          setError('Producto no encontrado');
        } else {
          setError('Error al cargar el producto');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Cargando...' }} />
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Ionicons name="alert-circle-outline" size={60} color={Colors.danger} />
        <Text style={styles.errorText}>{error || 'Producto no encontrado'}</Text>
      </View>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const imageUrl = product.image_url
    ? `${API_BASE_URL.replace('/api', '')}${product.image_url}`
    : null;

  const getStockIndicator = () => {
    if (isOutOfStock)
      return { icon: '⛔', text: 'Sin stock disponible', color: Colors.danger };
    if (isLowStock)
      return {
        icon: '⚠',
        text: `Pocas unidades: ${product.stock} disponibles`,
        color: Colors.warning,
      };
    return {
      icon: '✅',
      text: `Stock disponible: ${product.stock} unidades`,
      color: Colors.success,
    };
  };

  const stockIndicator = getStockIndicator();

  const handleDecrement = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleIncrement = () => {
    if (quantity < product.stock) setQuantity((q) => q + 1);
  };

  const handleAddToCart = async () => {
    try {
      await addItemToCart(product.id, quantity);
      router.push('/cart');
    } catch (err: any) {
      alert(err.message || 'Error al agregar al carrito');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `${product.name}`,
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontFamily: 'Syne_700Bold' },
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingRight: 16 }}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
              <Ionicons name="image-outline" size={60} color={Colors.muted} />
            </View>
          )}
          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>AGOTADO</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Badge categoría */}
          <Badge label={product.category_name} />

          {/* Nombre */}
          <Text style={styles.name}>{product.name}</Text>

          {/* Precio */}
          <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>

          {/* Descripción */}
          {product.description && (
            <>
              <View style={styles.divider} />
              <Text style={styles.description}>{product.description}</Text>
            </>
          )}

          <View style={styles.divider} />

          {/* Indicador de stock */}
          <Text style={[styles.stockIndicator, { color: stockIndicator.color }]}>
            {stockIndicator.icon} {stockIndicator.text}
          </Text>

          {/* Selector de cantidad */}
          {!isOutOfStock && (
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Cantidad:</Text>
              <View style={styles.quantityRow}>
                <Pressable
                  style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                  onPress={handleDecrement}
                  disabled={quantity <= 1}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color={quantity <= 1 ? Colors.muted : Colors.text}
                  />
                </Pressable>

                <View style={styles.qtyDisplay}>
                  <Text style={styles.qtyText}>{quantity}</Text>
                </View>

                <Pressable
                  style={[
                    styles.qtyBtn,
                    quantity >= product.stock && styles.qtyBtnDisabled,
                  ]}
                  onPress={handleIncrement}
                  disabled={quantity >= product.stock}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color={quantity >= product.stock ? Colors.muted : Colors.text}
                  />
                </Pressable>
              </View>

            </View>
          )}

          {/* Botón agregar al carrito */}
          <Pressable
            style={[
              styles.addButton,
              isOutOfStock && styles.addButtonDisabled,
              addPressed && !isOutOfStock && styles.addButtonPressed,
            ]}
            onPress={handleAddToCart}
            onPressIn={() => setAddPressed(true)}
            onPressOut={() => setAddPressed(false)}
            disabled={isOutOfStock || isAddingToCart}
          >
            {isOutOfStock ? (
              <Text style={styles.addButtonTextDisabled}>SIN STOCK</Text>
            ) : isAddingToCart ? (
              <ActivityIndicator color={Colors.bg} />
            ) : (
              <Text style={styles.addButtonText}>AGREGAR AL CARRITO</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    gap: 12,
  },
  errorText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: Colors.muted,
  },
  // ─── Imagen ────────────────────────────────────────
  imageContainer: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.surface,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 19, 39, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    fontFamily: 'Syne_800ExtraBold',
    fontSize: 20,
    color: Colors.danger,
    letterSpacing: 2,
  },
  // ─── Contenido ─────────────────────────────────────
  content: {
    padding: Tokens.spacing.screen,
    gap: 8,
  },
  name: {
    fontFamily: 'Syne_700Bold',
    fontSize: 22,
    color: Colors.text,
    marginTop: 8,
  },
  price: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 24,
    color: Colors.accent,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  description: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.muted,
    lineHeight: 22,
  },
  // ─── Stock ─────────────────────────────────────────
  stockIndicator: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    marginTop: 4,
  },
  // ─── Selector de cantidad ──────────────────────────
  quantitySection: {
    marginTop: 16,
  },
  quantityLabel: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Tokens.borderRadius.btn,
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyDisplay: {
    width: 56,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  qtyText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 18,
    color: Colors.text,
  },
  // ─── Botón agregar ─────────────────────────────────
  addButton: {
    backgroundColor: Colors.accent,
    borderRadius: Tokens.borderRadius.btn,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  addButtonPressed: {
    backgroundColor: Colors.accentHover,
  },
  addButtonDisabled: {
    backgroundColor: Colors.border,
  },
  addButtonText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    color: Colors.bg,
    letterSpacing: 0.5,
  },
  addButtonTextDisabled: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    color: Colors.muted,
    letterSpacing: 0.5,
  },
});
