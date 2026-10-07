type ScoreGaugeProps = {
  score: number;
  label?: string;
  variant?: "full" | "compact" | "hero";
};

const ZONES = [
  {
    start: 0,
    end: 40,
    label: "위험",
    band: "bg-danger",
    bandMuted: "bg-danger-light",
    bandBright: "bg-danger-bright",
    text: "text-danger",
    textBright: "text-danger-bright",
    dot: "bg-danger",
  },
  {
    start: 40,
    end: 80,
    label: "주의",
    band: "bg-caution",
    bandMuted: "bg-caution-light",
    bandBright: "bg-caution-bright",
    text: "text-caution",
    textBright: "text-caution-bright",
    dot: "bg-caution",
  },
  {
    start: 80,
    end: 100,
    label: "양호",
    band: "bg-success",
    bandMuted: "bg-success-light",
    bandBright: "bg-success-bright",
    text: "text-success",
    textBright: "text-success-bright",
    dot: "bg-success",
  },
] as const;

export type ScoreZone = (typeof ZONES)[number];

export function scoreZone(score: number): ScoreZone {
  const clamped = Math.min(100, Math.max(0, score));
  return ZONES.find((zone) => clamped < zone.end) ?? ZONES[ZONES.length - 1];
}

export function ScoreGauge({
  score,
  label = "시뮬레이션 상황 대응 점수",
  variant = "full",
}: ScoreGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const zone = scoreZone(clamped);
  const meter = {
    role: "meter" as const,
    "aria-label": label,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": clamped,
    "aria-valuetext": `${clamped}점, ${zone.label}`,
  };

  if (variant === "compact") {
    return (
      <p
        className="inline-flex items-center gap-1.5 text-sm text-text-primary"
        {...meter}
      >
        <span className={`h-2 w-2 rounded-full ${zone.dot}`} aria-hidden />
        <span className="font-semibold tabular-nums">{clamped}점</span>
        <span className="text-text-secondary">· {zone.label}</span>
      </p>
    );
  }

  const onDark = variant === "hero";

  return (
    <div {...meter}>
      {onDark ? (
        <>
          <p className="text-sm text-white/55">{label}</p>
          <p className="mt-2 flex items-baseline gap-2.5">
            <span className="text-[4.25rem] font-bold leading-[0.82] tabular-nums tracking-[-0.045em] text-white sm:text-[5rem]">
              {clamped}
            </span>
            <span className="text-base text-white/45">/ 100</span>
            <span className={`ml-2.5 text-2xl font-bold ${zone.textBright}`}>
              {zone.label}
            </span>
          </p>
        </>
      ) : (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold leading-none tabular-nums tracking-tight text-text-primary">
              {clamped}
            </span>
            <span className="text-sm text-text-secondary">/ 100</span>
            <span className={`ml-1 text-sm font-bold ${zone.text}`}>{zone.label}</span>
          </p>
        </div>
      )}

      <div className={onDark ? "mt-6" : "mt-4"} aria-hidden>
        <div className="relative h-2">
          <span
            className="absolute bottom-0 -translate-x-1/2"
            style={{ left: `${clamped}%` }}
          >
            <svg
              viewBox="0 0 10 8"
              className={`h-2 w-2.5 ${onDark ? "fill-white" : "fill-text-primary"}`}
            >
              <path d="M5 8 0 0h10z" />
            </svg>
          </span>
        </div>

        <div
          className={`relative flex overflow-hidden rounded-full ${
            onDark ? "mt-1.5 h-2" : "mt-1 h-1.5"
          }`}
        >
          {ZONES.map((item) => {
            const standing = item.label === zone.label;
            return (
              <span
                key={item.label}
                style={{ width: `${item.end - item.start}%` }}
                className={
                  onDark
                    ? standing
                      ? item.bandBright
                      : "bg-white/15"
                    : standing
                      ? item.band
                      : item.bandMuted
                }
              />
            );
          })}
          {ZONES.slice(1).map((boundary) => (
            <span
              key={boundary.start}
              className={`absolute top-0 h-full w-px ${
                onDark ? "bg-primary-deep" : "bg-card"
              }`}
              style={{ left: `${boundary.start}%` }}
            />
          ))}
        </div>

        <div className={onDark ? "mt-2 flex" : "mt-1.5 flex"}>
          {ZONES.map((item) => {
            const standing = item.label === zone.label;
            return (
              <span
                key={item.label}
                style={{ width: `${item.end - item.start}%` }}
                className={
                  onDark
                    ? `text-xs ${standing ? "font-semibold text-white" : "text-white/40"}`
                    : `text-xs ${
                        standing ? "font-semibold text-text-primary" : "text-text-secondary"
                      }`
                }
              >
                {item.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
