import { ScoreGauge } from "@/components/report/ScoreGauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "서비스소개",
  description:
    "안심피싱이 실제 전화로 보이스피싱 대응훈련을 진행하는 이유와 방식을 소개합니다.",
};

const moments = [
  {
    elapsed: "00:12",
    quote: "사례 영상은 몇 번이나 봤어요.",
    detail: "그런데 막상 검찰을 사칭한 전화를 받으니 머릿속이 하얘지더라고요.",
  },
  {
    elapsed: "01:48",
    quote: "이상하다는 생각은 들었어요.",
    detail: "그런데 상대가 자꾸 다급하게 재촉하니까, 일단 시키는 대로 하게 됐습니다.",
  },
  {
    elapsed: "05:06",
    quote: "나는 절대 안 속을 거라 생각했는데",
    detail: "정신을 차려보니 통화가 이미 5분 넘게 이어지고 있었습니다.",
  },
];

const revealDelays = ["delay-150", "delay-500", "delay-[850ms]"];

const comparison = [
  { label: "걸려오는 때", first: "훈련 시작을 누른 직후", second: "며칠 뒤, 알림 없이" },
  { label: "받는 사람", first: "전화가 올 걸 알고 있음", second: "일상 중에 갑자기 받음" },
  { label: "확인하는 것", first: "알고 있을 때의 대응", second: "실제 위기에 가까운 대응" },
];

const trustItems = [
  {
    title: "휴대전화번호 하나만 받습니다",
    body: "훈련 전화를 걸기 위한 번호 외에 다른 개인정보는 수집하지 않습니다.",
  },
  {
    title: "실제 기관과 무관한 훈련입니다",
    body: "훈련 전화와 문자는 수사기관·금융기관의 업무와 관계없고, 이체나 개인정보 입력을 실제로 요구하지 않습니다.",
  },
  {
    title: "30일 뒤 번호를 파기합니다",
    body: "훈련이 끝나고 30일이 지나면 수집한 번호를 지웁니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="break-keep">
      <section className="bg-primary text-white">
        <div className="mx-auto grid max-w-5xl gap-14 px-5 py-20 sm:py-28 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
          <div>
            <h1 className="text-[2.125rem] font-bold leading-[1.25] tracking-tight sm:text-5xl sm:leading-[1.2]">
              교육은 다 받았는데,
              <br />왜 막상 전화가 오면
              <br />안 될까요?
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
              보이스피싱 수법을 아는 것과, 벨이 울리는 순간 침착하게 반응하는
              것은 다른 능력입니다. 안심피싱은 그 차이를 실제 전화로
              확인합니다.
            </p>
          </div>

          <figure>
            <figcaption className="text-sm text-white/60">
              피해를 겪은 분들이 털어놓은 순간을 통화 흐름대로 옮겼습니다
            </figcaption>
            <ol className="relative mt-6 border-l border-white/20">
              {moments.map((moment, index) => (
                <li
                  key={moment.elapsed}
                  className={`relative pb-9 pl-7 last:pb-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-700 motion-safe:fill-mode-both ${revealDelays[index]}`}
                >
                  <span
                    aria-hidden
                    className={`absolute -left-[5px] top-[0.75rem] h-[9px] sm:top-[1rem] w-[9px] rounded-full ${
                      index === moments.length - 1 ? "bg-danger" : "bg-white/70"
                    }`}
                  />
                  <p className="text-[2rem] font-semibold leading-none tracking-tight tabular-nums text-white/90 sm:text-[2.5rem]">
                    <span className="sr-only">통화 시작 후 </span>
                    {moment.elapsed}
                  </p>
                  <p className="mt-3 text-lg font-semibold leading-snug">
                    &ldquo;{moment.quote}&rdquo;
                  </p>
                  <p className="mt-1.5 max-w-sm text-base leading-relaxed text-white/70">
                    {moment.detail}
                  </p>
                </li>
              ))}
            </ol>
          </figure>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="text-2xl font-bold leading-snug tracking-tight text-text-primary sm:text-3xl">
            그래서 말이 아니라 진짜 전화로,
            <br />두 번 훈련합니다
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary">
            같은 번호로 두 번 걸려옵니다. 마음의 준비가 된 상태와 갑작스러운
            상태의 대응을 나란히 놓고 봐야 실제 대응력을 알 수 있습니다.
          </p>

          <table className="mt-12 w-full table-fixed border-collapse text-left">
            <caption className="sr-only">1차 훈련과 2차 훈련 비교</caption>
            <colgroup>
              <col className="w-[5.5rem] sm:w-48" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr className="border-b-2 border-text-primary align-bottom">
                <td />
                <th scope="col" className="px-3 pb-4 sm:px-5">
                  <span className="block text-sm font-medium text-text-secondary">
                    1차 훈련
                  </span>
                  <span className="mt-1 block text-lg font-bold text-text-primary sm:text-2xl">
                    미리 알고 받는 전화
                  </span>
                </th>
                <th scope="col" className="px-3 pb-4 sm:px-5">
                  <span className="block text-sm font-medium text-danger">
                    2차 훈련
                  </span>
                  <span className="mt-1 block text-lg font-bold text-text-primary sm:text-2xl">
                    예고 없이 받는 전화
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.label} className="border-b border-border align-top">
                  <th
                    scope="row"
                    className="py-5 pr-2 text-sm font-medium text-text-secondary"
                  >
                    {row.label}
                  </th>
                  <td className="px-3 py-5 text-base leading-relaxed text-text-primary sm:px-5">
                    {row.first}
                  </td>
                  <td className="px-3 py-5 text-base leading-relaxed text-text-primary sm:px-5">
                    {row.second}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-background-muted">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 py-20 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold leading-snug tracking-tight text-text-primary sm:text-3xl">
              통화가 끝나면, 바로 리포트로 확인합니다
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
              점수 하나로 끝나지 않습니다. 통화에서 실제로 한 말을 짚어 무엇을
              잘했고 무엇이 위험했는지 보여 드리고, 다음 통화에서 어떻게 답하면
              좋을지까지 알려 드립니다.
            </p>
          </div>

          <div className="w-full max-w-sm justify-self-center rounded-[2rem] border border-border bg-white p-6 shadow-card sm:p-7 lg:justify-self-end">
            <p className="text-center text-xs font-medium text-text-secondary">
              리포트 예시
            </p>
            <div className="mt-2">
              <ScoreGauge score={72} />
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-start gap-2.5">
                <Badge variant="danger" className="mt-0.5 shrink-0">
                  위험 신호
                </Badge>
                <p className="text-sm leading-relaxed text-text-primary">
                  이름을 먼저 말했습니다.
                  <span className="block text-text-secondary">
                    &ldquo;네, 제가 OOO 맞는데요.&rdquo;
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Badge variant="success" className="mt-0.5 shrink-0">
                  방어 행동
                </Badge>
                <p className="text-sm leading-relaxed text-text-primary">
                  공식 채널로 다시 확인했습니다.
                  <span className="block text-text-secondary">
                    &ldquo;대표번호로 다시 걸어보겠습니다.&rdquo;
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-primary-light p-4">
              <p className="text-xs font-semibold text-primary">
                다음 통화를 위한 코칭
              </p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-text-primary">
                소속과 이름을 먼저 물어보고, 공식 대표번호로 직접 다시 거는
                습관을 들여보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-20 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold leading-snug tracking-tight text-text-primary sm:text-3xl">
              안전하게 설계했습니다
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              자세한 내용은{" "}
              <Link
                href="/privacy"
                className="font-medium text-primary underline underline-offset-2"
              >
                개인정보처리방침
              </Link>
              에서 확인할 수 있습니다.
            </p>
          </div>

          <dl className="border-t border-border">
            {trustItems.map((item) => (
              <div key={item.title} className="border-b border-border py-5">
                <dt className="text-base font-semibold text-text-primary">
                  {item.title}
                </dt>
                <dd className="mt-1 text-base leading-relaxed text-text-secondary">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-primary-light">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              지금, 실전처럼 확인해보세요
            </h2>
            <p className="mt-2 text-base text-text-secondary">
              휴대전화번호만 있으면 시작할 수 있습니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Button asChild size="lg">
              <Link href="/signup">회원가입하고 시작하기</Link>
            </Button>
            <Link
              href="/login"
              className="text-sm font-medium text-primary hover:underline"
            >
              이미 계정이 있어요
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
