"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthParticipant } from "@/lib/types";

type AuthState = {
  token: string | null;
  participant: AuthParticipant | null;
  consentedParticipantIds: number[];
  hasHydrated: boolean;
  setAuth: (token: string, participant: AuthParticipant) => void;
  markConsented: () => void;
  clearAuth: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      participant: null,
      consentedParticipantIds: [],
      hasHydrated: false,
      setAuth: (token, participant) => set({ token, participant }),
      markConsented: () =>
        set((state) => {
          const id = state.participant?.id;
          if (id == null || state.consentedParticipantIds.includes(id)) {
            return state;
          }
          return {
            consentedParticipantIds: [...state.consentedParticipantIds, id],
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
        consentedParticipantIds: state.consentedParticipantIds,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as {
          token?: string | null;
          participant?: (AuthParticipant & { hasConsented?: boolean }) | null;
          consentedParticipantIds?: number[];
        };
        const consentedParticipantIds = [
          ...(persisted.consentedParticipantIds ?? []),
        ];
        if (
          persisted.participant?.hasConsented === true &&
          !consentedParticipantIds.includes(persisted.participant.id)
        ) {
          consentedParticipantIds.push(persisted.participant.id);
        }
        return {
          ...currentState,
          token: persisted.token ?? null,
          participant: persisted.participant
            ? {
                id: persisted.participant.id,
                phoneNumberMasked: persisted.participant.phoneNumberMasked,
              }
            : null,
          consentedParticipantIds,
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

export function hasLocalConsent(state: {
  participant: AuthParticipant | null;
  consentedParticipantIds: number[];
}): boolean {
  return (
    state.participant != null &&
    state.consentedParticipantIds.includes(state.participant.id)
  );
}

export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  return value;
}

export function replaceTo(path: string) {
  if (typeof window === "undefined") return;
  window.location.replace(path);
}
