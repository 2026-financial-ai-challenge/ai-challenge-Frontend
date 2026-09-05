"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** 완료된 훈련 회차 하나(= 세션 하나)의 스냅샷. 최종 리포트를 처음 본 시점에 기록. */
export type CompletedRun = {
  id: string;
  /** 보이스피싱 시뮬레이션(1차) 점수. 값이 없으면 null */
  announcedScore: number | null;
  /** 불시 훈련(실전) 점수. 값이 없으면 null */
  unannouncedScore: number | null;
  completedAt: string;
};

type SessionState = {
  sessionId: string | null;
  history: CompletedRun[];
  hasHydrated: boolean;
  setSessionId: (sessionId: string | null) => void;
  recordCompletedSession: (run: CompletedRun) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const LEGACY_KEY = "spc.sessionId";

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      history: [],
      hasHydrated: false,
      setSessionId: (sessionId) => set({ sessionId }),
      recordCompletedSession: (run) =>
        set((state) =>
          state.history.some((entry) => entry.id === run.id)
            ? state
            : { history: [run, ...state.history] },
        ),
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
      partialize: (state) => ({
        sessionId: state.sessionId,
        history: state.history,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
