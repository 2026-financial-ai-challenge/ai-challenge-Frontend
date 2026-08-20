import type { BehaviorItem } from "@/lib/types";
import { BrandImage } from "@/components/brand/BrandImage";
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
      <ul className="divide-y divide-brand-100">
        {items.map((item) => {
          const good = item.isPositive ? item.detected : !item.detected;
          const status = item.detected ? "감지됨" : "해당 없음";

          return (
            <li key={item.id} className="flex gap-3 px-4 py-3">
              <BrandImage
                name={good ? "shield" : "alert"}
                alt={good ? "양호" : "주의"}
                className="mt-0.5 h-8 w-8 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-navy-900">
                    {item.label}
                  </p>
                  <Badge>{categoryLabel[item.category]}</Badge>
                  <span className="text-[11px] text-navy-400">{status}</span>
                </div>
                <p className="mt-1 text-sm leading-5 text-navy-600">
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
