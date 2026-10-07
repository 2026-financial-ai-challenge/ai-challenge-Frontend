"use client";

import { Button } from "@/components/ui/button";
import { useIntroHydrated, useIntroStore } from "@/lib/stores/intro-store";
import { PhoneCall } from "lucide-react";

export function IntroReplayButton() {
  const hydrated = useIntroHydrated();
  const seen = useIntroStore((state) => state.seen);
  const replay = useIntroStore((state) => state.replay);

  if (!hydrated || !seen) return null;

  return (
    <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-6">
      <p className="text-sm text-text-primary">
        전화가 어떻게 걸려오는지 먼저 느껴 보고 싶다면
      </p>
      <Button
        type="button"
        variant="link"
        className="h-auto px-0 text-sm"
        onClick={replay}
      >
        <PhoneCall className="h-3.5 w-3.5" />
        <span>모의 통화 체험하기</span>
      </Button>
    </div>
  );
}
