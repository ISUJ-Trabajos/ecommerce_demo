/**
 * Paleta de colores — ECommerce Demo
 * Dark Mode exclusivo. Único color de acción: celeste #74b8d3.
 * Ref: docs/05_diseno_estructura_paginas.md
 */
export const Colors = {
  /** Fondo base — azul marino profundo */
  bg: '#071327',
  /** Tarjetas y superficies elevadas */
  surface: '#0d1f3c',
  /** Bordes sutiles */
  border: '#1a2f4a',
  /** Celeste — único color de acción */
  accent: '#74b8d3',
  /** Celeste oscuro (onPressIn) */
  accentHover: '#5aa4c2',
  /** Texto principal */
  text: '#f0f4f8',
  /** Texto secundario / placeholders */
  muted: '#8ba3b8',
  /** Stock disponible / completado */
  success: '#4ecb8d',
  /** Stock bajo (1–5 unidades) */
  warning: '#f0a050',
  /** Sin stock / error / alerta inline */
  danger: '#e05c5c',
};

/**
 * Tokens de diseño reutilizables
 */
export const Tokens = {
  borderRadius: {
    card: 12,
    btn: 8,
    input: 8,
  },
  spacing: {
    screen: 16,
    section: 24,
  },
  shadow: {
    card: {
      shadowColor: '#071327',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};
