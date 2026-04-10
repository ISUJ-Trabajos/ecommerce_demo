import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Tokens } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { loginRequest } from '@/services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pressed, setPressed] = useState(false);

  const { setAuth } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Todos los campos son requeridos');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { token, user } = await loginRequest(email.trim(), password);
      await setAuth(token, user);
      router.replace('/(app)/catalog');
    } catch (err: any) {
      if (err.response?.data?.error === 'INVALID_CREDENTIALS') {
        setError('Email o contraseña incorrectos');
      } else if (err.response?.data?.error === 'VALIDATION_ERROR') {
        const details = err.response.data.details;
        setError(details.map((d: any) => d.message).join('. '));
      } else {
        setError('Error de conexión. Verifica que el servidor esté activo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo / Título */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>ECM</Text>
            <Text style={[styles.headerTitle, { color: Colors.accent }]}>DEMO</Text>
          </View>
          <Text style={styles.subtitle}>Ecommerce Demo</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Tu tienda favorita</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Contraseña */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={Colors.muted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Error */}
          {error !== '' && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {/* Botón Login */}
          <Pressable
            style={[styles.button, pressed && styles.buttonPressed]}
            onPress={handleLogin}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.bg} />
            ) : (
              <Text style={styles.buttonText}>INGRESAR</Text>
            )}
          </Pressable>

          {/* Link a registro */}
          <View style={styles.linkRow}>
            <Text style={styles.linkText}>¿No tienes cuenta? </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.linkAccent}>Regístrate</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Tokens.spacing.screen,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Syne_700Bold',
    fontSize: 45,
    color: Colors.text,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: 'Syne_400Regular',
    fontSize: 20,
    color: Colors.muted,
    marginTop: 8,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: Colors.accentHover,
    borderRadius: 2,
    marginVertical: 12,
  },
  tagline: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    color: Colors.text,
    letterSpacing: 1.5,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Tokens.borderRadius.input,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 14,
  },
  errorText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.danger,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: Tokens.borderRadius.btn,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    backgroundColor: Colors.accentHover,
  },
  buttonText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    color: Colors.bg,
    letterSpacing: 0.5,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  linkText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: Colors.muted,
  },
  linkAccent: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 14,
    color: Colors.accent,
  },
});
