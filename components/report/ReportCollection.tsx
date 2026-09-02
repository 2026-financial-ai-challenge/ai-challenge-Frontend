"use client";

import { useState } from "react";
import { TrainingReport } from "@/components/report/TrainingReport";
import type { CallReport, ReportTurn } from "@/lib/types";

type ReportKey = "draft" | "unannounced" | "final";

type ReportCollectionProps = {
  draft: CallReport | null;
  unannounced: CallReport | null;
  final: CallReport | null;
  draftTurns: ReportTurn[];
  unannouncedTurns: ReportTurn[];
};

const labels: Record<ReportKey, string> = {
  draft: "1차 리포트",
  unannounced: "불시 전화 리포트",
  final: "최종 리포트",
};

export function ReportCollection({
  draft,
  unannounced,
  final,
  draftTurns,
  unannouncedTurns,
}: ReportCollectionProps) {
  const latest: ReportKey = final
    ? "final"
    : unannounced
      ? "unannounced"
      : "draft";
  const [selected, setSelected] = useState<ReportKey>(latest);

  const reports: Partial<Record<ReportKey, CallReport | null>> = {
    draft,
    unannounced,
    final,
  };
  const available = (Object.keys(labels) as ReportKey[]).filter(
    (key) => reports[key] != null,
  );
  const body = reports[selected] ?? reports[latest];
  const active = body === reports[selected] ? selected : latest;
  const turns = active === "draft" ? draftTurns : unannouncedTurns;

  if (!body) return null;

  return (
    <div>
      {available.length > 1 ? (
        <div
          className="mb-8 grid gap-2 rounded-bubble border border-primary-light bg-card p-2 shadow-card sm:grid-cols-3"
          aria-label="리포트 선택"
        >
          {available.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                active === key
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-primary-light"
              }`}
              aria-pressed={active === key}
            >
              {labels[key]}
            </button>
          ))}
        </div>
      ) : null}
      <TrainingReport status={active} body={body} turns={turns} />
    </div>
  );
}
