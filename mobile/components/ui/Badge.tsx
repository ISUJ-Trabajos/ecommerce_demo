import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Tokens } from '@/constants/colors';

interface BadgeProps {
  /** Texto del badge */
  label: string;
  /** Color del texto (por defecto Colors.text) */
  color?: string;
  /** Color de fondo (por defecto Colors.border con opacidad) */
  bgColor?: string;
  /** Tamaño del texto (por defecto 11) */
  fontSize?: number;
}

/**
 * Badge reutilizable para categorías y estados.
 * Diseño: compacto, redondeado, colores configurables.
 */
export default function Badge({ label, color, bgColor, fontSize = 11 }: BadgeProps) {
  return (
    <View style={[styles.badge, bgColor ? { backgroundColor: bgColor } : null]}>
      <Text style={[styles.text, { fontSize }, color ? { color } : null]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(26, 47, 74, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 11,
    color: Colors.text,
    letterSpacing: 0.3,
  },
});
