"use client";

import { CaseDocument } from "@/components/portal/CaseDocument";
import { HoldForm } from "@/components/portal/HoldForm";
import { InquiryForm } from "@/components/portal/InquiryForm";
import { PortalChrome } from "@/components/portal/PortalChrome";
import { PortalHome } from "@/components/portal/PortalHome";
import { VerifyForm } from "@/components/portal/VerifyForm";
import { WebTrainingDebrief } from "@/components/portal/training/WebTrainingDebrief";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import {
  LEAVE_WITHOUT_INPUT_MS,
  WEB_TRAINING_DEBRIEF,
  type WebTrainingAction,
} from "@/lib/web-training";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

type LinkState = "checking" | "valid" | "expired" | "invalid" | "error";
type View = "home" | "inquiry" | "verify" | "hold";

const VIEWS: readonly View[] = ["home", "inquiry", "verify", "hold"];

function parseView(value: string | null): View {
  return VIEWS.find((view) => view === value) ?? "home";
}

function trainingHref(token: string) {
  const base = `/t/${encodeURIComponent(token)}`;
  return (path: string) => {
    if (path === "/" || path === "/notice") return base;
    if (path.startsWith("/#")) return `${base}${path.slice(1)}`;
    return `${base}?v=${path.slice(1)}`;
  };
}

// 백엔드는 행동 뒤에도 링크를 닫지 않으므로, 중복 이벤트·재진입 방지를 위해 토큰별로 기록한다.
function storageKey(token: string, name: "opened" | "left" | "result") {
  return `web-training:${token}:${name}`;
}

function readStored(token: string, name: "opened" | "left" | "result") {
  try {
    return window.localStorage.getItem(storageKey(token, name));
  } catch {
    return null;
  }
}

function writeStored(
  token: string,
  name: "opened" | "left" | "result",
  value: string,
) {
  try {
    window.localStorage.setItem(storageKey(token, name), value);
  } catch {
    // 저장소를 못 쓰면 중복 방지만 약해진다.
  }
}

function storedResult(token: string): WebTrainingAction | null {
  const value = readStored(token, "result");
  return value && value in WEB_TRAINING_DEBRIEF
    ? (value as WebTrainingAction)
    : null;
}

export function WebTrainingFlow({ token }: { token: string }) {
  const searchParams = useSearchParams();
  const view = parseView(searchParams.get("v"));
  const hrefFor = trainingHref(token);

  const [linkState, setLinkState] = useState<LinkState>("checking");
  const [result, setResult] = useState<WebTrainingAction | null>(null);
  const openedAtRef = useRef(0);
  const touchedRef = useRef(false);
  const actedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    api
      .checkWebTrainingLink(token)
      .then(() => {
        if (cancelled) return;
        if (storedResult(token)) {
          setLinkState("expired");
          return;
        }
        openedAtRef.current = Date.now();
        setLinkState("valid");
        if (!readStored(token, "opened")) {
          writeStored(token, "opened", "1");
          api.sendWebTrainingEvent(token, "link_opened");
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 410) {
          setLinkState("expired");
        } else if (error instanceof ApiError && error.status === 404) {
          setLinkState("invalid");
        } else {
          setLinkState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (linkState !== "valid") return;

    const onPageHide = () => {
      if (touchedRef.current || actedRef.current) return;
      if (readStored(token, "left")) return;
      if (Date.now() - openedAtRef.current > LEAVE_WITHOUT_INPUT_MS) return;
      writeStored(token, "left", "1");
      api.sendWebTrainingEvent(token, "left_without_input");
    };

    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [linkState, token]);

  const act = (action: WebTrainingAction) => {
    if (actedRef.current) return;
    actedRef.current = true;
    api.sendWebTrainingEvent(token, action);
    writeStored(token, "result", action);
    setResult(action);
    window.scrollTo({ top: 0 });
  };

  const markTouched = () => {
    touchedRef.current = true;
  };

  if (linkState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e8eef4]">
        <p className="text-sm text-[#5b6777]" role="status">
          접속 정보를 확인하고 있습니다.
        </p>
      </div>
    );
  }

  if (linkState !== "valid") {
    return <ExpiredLink state={linkState} />;
  }

  if (result) {
    return <WebTrainingDebrief action={result} />;
  }

  return (
    <div onInputCapture={markTouched} onChangeCapture={markTouched}>
      <PortalChrome
        active={view === "home" ? "온라인민원" : "나의 사건 조회"}
        hrefFor={hrefFor}
        utility={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => act("report_clicked")}
              className="min-h-6 cursor-pointer text-white/80 underline-offset-2 hover:text-white hover:underline"
            >
              스미싱 의심 문자 신고
            </button>
            <span className="rounded-sm bg-[#d4b36a] px-1.5 py-0.5 text-[11px] font-bold text-[#0b2a4a]">
              훈련용
            </span>
          </div>
        }
      >
        {view === "home" ? (
          <PortalHome
            hrefFor={hrefFor}
            notice={
              <InstallNotice
                holdHref={hrefFor("/hold")}
                onInstall={() => act("app_install_clicked")}
              />
            }
          />
        ) : (
          <div className="mx-auto max-w-[760px] px-4 py-8">
            <Breadcrumb hrefFor={hrefFor} view={view} />
            {view === "inquiry" ? (
              <FormPanel
                eyebrow="온라인민원"
                title="나의 사건 조회"
                body="성명을 입력하면 문자 안내 링크에 연결된 사건의 열람 가능 여부를 안내합니다. 회원가입이 되어 있지 않으면 실명 인증이 필요합니다."
              >
                <InquiryForm
                  caseNoLinked
                  onSubmitted={() => act("case_lookup_submitted")}
                />
              </FormPanel>
            ) : view === "verify" ? (
              <FormPanel
                eyebrow="회원정보 없음"
                title="실명 인증하기"
                body="회원가입이 되어 있지 않으면 실명 인증 후 사건 열람을 진행할 수 있습니다. 아래 항목을 입력한 뒤 실명 인증하기를 눌러 주십시오."
              >
                <VerifyForm onSubmitted={() => act("identity_submitted")} />
              </FormPanel>
            ) : (
              <>
                <div className="mt-5">
                  <CaseDocument />
                </div>
                <FormPanel
                  title="보전 대상 계좌 확인"
                  body="명의 도용 여부와 보전 대상 자산을 확인하기 위해 거래 계좌를 입력합니다. 확인이 끝나야 서류 원문을 열람할 수 있습니다."
                >
                  <HoldForm onSubmitted={() => act("financial_info_submitted")} />
                </FormPanel>
              </>
            )}
          </div>
        )}
      </PortalChrome>
    </div>
  );
}

function InstallNotice({
  holdHref,
  onInstall,
}: {
  holdHref: string;
  onInstall: () => void;
}) {
  return (
    <section className="mx-auto max-w-[1080px] px-4 pt-10">
      <div className="flex flex-col gap-4 border border-[#e3c98d] bg-[#fdf8ec] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#6b4f10]">
            전자문서 열람 보안모듈 설치 안내
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#5b4a20]">
            등기송달 원문은 보안모듈이 설치된 기기에서만 열람됩니다. 설치 후
            나의 사건 조회를 진행해 주십시오.
          </p>
          <Link
            href={holdHref}
            className="mt-2 inline-block text-sm font-semibold text-[#123056] underline underline-offset-2"
          >
            사건번호를 안내받으셨다면 보전 대상 계좌 확인 바로가기
          </Link>
        </div>
        <button
          type="button"
          onClick={onInstall}
          className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center bg-[#123056] px-5 text-sm font-semibold text-white hover:bg-[#0d2442]"
        >
          보안모듈 설치
        </button>
      </div>
    </section>
  );
}

const CRUMBS: Record<Exclude<View, "home">, string> = {
  inquiry: "나의 사건 조회",
  verify: "실명 인증",
  hold: "열람 문서",
};

function Breadcrumb({
  hrefFor,
  view,
}: {
  hrefFor: (path: string) => string;
  view: Exclude<View, "home">;
}) {
  return (
    <nav className="text-xs text-[#5b6777]">
      <Link href={hrefFor("/")} className="hover:underline">
        홈
      </Link>
      <span aria-hidden> · </span>
      {view === "inquiry" ? (
        <span>온라인민원</span>
      ) : (
        <Link href={hrefFor("/inquiry")} className="hover:underline">
          나의 사건 조회
        </Link>
      )}
      <span aria-hidden> · </span>
      <span className="text-[#123056]">{CRUMBS[view]}</span>
    </nav>
  );
}

function FormPanel({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-5 border border-[#c5ced9] bg-white p-6 sm:p-8">
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-wide text-[#5b6777]">{eyebrow}</p>
      ) : null}
      <h1 className="mt-2 text-2xl font-bold text-[#123056]">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-[#3b4654]">{body}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

const EXPIRED_COPY: Record<
  Exclude<LinkState, "checking" | "valid">,
  { title: string; body: string }
> = {
  expired: {
    title: "만료된 링크입니다",
    body: "이 링크는 사용 기간이 지나 더 이상 열 수 없습니다.",
  },
  invalid: {
    title: "만료된 링크입니다",
    body: "존재하지 않거나 이미 정리된 링크입니다. 주소를 다시 확인해 주세요.",
  },
  error: {
    title: "링크를 확인하지 못했습니다",
    body: "잠시 후 다시 열어 주세요.",
  },
};

function ExpiredLink({ state }: { state: Exclude<LinkState, "checking" | "valid"> }) {
  const copy = EXPIRED_COPY[state];
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f5f8] px-5">
      <div className="max-w-sm text-center">
        <h1 className="text-xl font-bold text-[#1a2433]">{copy.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5b6777]">{copy.body}</p>
      </div>
    </main>
  );
}
