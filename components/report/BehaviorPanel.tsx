export type BehaviorTone = "danger" | "success";

export type PanelBehavior = {
  label: string;
  evidence?: string | null;
  /** 어느 통화에서 나온 행동인지 같은 짧은 꼬리표 */
  note?: string | null;
};

const TONE = {
  danger: {
    panel: "border-danger/20 bg-danger-light/60",
    heading: "text-danger",
    divide: "divide-danger/15",
    count: "bg-danger text-white",
    note: "bg-danger/10 text-danger",
    empty: "text-text-secondary",
  },
  success: {
    panel: "border-success/20 bg-success-light/60",
    heading: "text-success",
    divide: "divide-success/15",
    count: "bg-success text-white",
    note: "bg-success/10 text-success",
    empty: "text-text-secondary",
  },
} as const;

/**
 * 위험 행동과 방어 행동은 색으로만 갈린다. 톤을 입힌 판 하나에 머리글과 항목을
 * 같이 담고, 항목끼리는 같은 톤의 가는 줄로만 나눈다. 판 안에 또 상자를 넣으면
 * 리포트가 카드 묶음처럼 보여서 쓰지 않는다.
 */
export function BehaviorPanel({
  title,
  description,
  items,
  tone,
  emptyText = "감지된 항목이 없습니다.",
}: {
  title: string;
  description?: string;
  items: PanelBehavior[];
  tone: BehaviorTone;
  emptyText?: string;
}) {
  const t = TONE[tone];

  return (
    <section className={`rounded-xl border p-5 sm:p-6 ${t.panel}`}>
      <h3 className="flex items-center gap-2.5">
        <span className={`text-base font-bold ${t.heading}`}>{title}</span>
        <span
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums ${t.count}`}
        >
          {items.length}
        </span>
      </h3>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
      ) : null}

      {items.length > 0 ? (
        <ul className={`mt-4 divide-y ${t.divide}`}>
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-base font-semibold leading-6 text-text-primary">
                  {item.label}
                </p>
                {item.note ? (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${t.note}`}
                  >
                    {item.note}
                  </span>
                ) : null}
              </div>
              {item.evidence ? (
                <p className="mt-1 text-base leading-7 text-text-secondary">
                  “{item.evidence}”
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className={`mt-4 text-base leading-7 ${t.empty}`}>{emptyText}</p>
      )}
    </section>
  );
}
