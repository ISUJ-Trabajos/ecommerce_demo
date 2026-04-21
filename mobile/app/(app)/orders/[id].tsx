import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { Colors } from '@/constants/colors';
import { orderService, Order } from '@/services/orderService';
import { API_BASE_URL } from '@/constants/api';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!id) return;
        const data = await orderService.getOrderById(parseInt(id, 10));
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!order) {
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <Ionicons name="warning-outline" size={64} color={Colors.muted} />
          <Text style={styles.errorText}>No se pudo cargar el pedido</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>

        {/* Header fijo */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Detalle del Pedido</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Tarjeta resumen fija */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ID Pedido:</Text>
            <Text style={styles.summaryValue}>#{order.id}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fecha:</Text>
            <Text style={styles.summaryValue}>{formattedDate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estado:</Text>
            <Text style={[styles.summaryValue, { color: Colors.success }]}>
              {order.status === 'completed' ? 'Pagado' : order.status}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Pagado:</Text>
            <Text style={styles.totalValue}>${parseFloat(order.total).toFixed(2)}</Text>
          </View>
        </View>

        {/* Zona scrolleable de productos */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Productos</Text>
          <ScrollView
            showsVerticalScrollIndicator={true}
            indicatorStyle="white"
            style={styles.productScroll}
            contentContainerStyle={styles.productScrollContent}
          >
            {order.items?.map((item, index) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.imagePlaceholder}>
                  {item.image_url ? (
                    <Image source={{ uri: `${API_BASE_URL.replace('/api', '')}${item.image_url}` }} style={styles.image} />
                  ) : (
                    <Ionicons name="image-outline" size={24} color={Colors.muted} />
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemQty}>Cantidad: {item.quantity}</Text>
                </View>
                <View style={styles.itemPriceInfo}>
                  <Text style={styles.itemPrice}>${parseFloat(item.unit_price).toFixed(2)}</Text>
                  <Text style={styles.subtotalText}>
                    Subt: ${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Zona inferior fija */}
        <View style={styles.bottomSection}>
          <View style={styles.deliveryCard}>
            <Text style={styles.deliverySectionTitle}>Información de Entrega</Text>
            <Text style={styles.infoText}>Avenida Siempre Viva 742</Text>
            <Text style={styles.infoText}>Springfield, EEUU</Text>
            <Text style={styles.mutedInfoText}>Método: Tarjeta de Crédito terminada en •••• 4242</Text>
          </View>
          <TouchableOpacity style={styles.backToHistoryButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={16} color={Colors.accent} />
            <Text style={styles.backToHistoryText}>Volver al Historial</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginTop: 16,
  },
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
    fontSize: 20,
    color: Colors.text,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
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
    fontSize: 14,
    color: Colors.muted,
  },
  summaryValue: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: Colors.text,
  },
  totalValue: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    color: Colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
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
    paddingRight: 4,
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
  deliveryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deliverySectionTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'DMSans_500Medium',
    color: Colors.text,
    fontSize: 14,
    marginBottom: 4,
  },
  mutedInfoText: {
    fontFamily: 'DMSans_400Regular',
    color: Colors.muted,
    fontSize: 13,
    marginTop: 8,
  },
  backToHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: 'rgba(116, 184, 211, 0.15)',
    borderRadius: 12,
  },
  backToHistoryText: {
    fontFamily: 'DMSans_700Bold',
    color: Colors.accent,
    fontSize: 15,
    marginLeft: 8,
  },
});
