"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { z } from "zod";

export const consentFieldSchema = z.object({
  privacy: z.boolean().refine((value) => value === true, {
    message: "개인정보 수집·이용에 동의해 주세요.",
  }),
  unannouncedTraining: z.boolean().refine((value) => value === true, {
    message: "불시 보이스피싱 훈련 전화 수신에 동의해 주세요.",
  }),
});

export type ConsentFieldValues = z.infer<typeof consentFieldSchema>;

type ConsentFieldsProps = {
  privacy: boolean;
  unannouncedTraining: boolean;
  onPrivacyChange: (value: boolean) => void;
  onUnannouncedChange: (value: boolean) => void;
  privacyError?: string;
  unannouncedError?: string;
};

export function ConsentFields({
  privacy,
  unannouncedTraining,
  onPrivacyChange,
  onUnannouncedChange,
  privacyError,
  unannouncedError,
}: ConsentFieldsProps) {
  return (
    <>
      <Card className="p-5">
        <fieldset>
          <legend className="px-1 text-sm font-semibold text-text-primary">
            개인정보 수집·이용 동의
            <span className="ml-1.5 font-medium text-destructive">필수</span>
          </legend>
          <div className="mt-3 space-y-2 text-sm leading-6 text-text-primary">
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
          <div className="mt-4 flex items-start gap-2.5">
            <Checkbox
              id="privacy"
              className="mt-0.5"
              checked={privacy}
              onCheckedChange={(checked) => onPrivacyChange(checked === true)}
              aria-invalid={privacyError ? "true" : "false"}
              aria-describedby={privacyError ? "privacy-error" : undefined}
            />
            <Label
              htmlFor="privacy"
              className="cursor-pointer leading-5 text-text-primary"
            >
              위 내용을 확인했으며, 개인정보 수집·이용에 동의합니다.
            </Label>
          </div>
          {privacyError ? (
            <p id="privacy-error" className="mt-2 text-sm text-destructive">
              {privacyError}
            </p>
          ) : null}
        </fieldset>
      </Card>

      <Card className="p-5">
        <fieldset>
          <legend className="px-1 text-sm font-semibold text-text-primary">
            불시 보이스피싱 훈련 수신 동의
            <span className="ml-1.5 font-medium text-destructive">필수</span>
          </legend>
          <div className="mt-3 space-y-2 text-sm leading-6 text-text-primary">
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
          <div className="mt-4 flex items-start gap-2.5">
            <Checkbox
              id="unannouncedTraining"
              className="mt-0.5"
              checked={unannouncedTraining}
              onCheckedChange={(checked) => onUnannouncedChange(checked === true)}
              aria-invalid={unannouncedError ? "true" : "false"}
              aria-describedby={unannouncedError ? "unannounced-error" : undefined}
            />
            <Label
              htmlFor="unannouncedTraining"
              className="cursor-pointer leading-5 text-text-primary"
            >
              불시 보이스피싱 훈련 전화를 수신하는 데 동의합니다.
            </Label>
          </div>
          {unannouncedError ? (
            <p id="unannounced-error" className="mt-2 text-sm text-destructive">
              {unannouncedError}
            </p>
          ) : null}
        </fieldset>
      </Card>
    </>
  );
}
