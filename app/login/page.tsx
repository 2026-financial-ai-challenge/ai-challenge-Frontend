"use client";

import { BrandImage } from "@/components/brand/BrandImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/lib/stores/auth-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async () => {
    setPending(true); setError(null);
    try {
      const response = await api.login(phoneNumber.replace(/\D/g, ""), password);
      setAuth(response.accessToken, response.participant.phoneNumberMasked);
      router.replace("/consent");
    } catch (e) { setError(apiErrorMessage(e)); } finally { setPending(false); }
  };
  return <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
    <BrandImage name="phone" alt="" className="h-16 w-16" />
    <h1 className="mt-2 text-2xl font-bold text-navy-900">로그인</h1>
    <p className="mt-3 text-sm text-navy-600">가입한 휴대전화번호와 비밀번호를 입력해 주세요.</p>
    <Card className="mt-8 space-y-5 p-6">
      <div><Label htmlFor="login-phone">휴대전화번호</Label><Input id="login-phone" className="mt-2" type="tel" autoComplete="username" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></div>
      <div><Label htmlFor="login-password">비밀번호</Label><Input id="login-password" className="mt-2" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void submit(); }} /></div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button className="w-full" disabled={pending} onClick={() => void submit()}>{pending ? "로그인 중..." : "로그인"}</Button>
      <p className="text-center text-sm text-navy-600">아직 계정이 없나요? <Link className="font-semibold text-brand-600" href="/register">회원가입</Link></p>
    </Card>
  </div>;
}
