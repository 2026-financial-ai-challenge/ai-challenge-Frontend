import { DraftTrainingReport } from "@/components/report/DraftTrainingReport";
import type { CallReport, ReportTurn } from "@/lib/types";

type TrainingReportProps = {
  status: "draft" | "unannounced" | "final";
  body: CallReport;
  turns: ReportTurn[];
};

export function TrainingReport({ status, body, turns }: TrainingReportProps) {
  return <DraftTrainingReport status={status} body={body} turns={turns} />;
}
