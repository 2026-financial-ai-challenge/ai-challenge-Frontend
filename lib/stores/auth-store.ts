"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthParticipant } from "@/lib/types";

type AuthState = {
  token: string | null;
  participant: AuthParticipant | null;
  hasHydrated: boolean;
  setAuth: (token: string, participant: AuthParticipant) => void;
  markConsented: () => void;
  clearAuth: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

function normalizeParticipant(
  participant: (AuthParticipant & { hasConsented?: boolean }) | null | undefined,
  consentedIds: number[] = [],
): AuthParticipant | null {
  if (!participant) return null;
  return {
    id: participant.id,
    phoneNumberMasked: participant.phoneNumberMasked,
    hasConsented:
      participant.hasConsented === true || consentedIds.includes(participant.id),
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      participant: null,
      hasHydrated: false,
      setAuth: (token, participant) => set({ token, participant }),
      markConsented: () =>
        set((state) => {
          if (state.participant == null || state.participant.hasConsented) {
            return state;
          }
          return {
            participant: { ...state.participant, hasConsented: true },
          };
        }),
      clearAuth: () => set({ token: null, participant: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "spc-auth",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          return localStorage.getItem(name);
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          localStorage.setItem(name, value);
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          localStorage.removeItem(name);
        },
      })),
      partialize: (state) => ({
        token: state.token,
        participant: state.participant,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as {
          token?: string | null;
          participant?: (AuthParticipant & { hasConsented?: boolean }) | null;
          consentedParticipantIds?: number[];
        };
        return {
          ...currentState,
          token: persisted.token ?? null,
          participant: normalizeParticipant(
            persisted.participant,
            persisted.consentedParticipantIds,
          ),
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return useAuthStore.getState().token;
}

export function hasTrainingConsent(state: {
  participant: AuthParticipant | null;
}): boolean {
  return state.participant?.hasConsented === true;
}

export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  return value;
}

export function postLoginPath(
  hasConsented: boolean,
  nextPath: string,
): string {
  if (!hasConsented) return "/consent";
  if (nextPath === "/consent") return "/dashboard";
  return nextPath;
}

export function replaceTo(path: string) {
  if (typeof window === "undefined") return;
  window.location.replace(path);
}
