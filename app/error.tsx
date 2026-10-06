"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <h1 className="text-2xl font-bold text-text-primary">
        화면을 표시하지 못했습니다
      </h1>
      <p className="mt-3 text-base text-text-primary">
        잠시 후 다시 시도하거나 처음으로 돌아가 주세요.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          다시 시도
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </div>
  );
}
