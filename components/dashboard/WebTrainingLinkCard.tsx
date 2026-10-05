"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { useCreateWebTrainingLinkMutation } from "@/hooks/use-training-queries";
import { apiErrorMessage } from "@/lib/errors";
import { webTrainingUrl } from "@/lib/web-training";
import { useState } from "react";

export function WebTrainingLinkCard({ sessionId }: { sessionId: string }) {
  const mutation = useCreateWebTrainingLinkMutation();
  const [copied, setCopied] = useState(false);
  const url =
    mutation.data && mutation.variables === sessionId
      ? webTrainingUrl(mutation.data.token)
      : null;

  const issue = () => {
    setCopied(false);
    mutation.mutate(sessionId);
  };

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card className="mt-6 p-6 sm:p-8">
      <h2 className="text-base font-bold text-text-primary">스미싱 링크 훈련</h2>
      <p className="mt-2 text-base leading-relaxed text-text-secondary">
        가상 기관 사이트로 연결되는 훈련 링크를 만듭니다. 링크에서 한 행동만
        기록되고, 입력한 내용은 저장되지 않습니다.
      </p>

      {url ? (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="min-w-0 flex-1 truncate rounded border border-border bg-background-muted px-3 py-2 text-sm text-text-primary">
            {url}
          </code>
          <Button type="button" variant="secondary" onClick={() => void copy()}>
            {copied ? "복사됨" : "링크 복사"}
          </Button>
        </div>
      ) : null}

      <FormError
        message={apiErrorMessage(
          mutation.error,
          "훈련 링크를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.",
        )}
        className="mt-3"
      />

      <div className="mt-4">
        <Button type="button" onClick={issue} disabled={mutation.isPending}>
          {mutation.isPending
            ? "만드는 중..."
            : url
              ? "새 링크 만들기"
              : "훈련 링크 만들기"}
        </Button>
      </div>
    </Card>
  );
}
