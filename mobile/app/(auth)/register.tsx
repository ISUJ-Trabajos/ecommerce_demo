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
import { registerRequest, loginRequest } from '@/services/authService';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pressed, setPressed] = useState(false);

  const { setAuth } = useAuthStore();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    if (!email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setGeneralError('');
    setLoading(true);

    try {
      // Registrar
      await registerRequest(name.trim(), email.trim(), password);

      // Auto-login tras registro exitoso
      const { token, user } = await loginRequest(email.trim(), password);
      await setAuth(token, user);
      router.replace('/(app)/catalog');
    } catch (err: any) {
      if (err.response?.data?.error === 'EMAIL_DUPLICATE') {
        setErrors({ email: 'Este email ya está registrado' });
      } else if (err.response?.data?.error === 'VALIDATION_ERROR') {
        const details = err.response.data.details;
        const fieldErrors: Record<string, string> = {};
        details.forEach((d: any) => {
          fieldErrors[d.field] = d.message;
        });
        setErrors(fieldErrors);
      } else {
        setGeneralError('Error de conexión. Verifica que el servidor esté activo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    icon: keyof typeof Ionicons.glyphMap,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    field: string,
    options?: { secure?: boolean; keyboard?: any }
  ) => (
    <View>
      <View style={[styles.inputWrapper, errors[field] && styles.inputError]}>
        <Ionicons name={icon} size={20} color={Colors.muted} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.muted}
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (errors[field]) {
              setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
              });
            }
          }}
          secureTextEntry={options?.secure}
          keyboardType={options?.keyboard}
          autoCapitalize={options?.keyboard === 'email-address' ? 'none' : 'sentences'}
          autoCorrect={false}
        />
      </View>
      {errors[field] && (
        <Text style={styles.fieldError}>⚠ {errors[field]}</Text>
      )}
    </View>
  );

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
        <View style={styles.form}>
          {renderInput('person-outline', 'Nombre completo', name, setName, 'name')}
          {renderInput('mail-outline', 'Email', email, setEmail, 'email', { keyboard: 'email-address' })}
          {renderInput('lock-closed-outline', 'Contraseña', password, setPassword, 'password', { secure: true })}
          {renderInput('lock-closed-outline', 'Confirmar contraseña', confirmPassword, setConfirmPassword, 'confirmPassword', { secure: true })}

          {generalError !== '' && (
            <Text style={styles.errorText}>{generalError}</Text>
          )}

          <Pressable
            style={[styles.button, pressed && styles.buttonPressed]}
            onPress={handleRegister}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.bg} />
            ) : (
              <Text style={styles.buttonText}>CREAR CUENTA</Text>
            )}
          </Pressable>

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>¿Ya tienes cuenta? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.linkAccent}>Inicia sesión</Text>
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
    paddingHorizontal: Tokens.spacing.screen,
    paddingVertical: 24,
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
  inputError: {
    borderColor: Colors.danger,
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
  fieldError: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
    marginLeft: 4,
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
