type ScoreBarProps = {
  score: number;
  label?: string;
};

export function ScoreBar({ score, label = "대응 점수" }: ScoreBarProps) {
  const clamped = Math.min(100, Math.max(0, score));

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-navy-700">{label}</p>
        <p className="text-lg font-semibold tabular-nums text-navy-900">
          {clamped}
          <span className="ml-0.5 text-sm font-medium text-navy-400">/100</span>
        </p>
      </div>
      <div
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-brand-100"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
