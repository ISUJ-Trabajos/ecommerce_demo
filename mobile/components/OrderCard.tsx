import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Order } from '@/services/orderService';
import { useRouter } from 'expo-router';

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const formattedDate = new Date(order.created_at).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.orderId}>Pedido #{order.id}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.totalText}>${parseFloat(order.total).toFixed(2)}</Text>
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={Colors.muted} 
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {order.status === 'completed' ? 'Completado' : 'Pendiente'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total de ítems:</Text>
            <Text style={styles.infoValue}>{order.item_count || 0}</Text>
          </View>

          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => router.push(`/(app)/orders/${order.id}`)}
          >
            <Text style={styles.detailsButtonText}>Ver Detalle Completo</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.card,
  },
  headerLeft: {
    justifyContent: 'center',
  },
  orderId: {
    fontFamily: 'Syne_700Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  dateText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    color: Colors.muted,
  },
  headerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  totalText: {
    fontFamily: 'Syne_700Bold',
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 4,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontFamily: 'DMSans_400Regular',
    color: Colors.muted,
    fontSize: 14,
  },
  infoValue: {
    fontFamily: 'DMSans_500Medium',
    color: Colors.text,
    fontSize: 14,
  },
  statusBadge: {
    backgroundColor: 'rgba(56, 173, 169, 0.2)', // Verde tenue
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: Colors.success,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(215, 255, 6, 0.1)', // Fondo sutil primary
    borderRadius: 8,
  },
  detailsButtonText: {
    fontFamily: 'DMSans_700Bold',
    color: Colors.primary,
    fontSize: 14,
    marginRight: 6,
  },
});
