type ScoreGaugeProps = {
  score: number;
  label?: string;
};

const GAP = 1.5;
const ZONES = [
  { start: 0, end: 40, className: "text-danger" },
  { start: 40, end: 80, className: "text-amber-400" },
  { start: 80, end: 100, className: "text-success" },
] as const;

function zoneDash(start: number, end: number) {
  const from = start === 0 ? 0 : start + GAP;
  const to = end === 100 ? 100 : end - GAP;
  const length = Math.max(0, to - from);
  return {
    strokeDasharray: `${length} ${100 - length}`,
    strokeDashoffset: -from,
  };
}

function scoreStatus(score: number) {
  if (score >= 80) return { label: "양호", className: "text-primary" };
  if (score >= 60) return { label: "주의", className: "text-text-primary" };
  if (score >= 40) return { label: "경고", className: "text-text-secondary" };
  return { label: "위험", className: "text-destructive" };
}

export function ScoreGauge({
  score,
  label = "시뮬레이션 상황 대응 점수",
}: ScoreGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const needleAngle = -90 + clamped * 1.8;
  const status = scoreStatus(clamped);
  const arc = "M 20 100 A 80 80 0 0 1 180 100";

  return (
    <div
      className="text-center"
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-valuetext={`${clamped}점, ${status.label}`}
    >
      <p className="text-sm font-semibold text-text-primary">{label}</p>
      <div className="mx-auto mt-2 max-w-[18rem]">
        <svg
          viewBox="0 0 200 132"
          className="h-auto w-full overflow-visible"
          aria-hidden="true"
        >
          {ZONES.map((zone) => {
            const dash = zoneDash(zone.start, zone.end);
            return (
              <path
                key={`${zone.start}-${zone.end}`}
                d={arc}
                pathLength="100"
                fill="none"
                stroke="currentColor"
                strokeWidth="18"
                strokeLinecap="butt"
                className={zone.className}
                strokeDasharray={dash.strokeDasharray}
                strokeDashoffset={dash.strokeDashoffset}
              />
            );
          })}
          <g transform={`rotate(${needleAngle} 100 100)`}>
            <path d="M 96 100 L 100 39 L 104 100 Z" className="fill-text-primary" />
          </g>
          <circle cx="100" cy="100" r="7" className="fill-text-primary" />
          <text x="12" y="125" className="fill-text-secondary text-[9px] font-medium">
            0
          </text>
          <text x="188" y="125" textAnchor="end" className="fill-text-secondary text-[9px] font-medium">
            100
          </text>
        </svg>
      </div>
      <p className="-mt-1 text-4xl font-bold tabular-nums tracking-tight text-text-primary">
        {clamped}
        <span className="ml-1 text-base font-semibold text-text-secondary">점</span>
      </p>
      <p className={`mt-1 text-sm font-semibold ${status.className}`}>
        {status.label}
      </p>
    </div>
  );
}
