import type { Metadata } from "next";
import { SessionFlowView } from "@/components/status/SessionFlowView";

export const metadata: Metadata = {
  title: "훈련 리포트",
  description: "보이스피싱 시뮬레이션 통화의 1차·최종 리포트를 확인합니다.",
};

export default function ReportPage() {
  return <SessionFlowView />;
}
