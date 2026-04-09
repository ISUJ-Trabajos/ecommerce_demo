import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/api';

/**
 * Instancia Axios preconfigurada para la API REST.
 * Incluye interceptor automático para adjuntar el JWT
 * desde Expo SecureStore en cada request.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true', // Permite consumir Localtunnel como API silenciosamente
  },
});

// ─── Interceptor de Request: adjuntar Bearer JWT ──────────
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Si falla SecureStore, no bloquear la request
      console.warn('Error al leer token de SecureStore:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Interceptor de Response: manejar errores comunes ─────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un status fuera de 2xx
      const { status, data } = error.response;

      if (status === 401) {
        // Token expirado o inválido — el auth store debe limpiar la sesión
        console.warn('Token inválido o expirado');
      }

      // Retornar el error con la data del servidor para que el caller lo maneje
      return Promise.reject(error);
    }

    // Error de red o timeout
    console.error('Error de red:', error.message);
    return Promise.reject(error);
  }
);

export default api;
