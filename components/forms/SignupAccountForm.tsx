"use client";

import { ConsentFields, consentFieldSchema } from "@/components/forms/ConsentFields";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signupAccountSchema = consentFieldSchema.extend({
  password: z
    .string()
    .min(8, "비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.")
    .max(128, "비밀번호가 너무 깁니다.")
    .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), {
      message: "비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.",
    }),
});

type SignupAccountValues = z.infer<typeof signupAccountSchema>;

type SignupAccountFormProps = {
  onSubmit: (values: {
    password: string;
    privacy: boolean;
    unannouncedTraining: boolean;
  }) => Promise<void> | void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

export function SignupAccountForm({
  onSubmit,
  isSubmitting = false,
  errorMessage,
}: SignupAccountFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupAccountValues>({
    resolver: zodResolver(signupAccountSchema),
    defaultValues: {
      password: "",
      privacy: false,
      unannouncedTraining: false,
    },
  });

  const privacy = watch("privacy");
  const unannouncedTraining = watch("unannouncedTraining");

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({
          password: values.password,
          privacy: values.privacy,
          unannouncedTraining: values.unannouncedTraining,
        }),
      )}
      className="space-y-5"
    >
      <div>
        <Label htmlFor="password" className="text-text-primary">
          비밀번호
        </Label>
        <p className="mt-1 text-sm text-text-secondary">
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
        {errors.password ? (
          <p id="password-error" className="mt-2 text-sm text-destructive">
            {errors.password.message}
          </p>
        ) : null}
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

      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "가입하는 중..." : "동의하고 가입하기"}
      </Button>
    </form>
  );
}
