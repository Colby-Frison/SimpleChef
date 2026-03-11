import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'simplechef_token';

async function getStoredToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
}

async function storeToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

async function removeToken(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

interface AuthState {
  token: string | null;
  isHydrated: boolean;
  setToken: (token: string | null) => Promise<void>;
  loadToken: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isHydrated: false,

  setToken: async (token) => {
    if (token) {
      await storeToken(token);
    } else {
      await removeToken();
    }
    set({ token });
  },

  loadToken: async () => {
    try {
      const token = await getStoredToken();
      set({ token, isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },

  logout: async () => {
    await removeToken();
    set({ token: null });
  },
}));
