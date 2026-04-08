import React from 'react';
import { ScrollView, View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Tokens } from '@/constants/colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  /** Si es true, envuelve en ScrollView. Default: true */
  scrollable?: boolean;
  /** Estilo adicional para el contenedor interno */
  style?: ViewStyle;
  /** Si es true, no aplica padding horizontal. Default: false */
  noPadding?: boolean;
}

/**
 * Wrapper base para todas las pantallas.
 * Aplica SafeAreaView, fondo dark, y padding horizontal estándar.
 */
export default function ScreenWrapper({
  children,
  scrollable = true,
  style,
  noPadding = false,
}: ScreenWrapperProps) {
  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable
    ? { contentContainerStyle: [styles.scroll, style], showsVerticalScrollIndicator: false }
    : { style: [styles.container, style] };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Container
        {...containerProps}
        style={[
          scrollable ? undefined : styles.container,
          !noPadding && styles.padding,
          style,
        ]}
        {...(scrollable && {
          contentContainerStyle: [
            styles.scroll,
            !noPadding && styles.padding,
            style,
          ],
        })}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  padding: {
    paddingHorizontal: Tokens.spacing.screen,
  },
});
