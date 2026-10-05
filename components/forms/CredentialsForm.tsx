"use client";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  formatPhoneInput,
  loginPasswordSchema,
  phoneNumberSchema,
} from "@/lib/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const credentialsSchema = z.object({
  phoneNumber: phoneNumberSchema,
  password: loginPasswordSchema,
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
      phoneNumber: formatPhoneInput(defaultPhoneNumber),
      password: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit(values.phoneNumber, values.password),
      )}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="phoneNumber" className="text-text-primary">
          휴대전화번호
        </Label>
        <p className="mt-1 text-base text-text-secondary">{phoneDescription}</p>
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
        <FormError
          id="password-error"
          message={errors.password?.message}
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
