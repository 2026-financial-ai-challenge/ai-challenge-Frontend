import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "대시보드",
  description: "내 훈련 진행 상황을 확인하고 다음 훈련을 시작합니다.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
