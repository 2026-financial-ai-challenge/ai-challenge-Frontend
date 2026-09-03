"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const credentialsSchema = z.object({
  phoneNumber: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => /^010\d{8}$/.test(value), {
      message: "010으로 시작하는 휴대전화번호 11자리를 입력해 주세요.",
    }),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(128, "비밀번호가 너무 깁니다."),
});

type CredentialsFormValues = z.infer<typeof credentialsSchema>;

type CredentialsFormProps = {
  onSubmit: (phoneNumber: string, password: string) => Promise<void> | void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  defaultPhoneNumber?: string;
  submitLabel: string;
  submittingLabel: string;
  phoneDescription: string;
  passwordAutoComplete: "current-password" | "new-password";
};

function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function CredentialsForm({
  onSubmit,
  isSubmitting = false,
  errorMessage,
  defaultPhoneNumber = "",
  submitLabel,
  submittingLabel,
  phoneDescription,
  passwordAutoComplete,
}: CredentialsFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      phoneNumber: defaultPhoneNumber
        ? formatPhoneInput(defaultPhoneNumber)
        : "",
      password: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values.phoneNumber, values.password))}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="phoneNumber" className="text-text-primary">
          휴대전화번호
        </Label>
        <p className="mt-1 text-sm text-text-secondary">{phoneDescription}</p>
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

      <div>
        <Label htmlFor="password" className="text-text-primary">
          비밀번호
        </Label>
        <PasswordInput
          id="password"
          autoComplete={passwordAutoComplete}
          placeholder="8자 이상"
          className="mt-3"
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password ? (
          <p id="password-error" className="mt-2 text-sm text-destructive">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}
