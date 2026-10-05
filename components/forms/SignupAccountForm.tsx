"use client";

import {
  ConsentFields,
  consentFieldSchema,
} from "@/components/forms/ConsentFields";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { newPasswordSchema } from "@/lib/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const signupAccountSchema = consentFieldSchema.extend({
  password: newPasswordSchema,
});

type SignupAccountValues = z.infer<typeof signupAccountSchema>;

type SignupAccountFormProps = {
  onSubmit: (values: SignupAccountValues) => Promise<void> | void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

export function SignupAccountForm({
  onSubmit,
  isSubmitting = false,
  errorMessage,
}: SignupAccountFormProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupAccountValues>({
    resolver: zodResolver(signupAccountSchema),
    defaultValues: {
      password: "",
      privacy: false,
      unannouncedTraining: false,
    },
  });

  const privacy = useWatch({ control, name: "privacy" });
  const unannouncedTraining = useWatch({ control, name: "unannouncedTraining" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="password" className="text-text-primary">
          비밀번호
        </Label>
        <p className="mt-1 text-base text-text-secondary">
          영문과 숫자를 포함해 8자 이상으로 입력해 주세요.
        </p>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          autoFocus
          placeholder="8자 이상, 영문+숫자"
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

      <ConsentFields
        privacy={privacy}
        unannouncedTraining={unannouncedTraining}
        onPrivacyChange={(value) =>
          setValue("privacy", value, { shouldValidate: true, shouldTouch: true })
        }
        onUnannouncedChange={(value) =>
          setValue("unannouncedTraining", value, {
            shouldValidate: true,
            shouldTouch: true,
          })
        }
        privacyError={errors.privacy?.message}
        unannouncedError={errors.unannouncedTraining?.message}
      />

      <FormError message={errorMessage} />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "가입하는 중..." : "동의하고 가입하기"}
      </Button>
    </form>
  );
}
