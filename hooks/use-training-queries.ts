"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RegisterPhoneRequest, SubmitConsentRequest } from "@/lib/types";

export const queryKeys = {
  session: (sessionId: string) => ["session", sessionId] as const,
  report: (sessionId: string) => ["report", sessionId] as const,
  result: (sessionId: string) => ["result", sessionId] as const,
};

export function useSubmitConsentMutation() {
  return useMutation({
    mutationFn: (body: SubmitConsentRequest) => api.submitConsent(body),
  });
}

export function useRegisterPhoneMutation() {
  return useMutation({
    mutationFn: (body: RegisterPhoneRequest) => api.registerPhone(body),
  });
}

export function useSessionQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.session(sessionId ?? ""),
    queryFn: () => api.getSession(sessionId!),
    enabled: Boolean(sessionId),
    refetchInterval: (query) => {
      const status = query.state.data?.session.callStatus;
      if (status === "completed") return false;
      return 3000;
    },
  });
}

export function useAnnouncedReportQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.report(sessionId ?? ""),
    queryFn: () => api.getAnnouncedReport(sessionId!),
    enabled: Boolean(sessionId),
    retry: false,
  });
}

export function useComparisonResultQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.result(sessionId ?? ""),
    queryFn: () => api.getComparisonResult(sessionId!),
    enabled: Boolean(sessionId),
    retry: false,
  });
}
