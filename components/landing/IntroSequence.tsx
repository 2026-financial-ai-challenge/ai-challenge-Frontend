"use client";

import { Button } from "@/components/ui/button";
import { CallerShadow } from "@/components/landing/CallerShadow";
import { useIntroHydrated, useIntroStore } from "@/lib/stores/intro-store";
import {
  AlarmFillIcon,
  CameraFillIcon,
  EllipsisIcon,
  FlashlightFillIcon,
  KeypadIcon,
  LockFillIcon,
  MessageFillIcon,
  MicSlashFillIcon,
  PhoneDownFillIcon,
  PhoneFillIcon,
  SpeakerWave3FillIcon,
  VideoFillIcon,
} from "@/components/landing/IosIcons";
import {
  FRAME_HEIGHT_PX,
  FRAME_WIDTH_PX,
  INTRO_CALLER_NUMBER,
  INTRO_FAKE_AGENCY,
  SAFE_CHOICE,
  SLIDER_KNOB_PX,
  STAGE_REVIEW,
  TYPING_INTERVAL_MS,
  buildVerdict,
  computeFrameScale,
  computeSlideX,
  emptyChoices,
  formatCallDuration,
  nextAfterChoice,
  shouldAcceptSlide,
  shouldShowHijackCard,
  stageData,
  type ChoiceKey,
  type StageNumber,
  type UserChoices,
} from "@/lib/intro";
import { ArrowRight, Info, RotateCcw, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type IntroMode = "ringing" | "call" | "declined" | "verdict";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function TypedScript({ script }: { script: string }) {
  const [length, setLength] = useState(0);
  const isTyping = length < script.length;

  useEffect(() => {
    if (!isTyping) return;
    const id = window.setTimeout(
      () => setLength((current) => current + 1),
      TYPING_INTERVAL_MS,
    );
    return () => window.clearTimeout(id);
  }, [isTyping, length]);

  return (
    <button
      type="button"
      disabled={!isTyping}
      onClick={() => setLength(script.length)}
      className="w-full rounded-[22px] bg-white/[0.16] p-4 backdrop-blur-2xl border border-white/15 text-left shadow-lg transition-all enabled:cursor-pointer enabled:hover:bg-white/[0.22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <p
        aria-hidden="true"
        className="text-[13px] leading-relaxed text-white font-sans font-normal"
      >
        &ldquo;{script.slice(0, length)}&rdquo;
        {isTyping && (
          <span className="inline-block h-3.5 w-[2px] bg-white ml-1 animate-pulse align-middle" />
        )}
      </p>
      <span className="sr-only">
        상대방: {script}
        {isTyping ? " (눌러서 전체 대사 보기)" : ""}
      </span>
    </button>
  );
}

export function IntroSequence() {
  const introHydrated = useIntroHydrated();
  const introSeen = useIntroStore((state) => state.seen);

  if (!introHydrated || introSeen) return null;

  return <IntroExperience />;
}

function IntroExperience() {
  const setIntroActive = useIntroStore((state) => state.setActive);
  const markIntroSeen = useIntroStore((state) => state.markSeen);
  const [mode, setMode] = useState<IntroMode>("ringing");
  const [currentStage, setCurrentStage] = useState<StageNumber>(1);
  const [userChoices, setUserChoices] = useState<UserChoices>(emptyChoices);
  const [callDuration, setCallDuration] = useState(0);

  const [slideX, setSlideX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const sliderKnobRef = useRef<HTMLDivElement>(null);

  const [frameScale, setFrameScale] = useState(1);
  const frameScaleRef = useRef(1);

  const dialogRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState<string>("12:04");
  const [currentDateStr, setCurrentDateStr] = useState<string>("9월 27일 (일)");

  useEffect(() => {
    setIntroActive(true);
    return () => setIntroActive(false);
  }, [setIntroActive]);

  useEffect(() => {
    const originalHtml = document.documentElement.style.overflow;
    const originalBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = originalHtml;
      document.body.style.overflow = originalBody;
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${h}:${m}`);

      const month = now.getMonth() + 1;
      const date = now.getDate();
      const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
      setCurrentDateStr(`${month}월 ${date}일 (${dayNames[now.getDay()]})`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 10);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mode !== "call") return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [mode]);

  const currentStageConfig = useMemo(() => {
    const prevChoice = currentStage > 1 ? userChoices[(currentStage - 1) as StageNumber] : undefined;
    return stageData(currentStage, prevChoice);
  }, [currentStage, userChoices]);

  const verdict = useMemo(() => buildVerdict(userChoices), [userChoices]);
  const showHijackCard = shouldShowHijackCard(userChoices);

  const handleDismiss = useCallback(() => {
    markIntroSeen();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [markIntroSeen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleDismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDismiss]);

  useEffect(() => {
    const updateScale = () => {
      const next = computeFrameScale(window.innerWidth, window.innerHeight);
      frameScaleRef.current = next;
      setFrameScale(next);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", updateScale);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((item) => item.offsetParent !== null);

      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const active = document.activeElement;
      const outside = !active || !dialog.contains(active);
      const edge = event.shiftKey ? items[0] : items[items.length - 1];
      if (outside || active === edge) {
        event.preventDefault();
        (event.shiftKey ? items[items.length - 1] : items[0]).focus();
      }
    };

    dialog.addEventListener("keydown", onKeyDown);
    return () => {
      dialog.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, []);

  // 화면이 바뀌며 누른 버튼이 사라지면 초점이 body로 떨어진다. 모달 안으로 되돌린다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const active = document.activeElement;
    if (!active || !dialog.contains(active)) dialog.focus();
  }, [mode]);

  const handleAcceptCall = useCallback(() => {
    setMode("call");
    setCurrentStage(1);
    setCallDuration(1);
    setSlideX(0);
  }, []);

  const handleDeclineCall = () => {
    setMode("declined");
  };

  const handleMakeChoice = (choice: ChoiceKey) => {
    setUserChoices((prev) => ({
      ...prev,
      [currentStage]: choice,
    }));

    const next = nextAfterChoice(currentStage);
    if (next.mode === "verdict") {
      setMode("verdict");
    } else {
      setCurrentStage(next.stage);
    }
  };

  const handleReset = () => {
    setMode("ringing");
    setCurrentStage(1);
    setUserChoices(emptyChoices());
    setCallDuration(0);
    setSlideX(0);
  };

  const handleTouchStart = () => setIsDragging(true);

  // 드래그 중에만 window 리스너를 단다. 핸들러를 effect 안에 두어야
  // isDragging이 바뀔 때 최신 값을 보는 리스너로 교체된다.
  useEffect(() => {
    if (!isDragging) return;
    const track = sliderTrackRef.current;
    if (!track) return;

    const onMove = (event: MouseEvent | TouchEvent) => {
      const rect = track.getBoundingClientRect();
      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      // rect는 축소 배율이 곱해진 화면 px이라, 레이아웃 px로 되돌려 계산한다.
      const maxSlide = track.offsetWidth - SLIDER_KNOB_PX;
      const slide = computeSlideX({
        clientX,
        trackLeft: rect.left,
        frameScale: frameScaleRef.current || 1,
        maxSlide,
      });
      setSlideX(slide);

      if (shouldAcceptSlide(slide, maxSlide)) {
        setIsDragging(false);
        handleAcceptCall();
      }
    };

    const onEnd = () => {
      setIsDragging(false);
      setSlideX(0);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, handleAcceptCall]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="보이스피싱 모의 통화 체험"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-2 sm:p-4 text-white outline-none backdrop-blur-md animate-in fade-in duration-200"
    >
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-5 top-5 z-40 flex items-center gap-1 rounded-full bg-zinc-800/80 px-3 py-1.5 text-[12px] font-medium text-zinc-300 backdrop-blur-md transition-colors hover:bg-zinc-700 hover:text-white"
      >
        <span>체험 건너뛰기</span>
        <X className="h-3.5 w-3.5" />
      </button>

      <div
        className="relative z-10 my-auto shrink-0"
        style={{
          width: FRAME_WIDTH_PX * frameScale,
          height: FRAME_HEIGHT_PX * frameScale,
        }}
      >
        <div
          className="relative flex items-center justify-center select-none"
          style={{
            width: FRAME_WIDTH_PX,
            height: FRAME_HEIGHT_PX,
            transform: `scale(${frameScale})`,
            transformOrigin: "top left",
          }}
        >
        
          <div className="hidden sm:block absolute -left-[7px] top-24 h-7 w-[4px] rounded-l-[3px] bg-zinc-700 shadow-sm" />
          <div className="hidden sm:block absolute -left-[7px] top-36 h-12 w-[4px] rounded-l-[3px] bg-zinc-700 shadow-sm" />
          <div className="hidden sm:block absolute -left-[7px] top-52 h-12 w-[4px] rounded-l-[3px] bg-zinc-700 shadow-sm" />

          {mode === "ringing" ? (
            <button
              type="button"
              onClick={handleDeclineCall}
              aria-label="전원 버튼 눌러 전화 거절하기"
              className="hidden sm:block absolute -right-[7px] top-36 h-16 w-[4px] rounded-r-[3px] bg-zinc-700 shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            />
          ) : (
            <div
              aria-hidden="true"
              className="hidden sm:block absolute -right-[7px] top-36 h-16 w-[4px] rounded-r-[3px] bg-zinc-700 shadow-sm"
            />
          )}

          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[50px] border-[5px] border-black bg-[#1a1b22] text-white shadow-[0_0_0_3px_#2a2b30,0_25px_65px_-15px_rgba(0,0,0,0.95)]">

            <CallerShadow caller={mode === "ringing" || mode === "call"} />

            <div className="relative z-30 flex items-center justify-between px-6 pt-3 select-none text-white">
              <div className="flex items-center gap-1.5 pl-0.5">
                <span className="font-semibold tracking-tight text-[13.5px] leading-none tabular-nums font-sans">
                  {currentTime}
                </span>
                <svg
                  className="h-[10px] w-[10px] fill-white shrink-0 -rotate-45"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                </svg>
              </div>

              <div className="absolute left-1/2 top-2 -translate-x-1/2 flex items-center justify-between rounded-full bg-black px-3 py-1 ring-1 ring-zinc-800 w-[96px] h-[28px]">
                {mode === "declined" ? (
                  <>
                    <LockFillIcon className="h-3 w-3 text-white" />
                    <div className="h-2 w-2 rounded-full bg-zinc-900" />
                  </>
                ) : (
                  <div className="mx-auto flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-900 border border-zinc-800/80" />
                    <div className="h-2 w-2 rounded-full bg-zinc-900" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-[4px] pr-0.5 text-white">
                <div className="flex items-end gap-[1.5px] h-[11px] pb-[0.5px]">
                  <span className="w-[3px] h-[3px] bg-white rounded-[0.8px]" />
                  <span className="w-[3px] h-[5.5px] bg-white rounded-[0.8px]" />
                  <span className="w-[3px] h-[8px] bg-white rounded-[0.8px]" />
                  <span className="w-[3px] h-[10.5px] bg-white rounded-[0.8px]" />
                </div>

                <span className="text-[12px] font-semibold tracking-tight leading-none font-sans">
                  5G
                </span>

                <div className="flex items-center">
                  <div className="h-[11.5px] w-[22px] rounded-[3.5px] border-[1.2px] border-white/90 p-[1.5px] flex items-center">
                    <div className="h-full w-full rounded-[1.5px] bg-white" />
                  </div>
                  <div className="h-[4.5px] w-[1.5px] rounded-r-[1px] bg-white/90 ml-[0.5px]" />
                </div>
              </div>
            </div>

            {mode === "ringing" && (
              <div className="relative z-10 flex flex-1 flex-col justify-between pt-6 pb-4 px-6 animate-in fade-in duration-200 select-none">
                <div className="text-center pt-5">
                  <h2 className="text-[33px] font-medium tracking-tight text-white font-sans leading-none">
                    {INTRO_CALLER_NUMBER}
                  </h2>
                  <p className="mt-2 text-[16px] font-normal text-zinc-300">
                    대한민국
                  </p>
                </div>

                <div className="flex-1" />

                <div className="flex items-center justify-between px-10 mb-8 text-white">
                  <button
                    type="button"
                    onClick={handleDeclineCall}
                    aria-label="나중에 보기 — 전화를 받지 않고 넘깁니다"
                    className="flex flex-col items-center gap-1.5 rounded-2xl px-3 py-1 opacity-95 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <AlarmFillIcon className="h-[23px] w-[23px] text-white" />
                    <span className="text-[13px] font-normal text-zinc-100">나중에 보기</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeclineCall}
                    aria-label="메시지로 응답 — 전화를 받지 않고 넘깁니다"
                    className="flex flex-col items-center gap-1.5 rounded-2xl px-3 py-1 opacity-95 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <MessageFillIcon className="h-[23px] w-[23px] text-white" />
                    <span className="text-[13px] font-normal text-zinc-100">메시지</span>
                  </button>
                </div>

                <div className="pb-2">
                  <div
                    ref={sliderTrackRef}
                    className="relative flex h-[68px] w-full items-center rounded-full bg-white/20 p-1.5 backdrop-blur-2xl shadow-[inset_0_0_10px_rgba(255,255,255,0.06)] overflow-hidden select-none"
                  >
                    <div className="absolute inset-0 flex items-center justify-center pl-8 pointer-events-none select-none">
                      <span className="text-[16px] font-normal tracking-tight text-white/85">
                        밀어서 통화하기
                      </span>
                    </div>

                    <div
                      ref={sliderKnobRef}
                      aria-hidden="true"
                      onMouseDown={handleTouchStart}
                      onTouchStart={handleTouchStart}
                      style={{
                        transform: `translateX(${slideX}px)`,
                        transition: isDragging ? "none" : "transform 0.25s ease-out",
                      }}
                      className="relative z-10 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.35)] active:scale-95 cursor-grab active:cursor-grabbing"
                    >
                      <PhoneFillIcon className="h-[28px] w-[28px] text-[#34C759]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode === "declined" && (
              <div className="relative z-10 flex flex-1 flex-col justify-between py-4 px-5 animate-in fade-in duration-200">
                <div>
                  <div className="flex flex-col items-center pt-3 text-center">
                    <p className="text-[16px] font-normal tracking-tight text-white/85 font-sans tabular-nums">
                      {currentDateStr}
                    </p>
                    <span className="mt-1 text-[76px] font-medium tracking-tight leading-none text-white font-sans tabular-nums">
                      {currentTime}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAcceptCall}
                    aria-label="위조 영장 문자 눌러 다시 통화 확인하기"
                    className="mt-6 block w-full cursor-pointer rounded-[22px] bg-zinc-800/85 p-3.5 text-left border border-white/10 shadow-2xl backdrop-blur-xl transition-all hover:bg-zinc-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-[4px] bg-[#34C759] flex items-center justify-center shadow-sm">
                          <MessageFillIcon className="h-2.5 w-2.5 text-white" />
                        </div>
                        <span className="font-semibold text-zinc-200 text-[11px]">
                          메시지
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400">지금</span>
                    </div>

                    <p className="mt-2 text-[12px] font-semibold text-white">
                      {INTRO_CALLER_NUMBER}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-200">
                      <strong className="text-rose-400 font-medium">[{INTRO_FAKE_AGENCY}]</strong> 귀하의 고의적 전화 불응으로 인하여 긴급 체포영장 청구 및 자산 동결 심의가 착수됩니다. (사건번호 2026-형제-4892호)
                    </p>
                    <p className="mt-2 text-[10px] text-right font-medium text-[#34C759]">
                      탭하여 통화 확인하기 →
                    </p>
                  </button>

                  <div className="mt-5 rounded-2xl bg-zinc-900/60 p-3.5 border border-white/5 text-left text-xs leading-relaxed text-zinc-400">
                    <p className="text-zinc-200 font-semibold mb-1 text-[11px]">전화를 끊어도 끝이 아닙니다</p>
                    실제 피싱 조직은 통화가 끊기면 이런 위조 영장 문자를 보내 다시 전화를 걸게 만듭니다.
                    불안해진 사람이 직접 전화를 걸면, 조직이 노린 그림이 그대로 완성됩니다.
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 pb-2">
                  <div
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md border border-white/10 text-white"
                  >
                    <FlashlightFillIcon className="h-[22px] w-[22px]" />
                  </div>
                  <button
                    type="button"
                    onClick={handleAcceptCall}
                    className="text-xs text-zinc-400 underline hover:text-white"
                  >
                    통화 화면으로 이동
                  </button>
                  <div
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md border border-white/10 text-white"
                  >
                    <CameraFillIcon className="h-[22px] w-[22px]" />
                  </div>
                </div>
              </div>
            )}

            {mode === "call" && (
              <div className="relative z-10 flex flex-1 flex-col justify-between pt-6 pb-2 px-3 animate-in fade-in duration-300 select-none">
              
                <div className="text-center pt-7 pb-1">
                  <p className="text-[16px] font-normal tracking-tight text-white/85 font-sans tabular-nums">
                    {formatCallDuration(callDuration)}
                  </p>
                  <h2 className="text-[26px] font-medium tracking-tight text-white font-sans mt-1 leading-none">
                    {INTRO_CALLER_NUMBER}
                  </h2>
                </div>

                <div className="my-auto py-1 space-y-3">
                  <div aria-live="polite">
                    <TypedScript
                      key={currentStage}
                      script={currentStageConfig.script}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[11px] text-white/60 text-center font-medium">
                      내 대답 선택 ({currentStage}/3)
                    </p>
                    {currentStageConfig.choices.map((choice) => (
                      <button
                        key={choice.key}
                        type="button"
                        onClick={() => handleMakeChoice(choice.key)}
                        className="w-full rounded-2xl bg-white/[0.18] hover:bg-white/[0.28] active:scale-[0.98] py-2.5 px-3 text-left text-white backdrop-blur-2xl border border-white/15 transition-all shadow-md group"
                      >
                        <p className="text-[12px] leading-snug text-white font-sans font-medium group-hover:text-emerald-200">
                          &ldquo;{choice.text}&rdquo;
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1 pb-1">
                  <div className="grid grid-cols-3 gap-y-3 px-3 text-white text-center font-sans">
                    <div aria-hidden="true" className="flex flex-col items-center gap-1.5 opacity-60">
                      <div className="h-[56px] w-[56px] rounded-full bg-white/[0.18] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white">
                        <SpeakerWave3FillIcon className="h-[22px] w-[22px]" />
                      </div>
                      <span className="text-[12px] font-normal text-white/80">스피커</span>
                    </div>

                    <div aria-hidden="true" className="flex flex-col items-center gap-1.5 opacity-60">
                      <div className="h-[56px] w-[56px] rounded-full bg-white/[0.18] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white">
                        <VideoFillIcon className="h-[25px] w-[25px]" />
                      </div>
                      <span className="text-[12px] font-normal text-white/80">FaceTime</span>
                    </div>

                    <div aria-hidden="true" className="flex flex-col items-center gap-1.5 opacity-60">
                      <div className="h-[56px] w-[56px] rounded-full bg-white/[0.18] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white">
                        <MicSlashFillIcon className="h-[22px] w-[22px]" />
                      </div>
                      <span className="text-[12px] font-normal text-white/80">소리 끔</span>
                    </div>

                    <div aria-hidden="true" className="flex flex-col items-center gap-1.5 opacity-60">
                      <div className="h-[56px] w-[56px] rounded-full bg-white/[0.18] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white">
                        <EllipsisIcon className="h-[22px] w-[22px]" />
                      </div>
                      <span className="text-[12px] font-normal text-white/80">더 보기</span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setMode("verdict")}
                        className="h-[56px] w-[56px] rounded-full bg-[#FF3B30] flex items-center justify-center text-white shadow-[0_4px_20px_rgba(255,59,48,0.5)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                        aria-label="종료"
                      >
                        <PhoneDownFillIcon className="h-[28px] w-[28px]" />
                      </button>
                      <span className="text-[12px] font-normal text-white/90">종료</span>
                    </div>

                    <div aria-hidden="true" className="flex flex-col items-center gap-1.5 opacity-60">
                      <div className="h-[56px] w-[56px] rounded-full bg-white/[0.18] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white">
                        <KeypadIcon className="h-[22px] w-[22px]" />
                      </div>
                      <span className="text-[12px] font-normal text-white/80">키패드</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {mode === "verdict" && (
              <div className="relative z-10 flex flex-1 flex-col justify-between py-2 px-3 animate-in fade-in duration-200 text-left overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="pt-1">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                    <div>
                      <p className="text-sm font-semibold text-[#FF3B30]">
                        {INTRO_CALLER_NUMBER}
                      </p>
                      <p className="text-[11px] text-zinc-400">대한민국 · 발신 종료</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">방금 전</span>
                      <Info className="h-4 w-4 text-[#007AFF]" />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-white leading-snug">
                      {verdict.title}
                    </h3>
                    <span
                      className={`mt-0.5 shrink-0 rounded-full px-2 py-[3px] text-[10px] font-bold ${
                        verdict.tone === "safe"
                          ? "bg-[#34C759]/15 text-[#34C759]"
                          : verdict.tone === "warn"
                            ? "bg-[#FF9500]/15 text-[#FF9500]"
                            : "bg-[#FF3B30]/15 text-[#FF3B30]"
                      }`}
                    >
                      {verdict.safeCount}/3 차단
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                    {verdict.summary}
                  </p>

                  <ul className="mt-2.5 space-y-1.5">
                    {([1, 2, 3] as StageNumber[]).map((stage) => {
                      const blocked = userChoices[stage] === SAFE_CHOICE;
                      return (
                        <li
                          key={stage}
                          className="flex gap-2.5 rounded-2xl border border-white/10 bg-zinc-900/75 px-3 py-2.5 backdrop-blur-xl"
                        >
                          <span
                            className={`mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold leading-none ${
                              blocked ? "bg-[#34C759] text-black" : "bg-[#FF3B30] text-white"
                            }`}
                          >
                            {blocked ? "✓" : "!"}
                          </span>
                          <div>
                            <p className="text-[12px] font-semibold text-white">
                              {STAGE_REVIEW[stage].label}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">
                              {blocked
                                ? STAGE_REVIEW[stage].safe
                                : STAGE_REVIEW[stage].unsafe}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-1.5 rounded-2xl bg-zinc-900/75 border border-white/10 divide-y divide-white/10 text-xs text-zinc-300 backdrop-blur-xl">
                    {showHijackCard && (
                      <div className="px-3 py-2.5">
                        <p className="font-semibold text-[#FF3B30] text-[12px] mb-1">
                          직접 대표번호로 걸어도 안 되는 이유
                        </p>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          악성 앱이 설치되는 순간 휴대전화가 넘어가, 이후 112나 1301 어디로 걸든 통화가 조직의 콜센터로 가로채집니다. 끊고 다른 전화기로 거는 것만이 확실합니다.
                        </p>
                      </div>
                    )}

                    <div className="px-3 py-2.5">
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        기관 사칭 전화는 나이나 직업을 가려서 걸려오지 않습니다. 글이나 퀴즈로 볼 때와, 일상 중에 갑자기 울리는 전화는 심장 박동부터 다릅니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-2 pb-1">
                  <Button
                    type="button"
                    onClick={handleDismiss}
                    className="w-full bg-[#007AFF] text-white hover:bg-[#007AFF]/90 text-xs h-10 font-semibold rounded-xl shadow-md"
                  >
                    <span>내 번호로 실전 전화 훈련 받기</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-1 text-xs text-zinc-400 hover:text-white py-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>처음부터 다시 시뮬레이션하기</span>
                  </button>
                </div>
              </div>
            )}

            <div className="relative z-30 pt-1 pb-1 select-none">
              <div className="mx-auto h-[4px] w-32 rounded-full bg-white/70" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
