import { create } from 'zustand';
import { tokenUtils } from '../lib/api-client';

interface User {
  memberId: number;
  memberName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  login: (accessToken: string, refreshToken?: string, user?: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),

  login: async (accessToken, refreshToken, user) => {
    await tokenUtils.setTokens(accessToken, refreshToken);
    set({
      isAuthenticated: true,
      user: user || null,
      isLoading: false,
    });
  },

  logout: async () => {
    await tokenUtils.clearTokens();
    set({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const isAuth = await tokenUtils.isAuthenticated();
    set({
      isAuthenticated: isAuth,
      isLoading: false,
    });
    return isAuth;
  },
}));

