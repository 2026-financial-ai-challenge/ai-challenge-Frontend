import { ResumeTrainingButton } from "@/components/landing/ResumeTrainingButton";
import { StartTrainingButton } from "@/components/landing/StartTrainingButton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const steps: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    title: "보이스피싱 시뮬레이션",
    body: "안내된 훈련 전화가 걸려옵니다. 실제 보이스피싱처럼 대응해 보면 됩니다. 통화는 휴대전화에서만 진행됩니다.",
  },
  {
    n: "02",
    title: "1차 리포트",
    body: "시뮬레이션이 끝나면 대응 점수와 행동 분석을 확인합니다.",
  },
  {
    n: "03",
    title: "불시 보이스피싱 훈련",
    body: "이후 불시 보이스피싱 훈련 전화가 한 차례 더 옵니다. 발신 시점은 알려 드리지 않습니다.",
  },
  {
    n: "04",
    title: "최종 리포트",
    body: "보이스피싱 시뮬레이션과 불시 보이스피싱 훈련 결과를 비교해 실제 대응력을 확인합니다.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-primary-light bg-primary-light">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
          <div className="min-w-0">
            <div>
              <Badge className="bg-white text-text-primary">
                AI 보이스피싱 실전 대응훈련
              </Badge>
            </div>
            <h1 className="mt-4 max-w-xl text-[1.85rem] font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">
              위험한 전화,
              <br />
              미리 연습하고 막아요
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-text-primary">
              안심피싱은 보이스피싱 시뮬레이션과 불시 보이스피싱 훈련을 같은
              번호로 진행하고, 두 결과를 비교합니다. 미리 아는 상황과 갑작스러운
              상황에서 반응이 얼마나 달라지는지 확인할 수 있습니다.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <StartTrainingButton />
              <ResumeTrainingButton />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-xl font-bold text-text-primary">진행 순서</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-primary">
          보이스피싱 시뮬레이션으로 연습한 뒤, 불시 보이스피싱 훈련까지
          이어집니다. 결과는 리포트로 확인하고, 통화 연결 화면은 제공하지
          않습니다.
        </p>
        <ol className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2">
          {steps.map((step) => (
            <li key={step.n} className="h-full">
              <Card className="h-full p-5">
              <div>
                <p className="text-xs font-semibold tracking-wider text-primary">
                  {step.n}
                </p>
                <h3 className="mt-1 text-base font-bold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-text-primary">
                  {step.body}
                </p>
              </div>
              </Card>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
