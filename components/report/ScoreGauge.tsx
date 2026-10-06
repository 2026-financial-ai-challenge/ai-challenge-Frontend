type ScoreGaugeProps = {
  score: number;
  label?: string;
  /**
   * "compact"는 보조 지표로 쓸 때(예: 목록 한 줄)의 한 줄짜리 표기.
   * "hero"는 리포트 맨 위 짙은 판정 밴드 위에서 쓰는 큰 표기.
   */
  variant?: "full" | "compact" | "hero";
};

/** 구간 경계. 눈금의 너비와 바늘 위치가 모두 이 값을 쓴다. */
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

/**
 * 점수를 0~100 눈금 위의 한 지점으로 읽는다. 채워지는 막대를 쓰지 않는 이유는
 * 채움 막대가 "얼마나 진행됐나"로 읽히기 때문이다. 여기서 점수는 진행률이 아니라
 * 세 구간 중 어디에 섰는지를 가리키는 측정값이다.
 */
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

  // 짙은 바탕 위에서는 구간 색을 밝은 짝으로 바꾸고, 꺼진 구간은 흰색을 낮춰 쓴다.
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
        {/* 바늘 */}
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

        {/* 눈금 띠. 서 있는 구간만 또렷하고 나머지는 연하게 둔다. */}
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
