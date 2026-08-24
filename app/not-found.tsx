import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <h1 className="text-2xl font-bold text-navy-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-sm text-navy-600">
        주소가 올바른지 확인하거나 처음으로 돌아가 주세요.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">홈으로</Link>
      </Button>
    </div>
  );
}
