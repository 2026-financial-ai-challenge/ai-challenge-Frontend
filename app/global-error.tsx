"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className="bg-[#f7f8fa] font-sans text-[#1a1d24] antialiased">
        <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
          <h1 className="text-2xl font-bold">화면을 표시하지 못했습니다</h1>
          <p className="mt-3 text-base">
            잠시 후 다시 시도하거나 처음으로 돌아가 주세요.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex h-10 items-center rounded-lg bg-[#1d4ed8] px-5 text-sm font-semibold text-white"
            >
              다시 시도
            </button>
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-lg border border-[#d5d8e0] bg-white px-5 text-sm font-semibold"
            >
              홈으로
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
