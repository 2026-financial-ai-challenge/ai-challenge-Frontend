"use client";

import { Button } from "@/components/ui/button";
import { useIntroStore } from "@/lib/stores/intro-store";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Phone,
  PhoneCall,
  PhoneOff,
  RotateCcw,
  ShieldAlert,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type IntroStep = "ringing" | "connected" | "verdict";
type UserDecision = "suspect" | "panic" | "decline";

const PHISHING_SCRIPT =
  "서울중앙지검 김민수 수사관입니다. 본인 명의 계좌가 대포통장 금융사기에 연루되어 긴급 동결 절차 중입니다. 계좌 비밀번호 앞 두 자리를 확인해주셔야 동결을 막을 수 있습니다.";

export function IntroSequence() {
  const setIntroActive = useIntroStore((state) => state.setActive);
  const [step, setStep] = useState<IntroStep>("ringing");
  const [decision, setDecision] = useState<UserDecision | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [typedScript, setTypedScript] = useState("");

  const showOverlay = !dismissed;

  useEffect(() => {
    setIntroActive(showOverlay);
    return () => setIntroActive(false);
  }, [showOverlay, setIntroActive]);

  // 배경 스크롤 잠금
  useEffect(() => {
    if (!showOverlay) return;
    const originalHtml = document.documentElement.style.overflow;
    const originalBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = originalHtml;
      document.body.style.overflow = originalBody;
    };
  }, [showOverlay]);

  // 통화 연결 시 타이머 동작
  useEffect(() => {
    if (step !== "connected") return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // 통화 연결 시 대사 타이핑 효과
  useEffect(() => {
    if (step !== "connected") return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < PHISHING_SCRIPT.length) {
        setTypedScript(PHISHING_SCRIPT.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [step]);

  const handleDismiss = () => {
    setDismissed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ESC 키로 건너뛰기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleAcceptCall = () => {
    setStep("connected");
    setCallDuration(1);
  };

  const handleDeclineCall = () => {
    setDecision("decline");
    setStep("verdict");
  };

  const handleMakeChoice = (choice: "suspect" | "panic") => {
    setDecision(choice);
    setStep("verdict");
  };

  const handleReset = () => {
    setStep("ringing");
    setDecision(null);
    setCallDuration(0);
    setTypedScript("");
  };

  if (dismissed) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="보이스피싱 모의 통화 체험"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/90 p-4 text-white backdrop-blur-xl animate-in fade-in duration-300"
    >
      {/* 배경 장식 광원 효과 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-600/15 blur-[120px]"
      />

      {/* 우측 상단 건너뛰기 버튼 */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-5 top-5 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 transition-all hover:border-white/40 hover:bg-white/20 hover:text-white"
      >
        <span>체험 건너뛰기</span>
        <X className="h-3.5 w-3.5" />
      </button>

      {/* 메인 스마트폰 인터랙션 카드 */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-slate-900/95 to-slate-950/98 p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
        {/* 상단 스피커 홀 & 시뮬레이션 인디케이터 */}
        <div className="grid grid-cols-3 items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 justify-self-start">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-white/70 uppercase">
              실전 시뮬레이션
            </span>
          </div>
          <div className="h-1.5 w-16 justify-self-center rounded-full bg-white/20" />
          <span className="justify-self-end text-[11px] font-mono text-white/50">
            {step === "connected"
              ? `00:${callDuration.toString().padStart(2, "0")}`
              : "02-1301"}
          </span>
        </div>

        {/* 1단계: 전화 수신 중 화면 */}
        {step === "ringing" && (
          <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-300">
            {/* 발신자 아이콘 & 펄스 링 */}
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20 duration-1000" />
              <div className="absolute inset-2 animate-pulse rounded-full bg-red-500/30" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-700 shadow-lg shadow-red-500/30">
                <ShieldAlert className="h-9 w-9 text-white" />
              </div>
            </div>

            {/* 발신자 정보 */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>피싱 위험 의심 번호</span>
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
              02-1301
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-300">
              서울중앙지방검찰청
            </p>
            <p className="mt-1 text-xs text-slate-400">
              검찰 사칭 대표 번호로 전화가 걸려왔습니다
            </p>

            {/* 하단 통화 수신 / 거절 버튼 */}
            <div className="mt-10 flex items-center justify-around px-2">
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleDeclineCall}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                  aria-label="전화 거절하기"
                >
                  <PhoneOff className="h-7 w-7" />
                </button>
                <span className="text-xs text-white/70">거절</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleAcceptCall}
                  className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 transition-transform hover:scale-105 active:scale-95"
                  aria-label="전화 받기"
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <Phone className="relative h-7 w-7" />
                </button>
                <span className="text-xs font-semibold text-emerald-400">
                  통화 받기
                </span>
              </div>
            </div>

            <p className="mt-8 text-xs text-white/40">
              받아서 실제 피싱범이 어떻게 접근하는지 확인해보세요
            </p>
          </div>
        )}

        {/* 2단계: 통화 연결 중 & 시나리오 선택 */}
        {step === "connected" && (
          <div className="py-5 animate-in fade-in zoom-in-95 duration-300">
            {/* 통화 헤더 상태 */}
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-white/80">통화 연결됨</p>
                  <p className="font-mono text-xs text-emerald-400">
                    00:{callDuration.toString().padStart(2, "0")}
                  </p>
                </div>
              </div>
              {/* 사운드 웨이브 애니메이션 */}
              <div className="flex items-center gap-1">
                <span className="h-3 w-1 animate-pulse rounded-full bg-emerald-400" />
                <span className="h-5 w-1 animate-pulse rounded-full bg-emerald-400 delay-75" />
                <span className="h-2 w-1 animate-pulse rounded-full bg-emerald-400 delay-150" />
                <span className="h-6 w-1 animate-pulse rounded-full bg-emerald-400 delay-200" />
                <span className="h-4 w-1 animate-pulse rounded-full bg-emerald-400 delay-100" />
              </div>
            </div>

            {/* 피싱범 음성 말풍선 */}
            <div className="mt-5 min-h-[6.5rem] rounded-2xl border border-red-500/30 bg-red-950/30 p-4 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
                <Volume2 className="h-3.5 w-3.5" />
                <span>상대방 (검찰 사칭범)</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                &ldquo;{typedScript}&rdquo;
                {typedScript.length < PHISHING_SCRIPT.length && (
                  <span className="inline-block h-3.5 w-1.5 animate-pulse bg-red-400 align-middle ml-1" />
                )}
              </p>
            </div>

            {/* 사용자 선택지 */}
            <div className="mt-6">
              <p className="text-center text-xs font-medium text-white/70">
                지금 당신이라면 어떻게 대답하시겠습니까?
              </p>

              <div className="mt-3 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => handleMakeChoice("suspect")}
                  className="rounded-xl border border-white/20 bg-white/10 p-3.5 text-left transition-all hover:border-emerald-400/80 hover:bg-emerald-950/40 active:scale-[0.98]"
                >
                  <span className="block text-xs font-semibold text-emerald-300">
                    대응 A
                  </span>
                  <span className="mt-1 block text-sm font-medium text-white">
                    &ldquo;소속과 성함을 남겨주세요. 제가 검찰청 대표번호로 직접
                    다시 걸겠습니다.&rdquo;
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMakeChoice("panic")}
                  className="rounded-xl border border-white/20 bg-white/10 p-3.5 text-left transition-all hover:border-red-400/80 hover:bg-red-950/40 active:scale-[0.98]"
                >
                  <span className="block text-xs font-semibold text-red-300">
                    대응 B
                  </span>
                  <span className="mt-1 block text-sm font-medium text-white">
                    &ldquo;네?! 제 계좌가요? 저는 그런 적 없는데... 앞자리만
                    알려드리면 되나요?&rdquo;
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3단계: 선택 결과 & 해설 및 전환 */}
        {step === "verdict" && (
          <div className="py-5 text-center animate-in fade-in zoom-in-95 duration-300">
            {decision === "suspect" && (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-white">
                  침착하고 훌륭한 대처입니다!
                </h3>
                <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3.5 text-left text-xs leading-relaxed text-slate-300">
                  <p className="font-semibold text-emerald-400">
                    하지만 방심할 수 없습니다
                  </p>
                  <p className="mt-1">
                    실제 피싱범은 스마트폰에 악성 앱을 심어두어, 피해자가 검찰청
                    공식 번호(1301)로 다시 걸어도{" "}
                    <strong className="text-white">
                      전화가 피싱 조직으로 바로 연결
                    </strong>
                    되도록 조작합니다.
                  </p>
                </div>
              </>
            )}

            {decision === "panic" && (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-white">
                  위험합니다! 피해로 이어질 수 있습니다
                </h3>
                <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3.5 text-left text-xs leading-relaxed text-slate-300">
                  <p className="font-semibold text-red-400">
                    보이스피싱의 핵심 심리 트릭
                  </p>
                  <p className="mt-1">
                    &lsquo;계좌 동결&rsquo;, &lsquo;구속 영장&rsquo; 등 극도의 공포감을
                    조성하면 평소 똑똑한 사람도 당황해 판단력을 잃습니다.{" "}
                    <strong className="text-white">
                      피해자의 72%가 이 단계에서 정보를 넘겨줍니다.
                    </strong>
                  </p>
                </div>
              </>
            )}

            {decision === "decline" && (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                  <PhoneOff className="h-8 w-8" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-white">
                  전화를 거절하셨군요
                </h3>
                <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3.5 text-left text-xs leading-relaxed text-slate-300">
                  <p className="font-semibold text-amber-400">
                    실전에서는 어떨까요
                  </p>
                  <p className="mt-1">
                    피싱범은 거절당하면 가족 사칭, 자녀 납치, 택배 오배송 문자로
                    유형을 바꾸어 집요하게 다시 파고듭니다.
                  </p>
                </div>
              </>
            )}

            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold text-slate-300">
                머리로 아는 것과, 실제 전화가 울릴 때의 대응은 다릅니다
              </p>
              <Button
                type="button"
                size="lg"
                onClick={handleDismiss}
                className="w-full gap-2 bg-emerald-500 font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
              >
                <span>실전 전화 훈련 알아보기</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <button
                type="button"
                onClick={handleReset}
                className="mt-2 inline-flex items-center gap-1 text-xs text-white/50 transition-colors hover:text-white"
              >
                <RotateCcw className="h-3 w-3" />
                <span>처음부터 다시 시뮬레이션하기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
