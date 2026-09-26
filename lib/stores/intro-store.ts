"use client";

import { create } from "zustand";

type IntroState = {
  active: boolean;
  setActive: (active: boolean) => void;
};

/** 랜딩의 풀스크린 인트로가 떠 있는 동안 사이트 헤더를 숨기기 위한 상태. */
export const useIntroStore = create<IntroState>((set) => ({
  active: false,
  setActive: (active) => set({ active }),
}));
  