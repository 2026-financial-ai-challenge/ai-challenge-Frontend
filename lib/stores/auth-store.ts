"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  phoneNumberMasked: string | null;
  hasHydrated: boolean;
  setAuth: (accessToken: string, phoneNumberMasked: string) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      phoneNumberMasked: null,
      hasHydrated: false,
      setAuth: (accessToken, phoneNumberMasked) => set({ accessToken, phoneNumberMasked }),
      logout: () => set({ accessToken: null, phoneNumberMasked: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "spc-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken, phoneNumberMasked }) => ({ accessToken, phoneNumberMasked }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
