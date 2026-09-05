import type { BehaviorItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type BehaviorListProps = {
  items: BehaviorItem[];
};

const categoryLabel: Record<BehaviorItem["category"], string> = {
  disclosure: "정보 제공",
  compliance: "지시 이행",
  skepticism: "의심·확인",
  termination: "통화 종료",
  verification: "공식 확인",
};

export function BehaviorList({ items }: BehaviorListProps) {
  return (
    <Card className="overflow-hidden">
      <ul className="divide-y divide-primary-light">
        {items.map((item) => {
          const good = item.isPositive ? item.detected : !item.detected;
          const status = item.detected ? "감지됨" : "해당 없음";

          return (
            <li key={item.id} className="px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary">
                    {item.label}
                  </p>
                  <Badge variant={good ? "success" : "danger"}>
                    {categoryLabel[item.category]}
                  </Badge>
                  <span className="text-[11px] text-text-secondary">{status}</span>
                </div>
                <p className="mt-1 text-sm leading-5 text-text-primary">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
