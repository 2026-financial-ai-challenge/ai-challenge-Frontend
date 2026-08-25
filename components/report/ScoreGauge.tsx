type ScoreGaugeProps = {
  score: number;
  label?: string;
};

function scoreStatus(score: number) {
  if (score >= 80) return { label: "매우 안전", className: "text-emerald-600" };
  if (score >= 60) return { label: "양호", className: "text-brand-600" };
  if (score >= 40) return { label: "주의", className: "text-amber-600" };
  return { label: "위험", className: "text-red-600" };
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
      <p className="text-sm font-semibold text-navy-900">{label}</p>
      <div className="mx-auto mt-2 max-w-[18rem]">
        <svg
          viewBox="0 0 200 132"
          className="h-auto w-full overflow-visible"
          aria-hidden="true"
        >
          <path
            d={arc}
            pathLength="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="18"
            strokeLinecap="butt"
            className="text-red-400"
            strokeDasharray="29 71"
          />
          <path
            d={arc}
            pathLength="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="18"
            strokeLinecap="butt"
            className="text-amber-400"
            strokeDasharray="38 62"
            strokeDashoffset="-31"
          />
          <path
            d={arc}
            pathLength="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="18"
            strokeLinecap="butt"
            className="text-emerald-500"
            strokeDasharray="29 71"
            strokeDashoffset="-71"
          />
          <g transform={`rotate(${needleAngle} 100 100)`}>
            <path d="M 96 100 L 100 39 L 104 100 Z" className="fill-navy-800" />
          </g>
          <circle cx="100" cy="100" r="7" className="fill-navy-900" />
          <text x="12" y="125" className="fill-navy-400 text-[9px] font-medium">
            0
          </text>
          <text x="188" y="125" textAnchor="end" className="fill-navy-400 text-[9px] font-medium">
            100
          </text>
        </svg>
      </div>
      <p className="-mt-1 text-4xl font-bold tabular-nums tracking-tight text-navy-900">
        {clamped}
        <span className="ml-1 text-base font-semibold text-navy-400">점</span>
      </p>
      <p className={`mt-1 text-sm font-semibold ${status.className}`}>
        {status.label}
      </p>
    </div>
  );
}
