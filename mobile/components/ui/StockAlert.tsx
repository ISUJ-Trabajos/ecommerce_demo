import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface StockAlertProps {
  /** Cantidad disponible (muestra alerta cuando es baja) */
  available?: number;
  /** Si está totalmente sin stock */
  outOfStock?: boolean;
}

/**
 * Alerta inline de stock.
 * Se muestra debajo del selector de cantidad o en el carrito
 * cuando hay problemas de disponibilidad.
 * 
 * - outOfStock → "⛔ Sin stock disponible" (rojo)
 * - available definido → "⚠ Solo N unidades disponibles" (rojo)
 * - Sin props → no renderiza (null)
 */
export default function StockAlert({ available, outOfStock }: StockAlertProps) {
  if (outOfStock) {
    return <Text style={styles.text}>⛔ Sin stock disponible</Text>;
  }

  if (available !== undefined && available > 0) {
    return (
      <Text style={styles.text}>
        ⚠ Solo {available} {available === 1 ? 'unidad disponible' : 'unidades disponibles'}
      </Text>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: Colors.danger,
    marginTop: 6,
  },
});
