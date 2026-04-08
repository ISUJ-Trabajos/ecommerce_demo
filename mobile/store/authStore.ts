import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'client';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  /** Guarda el token y usuario tras login exitoso */
  setAuth: (token: string, user: User) => Promise<void>;

  /** Limpia sesión (logout) */
  logout: () => Promise<void>;

  /** Lee JWT de SecureStore y rehidrata el store al iniciar la app */
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: async (token, user) => {
    await SecureStore.setItemAsync('auth_token', token);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
    set({ token, user, isLoading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('auth_user');
    set({ token: null, user: null, isLoading: false });
  },

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userJson = await SecureStore.getItemAsync('auth_user');

      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        set({ token, user, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.warn('Error al rehidratar sesión:', error);
      set({ token: null, user: null, isLoading: false });
    }
  },
}));
