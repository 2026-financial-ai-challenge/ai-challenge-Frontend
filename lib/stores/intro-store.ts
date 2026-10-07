"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type IntroState = {
  active: boolean;
  setActive: (active: boolean) => void;
  seen: boolean;
  markSeen: () => void;
  replay: () => void;
};

export const useIntroStore = create<IntroState>()(
  persist(
    (set) => ({
      active: false,
      setActive: (active) => set({ active }),
      seen: false,
      markSeen: () => set({ seen: true }),
      replay: () => set({ seen: false }),
    }),
    {
      name: "ansim-intro",
      version: 1,
      partialize: (state) => ({ seen: state.seen }),
    },
  ),
);

// 하이드레이션 불일치를 막기 위해 서버 스냅샷은 항상 false.
const subscribeToHydration = (onChange: () => void) =>
  useIntroStore.persist.onFinishHydration(onChange);

export function useIntroHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    () => useIntroStore.persist.hasHydrated(),
    () => false,
  );
}
