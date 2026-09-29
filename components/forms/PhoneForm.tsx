"use client";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhoneInput, phoneNumberSchema } from "@/lib/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const phoneSchema = z.object({ phoneNumber: phoneNumberSchema });

type PhoneFormValues = z.infer<typeof phoneSchema>;

type PhoneFormProps = {
  onSubmit: (phoneNumber: string) => Promise<void> | void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  defaultPhoneNumber?: string;
  description?: string;
  submitLabel?: string;
  submittingLabel?: string;
};

export function PhoneForm({
  onSubmit,
  isSubmitting = false,
  errorMessage,
  defaultPhoneNumber = "",
  description = "훈련 전화를 받을 번호입니다. 이 폰에서 인증코드를 보내 본인 번호인지 확인한 뒤에만 등록됩니다.",
  submitLabel = "인증 시작",
  submittingLabel = "인증 준비 중...",
}: PhoneFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: formatPhoneInput(defaultPhoneNumber) },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values.phoneNumber))}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="phoneNumber" className="text-text-primary">
          휴대전화번호
        </Label>
        <p className="mt-1 text-base text-text-secondary">{description}</p>
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
        <FormError
          id="phone-error"
          message={errors.phoneNumber?.message}
          className="mt-2"
        />
      </div>

      <FormError message={errorMessage} />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}
