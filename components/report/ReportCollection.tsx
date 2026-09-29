"use client";

import { DraftTrainingReport } from "@/components/report/DraftTrainingReport";
import type { CallReport, ReportTurn } from "@/lib/types";
import { useState } from "react";

const LABELS = {
  draft: "1차 리포트",
  unannounced: "불시 전화 리포트",
  final: "최종 리포트",
} as const;

type ReportKey = keyof typeof LABELS;

type ReportCollectionProps = {
  draft: CallReport | null;
  unannounced: CallReport | null;
  final: CallReport | null;
  draftTurns: ReportTurn[];
  unannouncedTurns: ReportTurn[];
};

export function ReportCollection({
  draft,
  unannounced,
  final,
  draftTurns,
  unannouncedTurns,
}: ReportCollectionProps) {
  const reports: Record<ReportKey, CallReport | null> = {
    draft,
    unannounced,
    final,
  };
  const latest: ReportKey = final ? "final" : unannounced ? "unannounced" : "draft";
  const [selected, setSelected] = useState<ReportKey>(latest);

  // 선택했던 리포트가 갱신으로 사라지면 가장 최신 리포트로 되돌린다.
  const active = reports[selected] ? selected : latest;
  const body = reports[active];
  if (!body) return null;

  const available = (Object.keys(LABELS) as ReportKey[]).filter(
    (key) => reports[key] != null,
  );

  return (
    <div>
      {available.length > 1 ? (
        <div
          className="mb-10 grid gap-2 rounded-lg border border-border bg-card p-2.5 sm:grid-cols-3 lg:p-3"
          aria-label="리포트 선택"
        >
          {available.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={`rounded-lg px-5 py-3 text-sm font-semibold transition-colors lg:text-base ${
                active === key
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-primary-light"
              }`}
              aria-pressed={active === key}
            >
              {LABELS[key]}
            </button>
          ))}
        </div>
      ) : null}
      <DraftTrainingReport
        status={active}
        body={body}
        turns={active === "draft" ? draftTurns : unannouncedTurns}
      />
    </div>
  );
}
