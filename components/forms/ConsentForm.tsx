"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSubmitConsentMutation } from "@/hooks/use-training-queries";
import { apiErrorMessage } from "@/lib/errors";
import { useSessionStore } from "@/lib/stores/session-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const consentSchema = z.object({
  privacy: z.boolean().refine((value) => value === true, {
    message: "개인정보 수집·이용에 동의해 주세요.",
  }),
  unannouncedTraining: z.boolean().refine((value) => value === true, {
    message: "불시 보이스피싱 훈련 전화 수신에 동의해 주세요.",
  }),
});

type ConsentFormValues = z.infer<typeof consentSchema>;

export function ConsentForm() {
  const router = useRouter();
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const consentMutation = useSubmitConsentMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsentFormValues>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      privacy: false,
      unannouncedTraining: false,
    },
  });

  const onSubmit = async (values: ConsentFormValues) => {
    try {
      const { sessionId } = await consentMutation.mutateAsync({
        privacy: values.privacy,
        unannouncedTraining: values.unannouncedTraining,
      });
      setSessionId(sessionId);
      router.push("/register");
    } catch {
      // error is read from mutation state
    }
  };

  const submitError = apiErrorMessage(
    consentMutation.error,
    consentMutation.isError
      ? "동의 저장에 실패했습니다. 잠시 후 다시 시도해 주세요."
      : undefined,
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Card className="p-5">
        <fieldset>
          <legend className="px-1 text-sm font-semibold text-navy-900">
            개인정보 수집·이용 동의
            <span className="ml-1.5 font-medium text-destructive">필수</span>
          </legend>
          <div className="mt-3 space-y-2 text-sm leading-6 text-navy-600">
            <p>
              훈련 전화를 걸기 위해 휴대전화번호만 수집합니다. 이름, 주민등록번호,
              계좌번호 등 다른 개인정보는 받지 않습니다.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>수집 항목: 휴대전화번호</li>
              <li>이용 목적: 보이스피싱 대응 훈련 통화 발신 및 결과 안내</li>
              <li>보유 기간: 훈련 종료 후 30일 (이후 파기)</li>
              <li>동의를 거부할 수 있으나, 이 경우 서비스 이용이 불가합니다</li>
            </ul>
          </div>
          <Controller
            name="privacy"
            control={control}
            render={({ field }) => (
              <div className="mt-4 flex items-start gap-2.5">
                <Checkbox
                  id="privacy"
                  className="mt-0.5"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  aria-invalid={errors.privacy ? "true" : "false"}
                  aria-describedby={errors.privacy ? "privacy-error" : undefined}
                />
                <Label
                  htmlFor="privacy"
                  className="cursor-pointer leading-5 text-navy-800"
                >
                  위 내용을 확인했으며, 개인정보 수집·이용에 동의합니다.
                </Label>
              </div>
            )}
          />
          {errors.privacy ? (
            <p id="privacy-error" className="mt-2 text-sm text-destructive">
              {errors.privacy.message}
            </p>
          ) : null}
        </fieldset>
      </Card>

      <Card className="p-5">
        <fieldset>
          <legend className="px-1 text-sm font-semibold text-navy-900">
            불시 보이스피싱 훈련 수신 동의
            <span className="ml-1.5 font-medium text-destructive">필수</span>
          </legend>
          <div className="mt-3 space-y-2 text-sm leading-6 text-navy-600">
            <p>
              보이스피싱 시뮬레이션 이후, 별도의 사전 알림 없이 불시 보이스피싱
              훈련 전화가 한 차례 더 걸릴 수 있습니다. 발신 시점과 시간대는 훈련
              효과를 위해 공개하지 않습니다.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>이 전화는 수사기관·금융기관의 실제 업무 전화가 아닙니다</li>
              <li>금전 이체나 추가 개인정보 입력을 실제로 요구하지 않습니다</li>
              <li>훈련 중에도 언제든 통화를 종료할 수 있습니다</li>
            </ul>
          </div>
          <Controller
            name="unannouncedTraining"
            control={control}
            render={({ field }) => (
              <div className="mt-4 flex items-start gap-2.5">
                <Checkbox
                  id="unannouncedTraining"
                  className="mt-0.5"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  aria-invalid={errors.unannouncedTraining ? "true" : "false"}
                  aria-describedby={
                    errors.unannouncedTraining ? "unannounced-error" : undefined
                  }
                />
                <Label
                  htmlFor="unannouncedTraining"
                  className="cursor-pointer leading-5 text-navy-800"
                >
                  불시 보이스피싱 훈련 전화를 수신하는 데 동의합니다.
                </Label>
              </div>
            )}
          />
          {errors.unannouncedTraining ? (
            <p id="unannounced-error" className="mt-2 text-sm text-destructive">
              {errors.unannouncedTraining.message}
            </p>
          ) : null}
        </fieldset>
      </Card>

      {submitError ? (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={consentMutation.isPending}>
        {consentMutation.isPending ? "저장 중..." : "동의하고 계속하기"}
      </Button>
    </form>
  );
}
