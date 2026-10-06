import { annotateBehaviorOrigins } from "@/lib/report-behaviors";
import { describe, expect, it } from "vitest";

const 이름말함 = { label: "이름 노출", evidence: "김영수입니다" };
const 링크접속 = { label: "링크 접속", evidence: "눌러봤어요" };
const 의심질문 = { label: "소속 확인", evidence: "소속이 어디시죠?" };

describe("report behaviors", () => {
  it("한쪽 통화에만 있던 행동은 그 통화로 표시한다", () => {
    const annotated = annotateBehaviorOrigins(
      [이름말함, 링크접속],
      [이름말함],
      [링크접속],
    );

    expect(annotated.map((item) => item.origin)).toEqual([
      "announced",
      "unannounced",
    ]);
  });

  it("두 통화에서 반복된 행동은 두 통화 모두로 표시한다", () => {
    const annotated = annotateBehaviorOrigins([이름말함], [이름말함], [이름말함]);

    expect(annotated[0].origin).toBe("both");
  });

  it("라벨이 같아도 근거가 다르면 각각 나온 통화로 나뉜다", () => {
    const 다른근거 = { label: 이름말함.label, evidence: "네, 김영수 맞습니다" };
    const annotated = annotateBehaviorOrigins(
      [이름말함, 다른근거],
      [이름말함],
      [다른근거],
    );

    expect(annotated.map((item) => item.origin)).toEqual([
      "announced",
      "unannounced",
    ]);
  });

  it("통화별 리포트가 없으면 출처를 표시하지 않는다", () => {
    const annotated = annotateBehaviorOrigins([의심질문], null, null);

    expect(annotated[0].origin).toBeNull();
  });

  it("어느 통화에서도 찾지 못한 행동은 출처를 비워 둔다", () => {
    const annotated = annotateBehaviorOrigins([의심질문], [이름말함], [링크접속]);

    expect(annotated[0].origin).toBeNull();
  });

  it("원본 항목과 순서는 그대로 둔다", () => {
    const annotated = annotateBehaviorOrigins(
      [이름말함, 링크접속],
      [이름말함],
      [링크접속],
    );

    expect(annotated.map(({ label, evidence }) => ({ label, evidence }))).toEqual([
      이름말함,
      링크접속,
    ]);
  });
});
