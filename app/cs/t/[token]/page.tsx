import { WebTrainingFlow } from "@/components/portal/training/WebTrainingFlow";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  referrer: "no-referrer",
};

export default async function WebTrainingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <Suspense>
      <WebTrainingFlow token={token} />
    </Suspense>
  );
}
