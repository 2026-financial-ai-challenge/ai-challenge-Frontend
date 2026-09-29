"use client";

import React from "react";

interface IconProps {
  className?: string;
}

/** iOS phone.fill — 꽉 찬 수화기. 기본 각도가 수신(통화하기)이다. */
const HANDSET_PATH =
  "M9.36 4.21c-.5-1.02-1.72-1.45-2.74-.95l-2.2 1.08C3.2 4.96 2.55 6.3 2.84 7.6c.82 3.6 2.66 6.9 5.32 9.56 2.66 2.66 5.96 4.5 9.56 5.32 1.3.29 2.64-.36 3.26-1.58l1.08-2.2c.5-1.02.07-2.24-.95-2.74l-3.2-1.6c-.94-.47-2.08-.2-2.7.64l-.92 1.24a15.3 15.3 0 0 1-2.31-1.82 15.3 15.3 0 0 1-1.82-2.31l1.24-.92c.84-.62 1.11-1.76.64-2.7l-1.68-3.28z";

function PhoneHandset({ className, rotate = 0 }: IconProps & { rotate?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d={HANDSET_PATH}
        fill="currentColor"
        transform={rotate ? `rotate(${rotate} 12 12)` : undefined}
      />
    </svg>
  );
}

/** 슬라이더 수신 아이콘 — 수화기를 세운 기본 각도 */
export function PhoneFillIcon({ className }: IconProps) {
  return <PhoneHandset className={className} />;
}

/** 통화 종료 아이콘 — iOS phone.down.fill과 같이 135° 기울인다. */
export function PhoneDownFillIcon({ className }: IconProps) {
  return <PhoneHandset className={className} rotate={135} />;
}

/** mic.slash.fill */
export function MicSlashFillIcon({ className }: IconProps) {
  // useId()는 콜론을 포함하므로 SVG 프래그먼트 참조용으로 제거한다.
  const maskId = `mic-slash-${React.useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" />
        <line x1="4.4" y1="3" x2="20.4" y2="20.4" stroke="black" strokeWidth="3.6" strokeLinecap="round" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <rect x="9.4" y="2.4" width="5.2" height="10.6" rx="2.6" fill="currentColor" />
        <path d="M6.4 11a5.6 5.6 0 0 0 11.2 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="16.6" x2="12" y2="20.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <line x1="5.1" y1="3.7" x2="19.7" y2="19.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** speaker.wave.3.fill */
export function SpeakerWave3FillIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M11.9 5a1 1 0 0 0-1.67-.74L6.3 7.7H3.7A1.7 1.7 0 0 0 2 9.4v5.2a1.7 1.7 0 0 0 1.7 1.7h2.6l3.93 3.44A1 1 0 0 0 11.9 19V5z"
        fill="currentColor"
      />
      <path d="M14.4 9.6a3.4 3.4 0 0 1 0 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 7.3a6.7 6.7 0 0 1 0 9.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M19.6 5a10 10 0 0 1 0 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** video.fill */
export function VideoFillIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M16 10.5 21.22 7.07A.5.5 0 0 1 22 7.5v9a.5.5 0 0 1-.78.43L16 13.5v-3z" />
    </svg>
  );
}

/** ellipsis */
export function EllipsisIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="7.1" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="16.9" cy="12" r="1.5" />
    </svg>
  );
}

/** circle.grid.3x3.fill */
export function KeypadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="7.4" cy="7.4" r="1.85" />
      <circle cx="12" cy="7.4" r="1.85" />
      <circle cx="16.6" cy="7.4" r="1.85" />
      <circle cx="7.4" cy="12" r="1.85" />
      <circle cx="12" cy="12" r="1.85" />
      <circle cx="16.6" cy="12" r="1.85" />
      <circle cx="7.4" cy="16.6" r="1.85" />
      <circle cx="12" cy="16.6" r="1.85" />
      <circle cx="16.6" cy="16.6" r="1.85" />
    </svg>
  );
}

/** alarm.fill */
export function AlarmFillIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <rect x="2" y="2.7" width="4.8" height="2.7" rx="1.35" transform="rotate(-38 4.4 4.05)" />
      <rect x="17.2" y="2.7" width="4.8" height="2.7" rx="1.35" transform="rotate(38 19.6 4.05)" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4.6a7.9 7.9 0 1 0 0 15.8 7.9 7.9 0 0 0 0-15.8zm.9 3.2v3.9h2.6a.9.9 0 0 1 0 1.8h-3.5a.9.9 0 0 1-.9-.9V7.8a.9.9 0 0 1 1.8 0z"
      />
    </svg>
  );
}

/** message.fill */
export function MessageFillIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 3c-5.13 0-9.3 3.44-9.3 7.68 0 2.4 1.34 4.55 3.44 5.96-.24 1.4-1.03 2.72-2.2 3.63a.44.44 0 0 0 .3.78c2.3-.1 4.22-.95 5.6-2.02.7.1 1.43.16 2.16.16 5.13 0 9.3-3.45 9.3-7.68C21.3 6.43 17.13 3 12 3z" />
    </svg>
  );
}
