"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => /^01[016789]\d{7,8}$/.test(value), {
      message: "휴대전화번호 11자리(또는 10자리)를 입력해 주세요.",
    }),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

type PhoneFormProps = {
  onSubmit: (phoneNumber: string) => Promise<void> | void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function PhoneForm({
  onSubmit,
  isSubmitting = false,
  errorMessage,
}: PhoneFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values.phoneNumber))}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="phoneNumber" className="text-navy-800">
          휴대전화번호
        </Label>
        <p className="mt-1 text-sm text-muted-foreground">
          훈련 전화를 받을 번호만 입력합니다. 다른 개인정보는 받지 않습니다.
        </p>
        <Input
          id="phoneNumber"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="010-0000-0000"
          className="mt-3"
          aria-invalid={errors.phoneNumber ? "true" : "false"}
          aria-describedby={errors.phoneNumber ? "phone-error" : undefined}
          {...register("phoneNumber", {
            onChange: (event) => {
              setValue("phoneNumber", formatPhoneInput(event.target.value), {
                shouldValidate: false,
              });
            },
          })}
        />
        {errors.phoneNumber ? (
          <p id="phone-error" className="mt-2 text-sm text-destructive">
            {errors.phoneNumber.message}
          </p>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "요청 중..." : "보이스피싱 시뮬레이션 시작"}
      </Button>
    </form>
  );
}
