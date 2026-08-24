import { BrandImage } from "@/components/brand/BrandImage";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CallReport, ReportBehavior, ReportTurn } from "@/lib/types";

type TrainingReportProps = {
  status: "draft" | "final";
  body: CallReport;
  turns: ReportTurn[];
};

const flags: { key: keyof Pick<CallReport, "suspected" | "gaveName" | "triedHangup">; label: string }[] = [
  { key: "suspected", label: "의심했는지" },
  { key: "gaveName", label: "성함을 댔는지" },
  { key: "triedHangup", label: "끊으려 했는지" },
];

function BehaviorSection({
  title,
  icon,
  items,
}: {
  title: string;
  icon: "alert" | "shield";
  items: ReportBehavior[];
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-brand-100 px-4 py-3">
        <BrandImage name={icon} alt="" className="h-7 w-7" />
        <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-3 text-sm text-navy-400">감지된 항목이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-brand-100">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="px-4 py-3">
              <p className="text-sm font-semibold text-navy-900">{item.label}</p>
              {item.evidence ? (
                <p className="mt-1 text-sm leading-5 text-navy-600">
                  “{item.evidence}”
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function TrainingReport({ status, body, turns }: TrainingReportProps) {
  const isDraft = status === "draft";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={isDraft ? "default" : "secondary"}>
          {isDraft ? "1차 (실시간 받아쓰기)" : "최종"}
        </Badge>
      </div>
      {isDraft ? (
        <p className="text-sm leading-6 text-navy-500">
          실시간 받아쓰기 기반이라 일부가 실제 대화와 다를 수 있습니다.
        </p>
      ) : null}

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-navy-900">이번 통화 요약</h3>
        <p className="mt-2 text-sm leading-6 text-navy-600">{body.summary}</p>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-navy-900">다음에 이렇게 하세요</h3>
        <p className="mt-2 text-sm leading-6 text-navy-600">{body.coaching}</p>
      </Card>

      <Card className="p-5">
        <ul className="grid gap-3 sm:grid-cols-3">
          {flags.map((flag) => (
            <li key={flag.key}>
              <p className="text-xs text-navy-400">{flag.label}</p>
              <p className="mt-1 text-sm font-semibold text-navy-900">
                {body[flag.key] ? "예" : "아니오"}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <BehaviorSection
        title="위험 행동"
        icon="alert"
        items={body.riskBehaviors}
      />
      <BehaviorSection
        title="방어 행동"
        icon="shield"
        items={body.defenseBehaviors}
      />

      {turns.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="border-b border-brand-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-navy-900">대화 기록</h3>
          </div>
          <ul className="divide-y divide-brand-100">
            {turns.map((turn, index) => (
              <li key={`${turn.role}-${index}`} className="px-4 py-3">
                <p className="text-xs font-medium text-navy-400">
                  {turn.role === "user" ? "훈련자" : "상대"}
                </p>
                <p className="mt-1 text-sm leading-6 text-navy-700">{turn.text}</p>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
