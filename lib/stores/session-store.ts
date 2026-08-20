"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SessionState = {
  sessionId: string | null;
  hasHydrated: boolean;
  setSessionId: (sessionId: string | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const LEGACY_KEY = "spc.sessionId";

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      hasHydrated: false,
      setSessionId: (sessionId) => set({ sessionId }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "spc-session",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const current = sessionStorage.getItem(name);
          if (current) return current;
          const legacy = sessionStorage.getItem(LEGACY_KEY);
          if (!legacy) return null;
          return JSON.stringify({ state: { sessionId: legacy }, version: 0 });
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          sessionStorage.setItem(name, value);
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          sessionStorage.removeItem(name);
          sessionStorage.removeItem(LEGACY_KEY);
        },
      })),
      partialize: (state) => ({ sessionId: state.sessionId }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
