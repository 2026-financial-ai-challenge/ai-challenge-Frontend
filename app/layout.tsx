import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: {
    default: "안심피싱",
    template: "%s · 안심피싱",
  },
  description:
    "AI 기반 보이스피싱 실전 대응훈련. 실제 전화로 보이스피싱 시뮬레이션과 불시 보이스피싱 훈련을 진행하고 결과를 비교합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKr.variable} bg-background-muted font-sans text-text-primary antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-text-primary"
        >
          본문으로 건너뛰기
        </a>
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div id="main" className="flex-1">
              {children}
            </div>
            <SiteFooter />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
