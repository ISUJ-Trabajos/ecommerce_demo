import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook que verifica si hay sesión activa.
 * Redirige a login si no hay token.
 * Retorna el usuario y el token actuales.
 */
export function useAuth() {
  const { user, token, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/(auth)/login');
    }
  }, [isLoading, token]);

  return { user, token, isLoading };
}
