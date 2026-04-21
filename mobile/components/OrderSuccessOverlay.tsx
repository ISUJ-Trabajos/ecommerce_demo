import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';

interface Props {
  status: 'hidden' | 'processing' | 'success';
  onClose?: () => void;
}

export default function OrderSuccessOverlay({ status, onClose }: Props) {
  const router = useRouter();

  return (
    <Modal
      visible={status !== 'hidden'}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <AnimatePresence>
          {status === 'processing' && (
            <MotiView
              key="processing"
              from={{ opacity: 0, scale: 0.8, translateY: 50 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, translateY: -50 }}
              transition={{ type: 'spring', damping: 15 }}
              style={styles.card}
            >
              <MotiView
                from={{ rotate: '0deg' }}
                animate={{ rotate: '360deg' }}
                transition={{ type: 'timing', duration: 1500, loop: true }}
                style={styles.iconContainer}
              >
                <Ionicons name="sync-circle-outline" size={80} color={Colors.accent} />
              </MotiView>
              <Text style={styles.title}>Procesando pedido...</Text>
              <Text style={styles.subtitle}>Por favor, no cierres esta pantalla. Estamos registrando tu compra.</Text>
            </MotiView>
          )}

          {status === 'success' && (
            <MotiView
              key="success"
              from={{ opacity: 0, scale: 0.8, translateY: 50 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, translateY: -50 }}
              transition={{ type: 'spring', damping: 15 }}
              style={styles.card}
            >
              {onClose && (
                <TouchableOpacity style={styles.closeHeaderButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color={Colors.muted} />
                </TouchableOpacity>
              )}
              
              <MotiView
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 200, damping: 10 }}
                style={styles.iconContainer}
              >
                <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
              </MotiView>
              <Text style={styles.title}>¡Pedido Confirmado!</Text>
              <Text style={styles.subtitle}>Tu compra se ha realizado con éxito.</Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  if (onClose) onClose();
                  router.replace('/(app)/orders');
                }}
              >
                <Text style={styles.primaryButtonText}>Ver mis pedidos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  if (onClose) onClose();
                  router.replace('/(app)/catalog');
                }}
              >
                <Text style={styles.secondaryButtonText}>Seguir comprando</Text>
              </TouchableOpacity>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: 'absolute', // Ensures they overlay correctly during AnimatePresence transitions
  },
  closeHeaderButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  iconContainer: {
    marginBottom: 16,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontFamily: 'Syne_700Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 32,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontFamily: 'DMSans_700Bold',
    color: '#000',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontFamily: 'DMSans_700Bold',
    color: Colors.text,
    fontSize: 16,
  },
});
