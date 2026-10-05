"use client";

import { Button } from "@/components/ui/button";
import { useIntroHydrated, useIntroStore } from "@/lib/stores/intro-store";
import { RotateCcw } from "lucide-react";

/**
 * 인트로 체험은 한 번 보면 다시 뜨지 않는다.
 * 대신 랜딩에서 언제든 다시 볼 수 있는 입구를 둔다.
 */
export function IntroReplayButton() {
  const hydrated = useIntroHydrated();
  const seen = useIntroStore((state) => state.seen);
  const replay = useIntroStore((state) => state.replay);

  if (!hydrated || !seen) return null;

  return (
    <Button
      type="button"
      variant="link"
      className="h-auto px-0 text-sm"
      onClick={replay}
    >
      <RotateCcw className="h-3.5 w-3.5" />
      <span>모의 통화 체험 다시 보기</span>
    </Button>
  );
}
