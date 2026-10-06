import { describe, expect, it } from "vitest";
import {
  FRAME_HEIGHT_PX,
  FRAME_MARGIN_PX,
  MIN_FRAME_SCALE,
  SAFE_CHOICE,
  SLIDE_ACCEPT_RATIO,
  buildVerdict,
  computeFrameScale,
  computeSlideX,
  emptyChoices,
  formatCallDuration,
  nextAfterChoice,
  shouldAcceptSlide,
  shouldShowHijackCard,
  stageData,
} from "@/lib/intro";

describe("intro experience", () => {
  it("이전 선택에 따라 2단계 대사가 갈린다", () => {
    expect(stageData(2, "A").script).toContain("명의도용");
    expect(stageData(2, "B").script).toContain("장난 전화");
  });

  it("1·2단계는 통화를 이어 가고 3단계는 결과로 간다", () => {
    expect(nextAfterChoice(1)).toEqual({ stage: 2, mode: "call" });
    expect(nextAfterChoice(2)).toEqual({ stage: 3, mode: "call" });
    expect(nextAfterChoice(3)).toEqual({ stage: 3, mode: "verdict" });
  });

  it("세 번 다 끊으면 안전 결과다", () => {
    const verdict = buildVerdict({ 1: "B", 2: "B", 3: "B" });
    expect(verdict.tone).toBe("safe");
    expect(verdict.safeCount).toBe(3);
  });

  it("앱 설치에 동의하면 앞을 막아도 위험이다", () => {
    const verdict = buildVerdict({ 1: "B", 2: "B", 3: "A" });
    expect(verdict.tone).toBe("danger");
    expect(shouldShowHijackCard({ 1: "B", 2: "B", 3: "A" })).toBe(true);
  });

  it("중간만 설득당하면 경고다", () => {
    expect(buildVerdict({ 1: "B", 2: "A", 3: "B" }).tone).toBe("warn");
    expect(shouldShowHijackCard(emptyChoices())).toBe(false);
    expect(SAFE_CHOICE).toBe("B");
  });

  it("슬라이더를 충분히 밀면 수신한다", () => {
    const maxSlide = 200;
    const accepted = computeSlideX({
      clientX: 300,
      trackLeft: 0,
      frameScale: 1,
      maxSlide,
    });
    expect(shouldAcceptSlide(maxSlide * SLIDE_ACCEPT_RATIO, maxSlide)).toBe(
      true,
    );
    expect(shouldAcceptSlide(maxSlide * 0.5, maxSlide)).toBe(false);
    expect(accepted).toBeLessThanOrEqual(maxSlide);
  });

  it("짧은 화면에서는 최소 배율까지 줄인다", () => {
    expect(computeFrameScale(1200, 1200)).toBe(1);
    expect(computeFrameScale(200, 200)).toBe(MIN_FRAME_SCALE);
    expect(
      computeFrameScale(FRAME_HEIGHT_PX + FRAME_MARGIN_PX, 400),
    ).toBeLessThan(1);
  });

  it("통화 시간을 mm:ss로 보여 준다", () => {
    expect(formatCallDuration(0)).toBe("00:00");
    expect(formatCallDuration(75)).toBe("01:15");
  });
});
