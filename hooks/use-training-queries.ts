"use client";

import { useEffect, useRef, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { isReportReady } from "@/lib/types";
import type {
  LoginRequest,
  ReportStatus,
  RequestSignupOtpRequest,
  SignupRequest,
  SubmitConsentRequest,
  VerifySignupOtpRequest,
} from "@/lib/types";

export const queryKeys = {
  session: (sessionId: string) => ["session", sessionId] as const,
  report: (sessionId: string, reportStatus: ReportStatus | null) =>
    ["report", sessionId, reportStatus] as const,
};

function useTabVisible() {
  const [visible, setVisible] = useState(() =>
    typeof document === "undefined"
      ? true
      : document.visibilityState === "visible",
  );

  useEffect(() => {
    const onChange = () =>
      setVisible(document.visibilityState === "visible");
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return visible;
}

export function useSubmitConsentMutation() {
  return useMutation({
    mutationFn: (body: SubmitConsentRequest) => api.submitConsent(body),
  });
}

export function useRequestSignupOtpMutation() {
  return useMutation({
    mutationFn: (body: RequestSignupOtpRequest) => api.requestSignupOtp(body),
  });
}

export function useVerifySignupOtpMutation() {
  return useMutation({
    mutationFn: (body: VerifySignupOtpRequest) => api.verifySignupOtp(body),
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (body: SignupRequest) => api.signup(body),
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (body: LoginRequest) => api.login(body),
  });
}

export function useStartCallMutation() {
  return useMutation({
    mutationFn: (sessionId: string) => api.startCall(sessionId),
  });
}

export function useSessionQuery(sessionId: string | undefined) {
  const visible = useTabVisible();
  const queryClient = useQueryClient();
  const startedAtRef = useRef<number | null>(null);
  const lastStatusRef = useRef<string | null>(null);

  useEffect(() => {
    startedAtRef.current = Date.now();
    if (!sessionId) return;
    for (const query of queryClient.getQueryCache().findAll({
      queryKey: ["session"],
    })) {
      if (query.queryKey[1] !== sessionId) {
        void queryClient.cancelQueries({ queryKey: query.queryKey });
        queryClient.removeQueries({ queryKey: query.queryKey });
      }
    }
  }, [sessionId, queryClient]);

  return useQuery({
    queryKey: queryKeys.session(sessionId ?? ""),
    queryFn: () => api.getSession(sessionId!),
    enabled: Boolean(sessionId) && visible,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchInterval: (query) => {
      if (startedAtRef.current === null) {
        startedAtRef.current = Date.now();
      }
      const session = query.state.data?.session;
      if (!session?.callStatus) return false;
      if (
        session.callStatus !== lastStatusRef.current &&
        (session.callStatus === "waiting" || session.callStatus === "calling")
      ) {
        startedAtRef.current = Date.now();
      }
      lastStatusRef.current = session.callStatus;
      if (
        session.callStatus === "missed" ||
        session.callStatus === "silent" ||
        session.callStatus === "failed"
      ) {
        return false;
      }
      if (
        session.reportStatus === "draft" ||
        session.reportStatus === "final" ||
        session.reportStatus === "failed"
      ) {
        return false;
      }
      if (Date.now() - startedAtRef.current > 180_000) return false;
      if (session.callStatus === "completed") {
        const updated = Date.parse(session.updatedAt);
        if (Number.isFinite(updated) && Date.now() - updated > 20_000) {
          return false;
        }
      }
      return 3000;
    },
  });
}

export function useReportQuery(
  sessionId: string | undefined,
  reportStatus: ReportStatus | null | undefined,
) {
  const visible = useTabVisible();
  const ready = isReportReady(reportStatus);

  return useQuery({
    queryKey: queryKeys.report(sessionId ?? "", reportStatus ?? null),
    queryFn: () => api.getReport(sessionId!),
    enabled: Boolean(sessionId) && ready && visible,
    retry: false,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchInterval: (query) => {
      if (query.state.data?.status === "final") return false;
      if (!ready) return false;
      return 15_000;
    },
  });
}
