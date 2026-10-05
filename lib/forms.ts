import { z } from "zod";

/** 입력 중인 휴대전화번호를 010-0000-0000 꼴로 보여 준다. */
export function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/** 하이픈을 지운 11자리 숫자로 변환해서 넘긴다. */
export const phoneNumberSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .refine((value) => /^010\d{8}$/.test(value), {
    message: "010으로 시작하는 휴대전화번호 11자리를 입력해 주세요.",
  });

const PASSWORD_RULE = "비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.";

/** 가입·비밀번호 변경용. 로그인은 서버가 판정하므로 길이만 본다. */
export const newPasswordSchema = z
  .string()
  .min(8, PASSWORD_RULE)
  .max(128, "비밀번호가 너무 깁니다.")
  .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), {
    message: PASSWORD_RULE,
  });

export const loginPasswordSchema = z
  .string()
  .min(8, "비밀번호는 8자 이상이어야 합니다.")
  .max(128, "비밀번호가 너무 깁니다.");
