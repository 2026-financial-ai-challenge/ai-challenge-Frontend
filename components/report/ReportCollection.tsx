"use client";

import { DraftTrainingReport } from "@/components/report/DraftTrainingReport";
import type { CallReport, ReportTurn, WebTrainingReport } from "@/lib/types";
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
  webTraining?: WebTrainingReport | null;
};

export function ReportCollection({
  draft,
  unannounced,
  final,
  draftTurns,
  unannouncedTurns,
  webTraining,
}: ReportCollectionProps) {
  const reports: Record<ReportKey, CallReport | null> = {
    draft,
    unannounced,
    final,
  };
  const latest: ReportKey = final ? "final" : unannounced ? "unannounced" : "draft";
  const [selected, setSelected] = useState<ReportKey>(latest);

  const active = reports[selected] ? selected : latest;
  const body = reports[active];
  if (!body) return null;

  const available = (Object.keys(LABELS) as ReportKey[]).filter(
    (key) => reports[key] != null,
  );

  return (
    <div>
      {available.length > 1 ? (
        <div className="mb-6 flex gap-6 border-b border-border" aria-label="리포트 선택">
          {available.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={`-mb-px border-b-2 pb-3 text-base font-bold transition-colors ${
                active === key
                  ? "border-primary text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
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
        calls={{ announced: draft, unannounced }}
        webTraining={webTraining}
      />
    </div>
  );
}
