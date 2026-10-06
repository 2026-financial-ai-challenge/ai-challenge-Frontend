"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthParticipant } from "@/lib/types";

type AuthState = {
  token: string | null;
  participant: AuthParticipant | null;
  expiresAt: number | null;
  hasHydrated: boolean;
  setAuth: (
    token: string,
    participant: AuthParticipant,
    expiresInSec: number,
  ) => void;
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

export function isTokenExpired(expiresAt: number | null | undefined): boolean {
  if (expiresAt == null) return false;
  return Date.now() >= expiresAt;
}

export function selectIsAuthenticated(state: {
  token: string | null;
  expiresAt: number | null;
}): boolean {
  return Boolean(state.token) && !isTokenExpired(state.expiresAt);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      participant: null,
      expiresAt: null,
      hasHydrated: false,
      setAuth: (token, participant, expiresInSec) =>
        set({
          token,
          participant,
          expiresAt: Date.now() + expiresInSec * 1000,
        }),
      markConsented: () =>
        set((state) => {
          if (state.participant == null || state.participant.hasConsented) {
            return state;
          }
          return {
            participant: { ...state.participant, hasConsented: true },
          };
        }),
      clearAuth: () =>
        set({ token: null, participant: null, expiresAt: null }),
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
        expiresAt: state.expiresAt,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as {
          token?: string | null;
          participant?: (AuthParticipant & { hasConsented?: boolean }) | null;
          consentedParticipantIds?: number[];
          expiresAt?: number | null;
        };
        const expiresAt =
          typeof persisted.expiresAt === "number" ? persisted.expiresAt : null;
        const token = persisted.token ?? null;
        return {
          ...currentState,
          token: token && isTokenExpired(expiresAt) ? null : token,
          participant:
            token && isTokenExpired(expiresAt)
              ? null
              : normalizeParticipant(
                  persisted.participant,
                  persisted.consentedParticipantIds,
                ),
          expiresAt: token && isTokenExpired(expiresAt) ? null : expiresAt,
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
  const { token, expiresAt } = useAuthStore.getState();
  if (!token || isTokenExpired(expiresAt)) return null;
  return token;
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
