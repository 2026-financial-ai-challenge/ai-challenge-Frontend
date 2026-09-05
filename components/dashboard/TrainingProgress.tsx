import { cn } from "@/lib/utils";
import { Fragment } from "react";

const STEPS = ["훈련 전화", "1차 리포트", "불시 전화", "최종 리포트"];

/** completed = 완료한 단계 수 (0~4). completed번째 단계가 "현재". */
export function TrainingProgress({ completed }: { completed: number }) {
  return (
    <ol className="flex items-start">
      {STEPS.map((label, index) => (
        <Fragment key={label}>
          {index > 0 ? (
            <span
              aria-hidden
              className={cn(
                "mt-4 h-px flex-1",
                index <= completed ? "bg-primary" : "bg-border",
              )}
            />
          ) : null}
          <li className="flex w-16 shrink-0 flex-col items-center gap-1.5 text-center">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                index < completed && "bg-primary text-white",
                index === completed && "border-2 border-primary text-primary",
                index > completed && "bg-primary-light text-text-secondary",
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "text-xs leading-tight",
                index === completed
                  ? "font-semibold text-text-primary"
                  : "text-text-secondary",
              )}
            >
              {label}
            </span>
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
