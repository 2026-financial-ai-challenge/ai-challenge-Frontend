"use client";

import { useEffect, useRef, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { nextReportPoll, nextSessionPoll } from "@/lib/session-polling";
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
  sessions: ["sessions"] as const,
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

export function useSessionsListQuery(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.sessions,
    queryFn: () => api.listSessions(),
    enabled,
    refetchOnWindowFocus: false,
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
      const next = nextSessionPoll({
        now: Date.now(),
        startedAt: startedAtRef.current,
        lastStatus: lastStatusRef.current,
        session: query.state.data?.session,
      });
      startedAtRef.current = next.startedAt;
      lastStatusRef.current = next.lastStatus;
      return next.interval;
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
    refetchInterval: (query) =>
      nextReportPoll(query.state.data?.status, ready),
  });
}
