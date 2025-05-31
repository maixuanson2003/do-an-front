import { create } from "zustand";

type AuthState = {
  isLogin: boolean;
  setLogin: () => void;
  setLogout: () => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLogin: false,
  setLogin: () => set({ isLogin: true }),
  setLogout: () => set({ isLogin: false }),
  reset: () => set({ isLogin: false }),
}));
