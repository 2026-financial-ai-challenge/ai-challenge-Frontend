import { RootShell } from "@/components/layout/RootShell";
import { AppProviders } from "@/components/providers/AppProviders";
import { isPortalHost } from "@/lib/portal-host";
import type { Metadata } from "next";
import { Barlow_Condensed, Noto_Sans_KR } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

/**
 * 랜딩 인트로의 잠금화면 시계 전용. 실제 기기 시계는 숫자가 세로로 길어서
 * 본문 폰트로는 흉내가 안 나고, 폰트를 늘리면 획 비율이 깨져 못생겨진다.
 * 처음부터 길쭉하게 그려진 서체를 쓴다. 숫자와 콜론만 필요하다.
 */
const lockClock = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["200"],
  display: "swap",
  variable: "--font-lock-clock",
});

export const metadata: Metadata = {
  title: {
    default: "안심피싱",
    template: "%s · 안심피싱",
  },
  description:
    "AI 기반 보이스피싱 실전 대응훈련. 실제 전화로 보이스피싱 시뮬레이션과 불시 보이스피싱 훈련을 진행하고 결과를 비교합니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = (await headers()).get("host") ?? "";

  return (
    <html lang="ko">
      <body
        className={`${notoSansKr.variable} ${lockClock.variable} bg-background-muted font-sans text-text-primary antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-text-primary"
        >
          본문으로 건너뛰기
        </a>
        <AppProviders>
          <RootShell isPortal={isPortalHost(host)}>{children}</RootShell>
        </AppProviders>
      </body>
    </html>
  );
}
