import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { Colors } from '@/constants/colors';
import { orderService, Order } from '@/services/orderService';
import { API_URL } from '@/constants/api';

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
          <ActivityIndicator size="large" color={Colors.primary} />
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
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} onPress={() => router.back()} />
          <Text style={styles.pageTitle}>Detalle del Pedido</Text>
          <View style={{ width: 24 }} />
        </View>

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

        <Text style={styles.sectionTitle}>Productos</Text>
        
        <View style={styles.itemsContainer}>
          {order.items?.map((item, index) => (
            <View key={item.id} style={[styles.itemCard, index > 0 && styles.itemCardBorder]}>
              <View style={styles.imagePlaceholder}>
                {item.image_url ? (
                  <Image source={{ uri: `${API_URL}${item.image_url}` }} style={styles.image} />
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
              </View>
            </View>
          ))}
        </View>
        
        {/* Fake address details as requested in tracking */}
        <Text style={styles.sectionTitle}>Información de Entrega</Text>
        <View style={styles.summaryCard}>
            <Text style={styles.infoText}>Avenida Siempre Viva 742</Text>
            <Text style={styles.infoText}>Springfield, EEUU</Text>
            <Text style={styles.mutedInfoText}>Método: Tarjeta de Crédito terminada en •••• 4242</Text>
        </View>
      </ScrollView>
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
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 20,
    color: Colors.text,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  sectionTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  itemsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  itemCardBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: Colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
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
    color: Colors.muted,
  },
  itemPriceInfo: {
    marginLeft: 16,
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontFamily: 'Syne_700Bold',
    fontSize: 16,
    color: Colors.text,
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
  }
});
