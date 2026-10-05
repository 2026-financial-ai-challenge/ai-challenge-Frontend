"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type IntroState = {
  /** 인트로가 떠 있는 동안 사이트 헤더를 숨기기 위한 상태. 저장하지 않는다. */
  active: boolean;
  setActive: (active: boolean) => void;
  /** 체험을 끝냈거나 건너뛴 적이 있는지. 브라우저에 남아 재방문 시 다시 뜨지 않는다. */
  seen: boolean;
  markSeen: () => void;
  /** 랜딩에서 체험을 다시 보고 싶을 때. */
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

/**
 * persist가 localStorage를 읽기 전에는 `seen`이 기본값(false)이다.
 * 서버 렌더와 첫 클라이언트 렌더를 맞추려고 서버 스냅샷은 항상 false로 둔다.
 */
const subscribeToHydration = (onChange: () => void) =>
  useIntroStore.persist.onFinishHydration(onChange);

export function useIntroHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    () => useIntroStore.persist.hasHydrated(),
    () => false,
  );
}
