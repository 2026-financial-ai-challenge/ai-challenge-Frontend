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
          const current = localStorage.getItem(name);
          if (current) return current;
          const legacy = localStorage.getItem(LEGACY_KEY);
          const sessionValue =
            sessionStorage.getItem(name) ?? sessionStorage.getItem(LEGACY_KEY);
          if (sessionValue) {
            const migrated = sessionValue.startsWith("{")
              ? sessionValue
              : JSON.stringify({ state: { sessionId: sessionValue }, version: 0 });
            localStorage.setItem(name, migrated);
            sessionStorage.removeItem(name);
            sessionStorage.removeItem(LEGACY_KEY);
            return migrated;
          }
          if (!legacy) return null;
          if (legacy.startsWith("{")) return legacy;
          return JSON.stringify({ state: { sessionId: legacy }, version: 0 });
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          localStorage.setItem(name, value);
          sessionStorage.removeItem(name);
          sessionStorage.removeItem(LEGACY_KEY);
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          localStorage.removeItem(name);
          localStorage.removeItem(LEGACY_KEY);
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
