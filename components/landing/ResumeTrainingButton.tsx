"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useSessionStore } from "@/lib/stores/session-store";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ResumeTrainingButton() {
  const sessionId = useSessionStore((state) => state.sessionId);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const [resumePath, setResumePath] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated || !sessionId) {
      return;
    }

    let cancelled = false;
    api.getSession(sessionId)
      .then(({ session }) => {
        if (cancelled) return;
        setResumePath(
          session.phoneNumberMasked ? `/status/${session.id}` : "/register",
        );
      })
      .catch(() => {
        if (cancelled) return;
        setSessionId(null);
        setResumePath(null);
      });

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, sessionId, setSessionId]);

  if (!hasHydrated || !sessionId || !resumePath) return null;

  return (
    <Button asChild size="lg" variant="outline">
      <Link href={resumePath}>이전 훈련 이어서 보기</Link>
    </Button>
  );
}
