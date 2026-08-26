"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = "phone" | "code" | "password";

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [masked, setMasked] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = async () => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (!/^010\d{8}$/.test(digits)) return setError("010으로 시작하는 휴대전화번호 11자리를 입력해 주세요.");
    setPending(true); setError(null);
    try {
      const response = await api.requestSignupOtp(digits);
      setPhoneNumber(digits); setMasked(response.phoneNumberMasked);
      setDevCode(response.devCode ?? null); setStep("code");
    } catch (e) { setError(apiErrorMessage(e)); } finally { setPending(false); }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(code)) return setError("6자리 인증번호를 입력해 주세요.");
    setPending(true); setError(null);
    try {
      const response = await api.verifySignupOtp(phoneNumber, code);
      setVerificationToken(response.verificationToken); setStep("password");
    } catch (e) { setError(apiErrorMessage(e)); } finally { setPending(false); }
  };

  const completeSignup = async () => {
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return setError("비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.");
    if (password !== passwordConfirm) return setError("비밀번호가 일치하지 않습니다.");
    setPending(true); setError(null);
    try {
      const response = await api.signup(verificationToken, password);
      setAuth(response.accessToken, response.participant.phoneNumberMasked);
      router.replace("/consent");
    } catch (e) { setError(apiErrorMessage(e)); } finally { setPending(false); }
  };

  return <div className="space-y-5">
    {step === "phone" ? <><div><Label htmlFor="signup-phone">휴대전화번호</Label><Input id="signup-phone" className="mt-2" type="tel" inputMode="numeric" autoComplete="tel" placeholder="010-0000-0000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></div><Button className="w-full" disabled={pending} onClick={() => void requestOtp()}>{pending ? "발송 중..." : "인증번호 받기"}</Button></> : null}
    {step === "code" ? <><p className="text-sm text-navy-600"><b>{masked}</b>로 발송된 6자리 인증번호를 입력해 주세요.</p>{devCode ? <p className="rounded-lg bg-brand-50 p-3 text-sm text-navy-700">개발용 인증번호: <b>{devCode}</b></p> : null}<div><Label htmlFor="signup-code">인증번호</Label><Input id="signup-code" className="mt-2" inputMode="numeric" maxLength={6} autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} /></div><Button className="w-full" disabled={pending} onClick={() => void verifyOtp()}>{pending ? "확인 중..." : "인증하기"}</Button><Button variant="ghost" className="w-full" onClick={() => { setStep("phone"); setCode(""); setError(null); }}>전화번호 변경</Button></> : null}
    {step === "password" ? <><p className="text-sm text-navy-600">전화번호 인증이 완료되었습니다. 로그인에 사용할 비밀번호를 설정해 주세요.</p><div><Label htmlFor="signup-password">비밀번호</Label><Input id="signup-password" className="mt-2" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /><p className="mt-1 text-xs text-muted-foreground">영문과 숫자를 포함한 8자 이상</p></div><div><Label htmlFor="signup-password-confirm">비밀번호 확인</Label><Input id="signup-password-confirm" className="mt-2" type="password" autoComplete="new-password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} /></div><Button className="w-full" disabled={pending} onClick={() => void completeSignup()}>{pending ? "가입 중..." : "회원가입 완료"}</Button></> : null}
    {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
  </div>;
}
