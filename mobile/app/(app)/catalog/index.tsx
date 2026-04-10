import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Tokens } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { CATEGORY_TABS } from '@/constants/categories';
import { getProducts, Product } from '@/services/productService';
import ProductCard from '@/components/ProductCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 12;

/**
 * Pantalla de Catálogo — MOD-02
 * Grid de productos con tabs de categoría, pull-to-refresh y estados de stock.
 */
export default function CatalogScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 = "Todos"
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async (categorySlug?: string) => {
    try {
      setError('');
      const data = await getProducts(categorySlug || undefined);
      setProducts(data);
    } catch (err: any) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar productos. Verifica tu conexión.');
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    setLoading(true);
    fetchProducts().finally(() => setLoading(false));
  }, [fetchProducts]);

  // Cambio de tab
  const handleTabPress = async (tabIndex: number) => {
    setActiveTab(tabIndex);
    setLoading(true);
    const slug = CATEGORY_TABS[tabIndex].slug || undefined;
    await fetchProducts(slug);
    setLoading(false);
  };

  // Pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    const slug = CATEGORY_TABS[activeTab].slug || undefined;
    await fetchProducts(slug);
    setRefreshing(false);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.cardWrapper}>
      <ProductCard
        product={item}
        onPress={() => router.push(`/(app)/catalog/${item.id}`)}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={60} color={Colors.muted} />
      <Text style={styles.emptyTitle}>No hay productos</Text>
      <Text style={styles.emptySubtitle}>
        No se encontraron productos en esta categoría
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs de categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
        style={styles.tabsScroll}
      >
        {CATEGORY_TABS.map((tab, index) => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === index && styles.tabActive]}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.tabTextActive,
              ]}
            >
              {tab.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Error */}
      {error !== '' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => handleTabPress(activeTab)}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      {/* Loading */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      ) : (
        /* Lista de productos */
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.accent}
              colors={[Colors.accent]}
              progressBackgroundColor={Colors.surface}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  // ─── Tabs ────────────────────────────────────────────
  tabsScroll: {
    backgroundColor: Colors.surface,
  },
  tabsContainer: {
    paddingHorizontal: Tokens.spacing.screen,
    paddingVertical: 14, // Mayor respiro total para el ScrollView horizontal
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 20,
    height: 40, // [ESTRUCTURAL] Altura absoluta y fija en lugar de paddingVertical dinámico
    borderRadius: 20, // Mitad de la altura para mantener forma de píldora
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  tabText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: Colors.muted,
    // Hemos retirado lineHeight, includeFontPadding y textAlignVertical.
    // El Flexbox del contenedor padre (height: 40) centrará físicamente este elemento.
  },
  tabTextActive: {
    color: Colors.bg,
  },
  // ─── Error ───────────────────────────────────────────
  errorContainer: {
    padding: Tokens.spacing.screen,
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.danger,
    textAlign: 'center',
  },
  retryText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: Colors.accent,
  },
  // ─── Loading ─────────────────────────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.muted,
  },
  // ─── Lista ───────────────────────────────────────────
  listContent: {
    paddingHorizontal: Tokens.spacing.screen,
    paddingTop: 10,
    paddingBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  cardWrapper: {
    width: (SCREEN_WIDTH - Tokens.spacing.screen * 2 - CARD_GAP) / 2,
  },
  // ─── Estado vacío ────────────────────────────────────
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  emptySubtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
});
