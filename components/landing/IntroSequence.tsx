"use client";

import { Button } from "@/components/ui/button";
import { useIntroStore } from "@/lib/stores/intro-store";
import {
  AlarmFillIcon,
  EllipsisIcon,
  KeypadIcon,
  MessageFillIcon,
  MicSlashFillIcon,
  PhoneDownFillIcon,
  PhoneFillIcon,
  SpeakerWave3FillIcon,
  VideoFillIcon,
} from "@/components/landing/IosIcons";
import { ArrowRight, Camera, Flashlight, Info, Lock, RotateCcw, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type IntroMode = "ringing" | "call" | "declined" | "verdict";
type StageNumber = 1 | 2 | 3;
type ChoiceKey = "A" | "B";

interface StageData {
  stageNumber: StageNumber;
  script: string;
  choices: {
    key: ChoiceKey;
    text: string;
  }[];
}

const STAGES_CONFIG: Record<StageNumber, (prevChoice?: ChoiceKey) => StageData> = {
  1: () => ({
    stageNumber: 1,
    script:
      "서울중앙지검 금융범죄수사1부 이진우 수사관입니다. 김영수 씨 되십니까? 본인 명의로 개설된 계좌가 자금세탁 사기 사건에 쓰여서 연락드렸습니다. 직접 개설하신 계좌 맞습니까?",
    choices: [
      {
        key: "A",
        text: "제가 만든 통장이 아닌데요? 무슨 일이죠?",
      },
      {
        key: "B",
        text: "의심스러운데요. 소속 남겨주시면 제가 1301로 직접 다시 걸겠습니다.",
      },
    ],
  }),
  2: (prevChoice) => ({
    stageNumber: 2,
    script:
      prevChoice === "B"
        ? "선생님, 지금 장난 전화 아닙니다. 공무집행 중 끊으시면 출석 기피로 간주되어 바로 체포영장 청구됩니다. 대검찰청 사이트에서 사건번호 2026-형제-4892호 직접 조회해보십시오."
        : "명의도용 피해를 입증하셔야 혐의를 벗습니다. 지금 대검찰청 사이트 들어가셔서 사건번호 2026-형제-4892호 조회해보십시오. 본인 이름으로 출석요구서 올라와 있습니다.",
    choices: [
      {
        key: "A",
        text: "진짜 제 이름으로 사건이 떠 있네요... 제가 어떻게 해야 합니까?",
      },
      {
        key: "B",
        text: "공문이 있어도 전화를 끊고 가족이나 변호사와 먼저 상의하겠습니다.",
      },
    ],
  }),
  3: (prevChoice) => ({
    stageNumber: 3,
    script:
      prevChoice === "B"
        ? "수사 기밀이라 외부로 발설하시면 공범으로 즉시 긴급체포 대상입니다. 결백을 입증하시려면 지금 보내드리는 보안 인증 앱 설치하고 휴대전화 검사부터 받으십시오."
        : "금융보안원 원격 검사로 자산 동결을 막아야 합니다. 지금 문자로 보내드리는 보안 앱 설치하시고 화면 유지하십시오.",
    choices: [
      {
        key: "A",
        text: "공범으로 몰리는 건 무서우니까... 일단 앱 설치하겠습니다.",
      },
      {
        key: "B",
        text: "전화로 앱 설치를 요구하는 건 사기입니다. 끊겠습니다.",
      },
    ],
  }),
};

/** 한 글자가 찍히는 간격(ms). */
const TYPING_INTERVAL_MS = 28;
/** 밀어서 받기 슬라이더 손잡이 너비(px)와 커서 보정값. */
const SLIDER_KNOB_PX = 64;
const SLIDER_GRAB_OFFSET_PX = 28;
/** 손잡이를 이 비율만큼 밀면 통화를 받는다. */
const SLIDE_ACCEPT_RATIO = 0.85;

/**
 * 대사를 한 글자씩 흘려 보여 준다. 누르면 즉시 전체를 보여 준다.
 * 스테이지가 바뀔 때는 `key`로 다시 마운트해 진행 상태를 초기화한다.
 */
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
    <div
      onClick={isTyping ? () => setLength(script.length) : undefined}
      className="rounded-[22px] bg-white/[0.16] p-4 backdrop-blur-2xl border border-white/15 text-left shadow-lg cursor-pointer transition-all hover:bg-white/[0.22]"
    >
      <p className="text-[13px] leading-relaxed text-white font-sans font-normal">
        &ldquo;{script.slice(0, length)}&rdquo;
        {isTyping && (
          <span className="inline-block h-3.5 w-[2px] bg-white ml-1 animate-pulse align-middle" />
        )}
      </p>
    </div>
  );
}

function formatCallDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function IntroSequence() {
  const setIntroActive = useIntroStore((state) => state.setActive);
  const [mode, setMode] = useState<IntroMode>("ringing");
  const [currentStage, setCurrentStage] = useState<StageNumber>(1);
  const [userChoices, setUserChoices] = useState<Record<StageNumber, ChoiceKey | undefined>>({
    1: undefined,
    2: undefined,
    3: undefined,
  });
  const [callDuration, setCallDuration] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  // 슬라이더 드래그 상태
  const [slideX, setSlideX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState<string>("12:04");
  const [currentDateStr, setCurrentDateStr] = useState<string>("9월 27일 일요일");

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

  // 현재 시간 & 날짜 실시간 연동
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${h}:${m}`);

      const month = now.getMonth() + 1;
      const date = now.getDate();
      const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
      const dayName = dayNames[now.getDay()];
      setCurrentDateStr(`${month}월 ${date}일 ${dayName}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 10);
    return () => clearInterval(interval);
  }, []);

  // 통화 연결 시 타이머
  useEffect(() => {
    if (mode !== "call") return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [mode]);

  // 현재 스테이지 대사 데이터
  const currentStageConfig = useMemo(() => {
    const prevChoice = currentStage > 1 ? userChoices[(currentStage - 1) as StageNumber] : undefined;
    return STAGES_CONFIG[currentStage](prevChoice);
  }, [currentStage, userChoices]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ESC 키로 건너뛰기
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleDismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleDismiss]);

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

    if (currentStage < 3) {
      setCurrentStage((prev) => (prev + 1) as StageNumber);
    } else {
      setMode("verdict");
    }
  };

  const handleReset = () => {
    setMode("ringing");
    setCurrentStage(1);
    setUserChoices({ 1: undefined, 2: undefined, 3: undefined });
    setCallDuration(0);
    setSlideX(0);
  };

  // =========================================================
  // 밀어서 통화하기 (Slide to Answer)
  // =========================================================
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
      const maxSlide = rect.width - SLIDER_KNOB_PX;
      const slide = Math.max(
        0,
        Math.min(clientX - rect.left - SLIDER_GRAB_OFFSET_PX, maxSlide),
      );
      setSlideX(slide);

      if (slide >= maxSlide * SLIDE_ACCEPT_RATIO) {
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

  if (dismissed) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="보이스피싱 모의 통화 체험"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-2 sm:p-4 text-white backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* 우측 상단 건너뛰기 버튼 */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-5 top-5 z-40 flex items-center gap-1 rounded-full bg-zinc-800/80 px-3 py-1.5 text-[12px] font-medium text-zinc-300 backdrop-blur-md transition-colors hover:bg-zinc-700 hover:text-white"
      >
        <span>체험 건너뛰기</span>
        <X className="h-3.5 w-3.5" />
      </button>

      {/* 정통 최신 iPhone 하드웨어 섀시 (다이나믹 아일랜드 & 슬림 베젤 & 물리 버튼) */}
      <div className="relative z-10 my-auto flex items-center justify-center select-none py-4">
        
        {/* 좌측 물리 버튼 */}
        <div className="hidden sm:block absolute -left-[7px] top-24 h-7 w-[4px] rounded-l-[3px] bg-zinc-400 shadow-sm" />
        <div className="hidden sm:block absolute -left-[7px] top-36 h-12 w-[4px] rounded-l-[3px] bg-zinc-400 shadow-sm" />
        <div className="hidden sm:block absolute -left-[7px] top-52 h-12 w-[4px] rounded-l-[3px] bg-zinc-400 shadow-sm" />

        {/* 우측 물리 전원 버튼 */}
        <button
          type="button"
          onClick={mode === "ringing" ? handleDeclineCall : undefined}
          className="hidden sm:block absolute -right-[7px] top-36 h-16 w-[4px] rounded-r-[3px] bg-zinc-400 shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        />

        {/* 메인 iPhone 디스플레이 바디 (슬림 베젤, 50px 코너 라운드, 티타늄 테두리) */}
        <div className="relative flex h-[690px] w-[345px] flex-col overflow-hidden rounded-[50px] border-[5px] border-[#38393d] bg-[#1a1b22] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_25px_65px_-15px_rgba(0,0,0,0.95)] ring-1 ring-black">

          {/* 화면 최상단(상태바/다이나믹 아일랜드 뒤편)부터 최하단까지 가득 채우는 iOS 순정 월페이퍼 */}
          {mode !== "verdict" && (
            <div
              aria-hidden="true"
              className="absolute inset-0 z-0 pointer-events-none transition-all duration-700"
              style={{
                background:
                  mode === "call"
                    ? "radial-gradient(circle at 50% 20%, #155e75 0%, #0e3b4a 45%, #061c24 85%), linear-gradient(180deg, #0f404d 0%, #082933 50%, #03141a 100%)"
                    : "radial-gradient(ellipse at 50% 90%, rgba(200, 125, 75, 0.55) 0%, rgba(110, 70, 50, 0.4) 45%, rgba(40, 42, 54, 0.1) 80%), linear-gradient(180deg, #282a36 0%, #2b2e3c 35%, #353036 65%, #463428 100%)",
              }}
            />
          )}

          {/* ========================================================= */}
          {/* iOS 상단 상태 표시줄 & Dynamic Island                     */}
          {/* ========================================================= */}
          <div className="relative z-30 flex items-center justify-between px-6 pt-3 select-none text-white">
            {/* 좌측: 실시간 시각 + 위치 화살표 */}
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

            {/* 중앙: 최신 iPhone Dynamic Island (순정 알약 형태) */}
            <div className="absolute left-1/2 top-2 -translate-x-1/2 flex items-center justify-between rounded-full bg-black px-3 py-1 ring-1 ring-zinc-800 w-[96px] h-[28px]">
              <div className="mx-auto flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-900 border border-zinc-800/80" />
                <div className="h-2 w-2 rounded-full bg-zinc-900" />
              </div>
            </div>

            {/* 우측: 셀룰러 4바 + 5G + 정통 iOS 배터리 */}
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

          {/* ========================================================= */}
          {/* 1. 보이스피싱 전화 수신 화면 (Ringing - Slide to Answer)    */}
          {/* ========================================================= */}
          {mode === "ringing" && (
            <div className="relative z-10 flex flex-1 flex-col justify-between pt-6 pb-4 px-6 animate-in fade-in duration-200 select-none">
              {/* 상단 발신 정보 */}
              <div className="text-center pt-5">
                <h2 className="text-[33px] font-light tracking-[-0.015em] text-white font-sans leading-none">
                  070-5275-3828
                </h2>
                <p className="mt-2 text-[16px] font-normal text-zinc-300">
                  대한민국
                </p>
              </div>

              {/* 중간 여백 */}
              <div className="flex-1" />

              {/* 하단 기능 그룹: [나중에 보기] & [메시지] */}
              <div className="flex items-center justify-between px-10 mb-8 text-white">
                <div className="flex flex-col items-center gap-1.5 cursor-pointer opacity-95 hover:opacity-100 transition-opacity">
                  <AlarmFillIcon className="h-[23px] w-[23px] text-white" />
                  <span className="text-[13px] font-normal text-zinc-100">나중에 보기</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 cursor-pointer opacity-95 hover:opacity-100 transition-opacity">
                  <MessageFillIcon className="h-[23px] w-[23px] text-white" />
                  <span className="text-[13px] font-normal text-zinc-100">메시지</span>
                </div>
              </div>

              {/* 하단 [밀어서 통화하기] 슬라이더 캡슐 */}
              <div className="pb-2">
                <div
                  ref={sliderTrackRef}
                  className="relative flex h-[68px] w-full items-center rounded-full bg-white/20 p-1.5 backdrop-blur-2xl shadow-[inset_0_0_10px_rgba(255,255,255,0.06)] overflow-hidden select-none"
                >
                  <div className="absolute inset-0 flex items-center justify-center pl-8 pointer-events-none select-none">
                    <span className="text-[16px] font-normal tracking-tight text-[#2d241d]/90">
                      밀어서 통화하기
                    </span>
                  </div>

                  <div
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

          {/* ========================================================= */}
          {/* 2. 거절 시 화면: 최신 iOS 잠금화면 + 영장 위협 푸시 알림    */}
          {/* ========================================================= */}
          {mode === "declined" && (
            <div className="relative z-10 flex flex-1 flex-col justify-between py-4 px-5 animate-in fade-in duration-200">
              <div>
                {/* 상단 잠금 아이콘 & 시계 */}
                <div className="flex flex-col items-center pt-2 text-center">
                  <Lock className="h-3.5 w-3.5 text-zinc-400 mb-1" />
                  <p className="text-xs text-zinc-300 font-medium">{currentDateStr}</p>
                  <span className="text-6xl font-light tracking-tight text-white font-sans mt-0.5 tabular-nums">
                    {currentTime}
                  </span>
                </div>

                {/* iOS 메시지 푸시 알림 배너 */}
                <div
                  onClick={handleAcceptCall}
                  className="mt-6 cursor-pointer rounded-[22px] bg-zinc-800/85 p-3.5 border border-white/10 shadow-2xl backdrop-blur-xl transition-all hover:bg-zinc-800 active:scale-[0.98]"
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
                    070-5275-3828
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-200">
                    <strong className="text-rose-400 font-medium">[서울중앙지검]</strong> 귀하의 고의적 전화 불응으로 인하여 긴급 체포영장 청구 및 자산 동결 심의가 착수됩니다. (사건번호 2026-형제-4892호)
                  </p>
                  <p className="mt-2 text-[10px] text-right font-medium text-[#34C759]">
                    탭하여 통화 확인하기 →
                  </p>
                </div>

                {/* 현실적 해설 안내 */}
                <div className="mt-5 rounded-2xl bg-zinc-900/60 p-3.5 border border-white/5 text-left text-xs leading-relaxed text-zinc-400">
                  <p className="text-zinc-200 font-semibold mb-1 text-[11px]">전화를 끊어도 끝이 아닙니다</p>
                  실제 피싱 조직은 통화가 끊기면 즉시 위조 영장 문자를 발송합니다.
                  불안해진 피해자의 70% 이상이 이 문자를 보고 직접 다시 전화를 걸어 덫에 빠집니다.
                </div>
              </div>

              {/* 하단 손전등 / 카메라 원형 버튼 */}
              <div className="flex items-center justify-between px-3 pb-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md border border-white/10 text-white">
                  <Flashlight className="h-5 w-5" />
                </div>
                <button
                  type="button"
                  onClick={handleAcceptCall}
                  className="text-xs text-zinc-400 underline hover:text-white"
                >
                  통화 화면으로 이동
                </button>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md border border-white/10 text-white">
                  <Camera className="h-5 w-5" />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. 실전 3단계 통화 화면 (보내주신 스크린샷 100% 동일 구현) */}
          {/* ========================================================= */}
          {mode === "call" && (
            <div className="relative z-10 flex flex-1 flex-col justify-between pt-6 pb-2 px-3 animate-in fade-in duration-300 select-none">
              
              {/* 상단: 통화 경과 시간 & 전화번호 (Dynamic Island 아래 여유로운 여백 pt-7) */}
              <div className="text-center pt-7 pb-1">
                <p className="text-[16px] font-normal tracking-tight text-white/85 font-sans tabular-nums">
                  {formatCallDuration(callDuration)}
                </p>
                <h2 className="text-[26px] font-medium tracking-tight text-white font-sans mt-1 leading-none">
                  070-5275-3828
                </h2>
              </div>

              {/* 중앙: 실시간 통화 음성 말풍선 & 나의 대답 선택 */}
              <div className="my-auto py-1 space-y-3">
                {/* 피싱범(수사관) 실시간 전사 말풍선 */}
                <TypedScript
                  key={currentStage}
                  script={currentStageConfig.script}
                />

                {/* 나의 대답 선택지 */}
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

              {/* 하단: 스크린샷 100% 동일 순정 6버튼 그리드 (Apple 순정 SF Symbols & 한국어 라벨) */}
              <div className="pt-1 pb-1">
                <div className="grid grid-cols-3 gap-y-3 px-3 text-white text-center font-sans">
                  {/* 1행 1열: 스피커 (Speaker: 흰색 원형 + 검은 스피커와 둥근 음파 2개) */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsSpeaker((p) => !p)}
                      className={`h-[56px] w-[56px] rounded-full flex items-center justify-center transition-all shadow-md ${
                        isSpeaker
                          ? "bg-white text-black shadow-lg"
                          : "bg-white/[0.18] hover:bg-white/[0.25] text-white backdrop-blur-xl border border-white/10"
                      }`}
                    >
                      <SpeakerWave3FillIcon className="h-[26px] w-[26px]" />
                    </button>
                    <span className="text-[12px] font-normal text-white/90">스피커</span>
                  </div>

                  {/* 1행 2열: FaceTime */}
                  <div className="flex flex-col items-center gap-1.5 opacity-60">
                    <div className="h-[56px] w-[56px] rounded-full bg-white/[0.18] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white">
                      <VideoFillIcon className="h-[25px] w-[25px]" />
                    </div>
                    <span className="text-[12px] font-normal text-white/80">FaceTime</span>
                  </div>

                  {/* 1행 3열: 소리 끔 (Mute) */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsMuted((p) => !p)}
                      className={`h-[56px] w-[56px] rounded-full flex items-center justify-center transition-all shadow-md ${
                        isMuted
                          ? "bg-white text-black shadow-lg"
                          : "bg-white/[0.18] hover:bg-white/[0.25] text-white backdrop-blur-xl border border-white/10"
                      }`}
                    >
                      <MicSlashFillIcon className="h-[26px] w-[26px]" />
                    </button>
                    <span className="text-[12px] font-normal text-white/90">소리 끔</span>
                  </div>

                  {/* 2행 1열: 더 보기 (More) */}
                  <div className="flex flex-col items-center gap-1.5 opacity-80">
                    <div className="h-[56px] w-[56px] rounded-full bg-white/[0.18] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white cursor-pointer">
                      <EllipsisIcon className="h-[26px] w-[26px]" />
                    </div>
                    <span className="text-[12px] font-normal text-white/80">더 보기</span>
                  </div>

                  {/* 2행 2열: 종료 (End) */}
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

                  {/* 2행 3열: 키패드 (Keypad) */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="h-[56px] w-[56px] rounded-full bg-white/[0.18] hover:bg-white/[0.25] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white cursor-pointer">
                      <KeypadIcon className="h-[26px] w-[26px]" />
                    </div>
                    <span className="text-[12px] font-normal text-white/90">키패드</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* 4. 통화 종료 후 최근 통화 & 경각심 분석 리포트             */}
          {/* ========================================================= */}
          {mode === "verdict" && (
            <div className="relative z-10 flex flex-1 flex-col justify-between py-2 px-3 animate-in fade-in duration-200 text-left bg-zinc-950 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="pt-1">
                {/* 상단 최근 통화 헤더 */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-[#FF3B30]">
                      070-5275-3828
                    </p>
                    <p className="text-[11px] text-zinc-400">대한민국 · 발신 종료</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">방금 전</span>
                    <Info className="h-4 w-4 text-[#007AFF]" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  방금 나눈 대화,
                  <br />
                  남의 일처럼 느껴지셨나요?
                </h3>

                <div className="mt-3 rounded-2xl bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800/80 text-xs text-zinc-300">
                  <div className="p-3">
                    <p className="font-semibold text-white text-[12px] mb-1">
                      실제 피싱 조직 3단계 각본의 실체
                    </p>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      사건 연루를 통보해 공포를 준 뒤, 위조된 가짜 포털 영장을 확인시키고, 결국 보안 앱 설치나 자산 진술을 받아냅니다.
                    </p>
                  </div>

                  <div className="p-3">
                    <p className="font-semibold text-[#FF3B30] text-[12px] mb-1">
                      &lsquo;직접 1301로 걸어보라&rsquo;고 당당한 이유
                    </p>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      악성 앱이 설치되는 순간 스마트폰이 해킹되어, 이후 112나 1301 어디로 전화를 걸든 피싱 콜센터로 통화가 강제 가로채기됩니다.
                    </p>
                  </div>

                  <div className="p-3">
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      기관사칭 피해자의 70% 이상이 20·30대입니다. 글이나 퀴즈로 볼 때와, 일상 중에 갑자기 울리는 전화는 심장 박동부터 다릅니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 하단 iOS 스타일 액션 버튼 */}
              <div className="space-y-2 pt-3 pb-2">
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

          {/* ========================================================= */}
          {/* iOS 정통 홈 인디케이터 (Home Bar)                          */}
          {/* ========================================================= */}
          <div className="relative z-30 pt-1 pb-1 select-none">
            <div className="mx-auto h-[4px] w-32 rounded-full bg-white/70" />
          </div>

        </div>
      </div>
    </div>
  );
}
