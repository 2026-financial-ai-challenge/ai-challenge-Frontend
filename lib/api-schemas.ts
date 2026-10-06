import { z } from "zod";

const callStatusSchema = z.enum([
  "waiting",
  "calling",
  "completed",
  "missed",
  "silent",
  "failed",
]);

const reportStatusSchema = z.enum([
  "none",
  "pending",
  "draft",
  "final",
  "failed",
]);

const authParticipantSchema = z.object({
  id: z.number(),
  phoneNumberMasked: z.string(),
  hasConsented: z.boolean(),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.string(),
  expiresInSec: z.number(),
  participant: authParticipantSchema,
});

export const requestSignupOtpResponseSchema = z.object({
  phoneNumberMasked: z.string(),
  expiresInSec: z.number(),
  resendAvailableInSec: z.number(),
  devCode: z.string().nullable().optional(),
});

export const verifySignupOtpResponseSchema = z.object({
  verificationToken: z.string(),
  expiresInSec: z.number(),
});

export const submitConsentResponseSchema = z.object({
  sessionId: z.string(),
});

const consentRecordSchema = z.object({
  privacy: z.boolean(),
  unannouncedTraining: z.boolean(),
  consentedAt: z.string(),
});

const sessionSchema = z.object({
  id: z.string(),
  phoneNumberMasked: z.string().nullable(),
  callStatus: callStatusSchema.nullable(),
  callId: z.string().nullable().default(null),
  reportStatus: reportStatusSchema.nullable().default(null),
  currentTrainingType: z.enum(["announced", "unannounced"]),
  consents: consentRecordSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const getSessionResponseSchema = z.object({
  session: sessionSchema,
});

export const listSessionsResponseSchema = z.object({
  sessions: z.array(sessionSchema),
});

export const startCallResponseSchema = z.object({
  callId: z.string().nullable().optional(),
  status: z.enum(["waiting", "calling"]),
});

const reportTurnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string(),
});

const callReportSchema = z.object({
  score: z.number(),
  suspected: z.boolean(),
  gaveName: z.boolean(),
  triedHangup: z.boolean(),
  summary: z.string(),
  coaching: z.string(),
  riskBehaviors: z
    .array(
      z.object({
        label: z.string(),
        evidence: z.string().default(""),
      }),
    )
    .default([]),
  defenseBehaviors: z
    .array(
      z.object({
        label: z.string(),
        evidence: z.string().default(""),
      }),
    )
    .default([]),
  source: z.string(),
});

export const getReportResponseSchema = z.object({
  sessionId: z.string(),
  callId: z.string().nullable().default(null),
  status: reportStatusSchema,
  turns: z.array(reportTurnSchema).default([]),
  draftTurns: z.array(reportTurnSchema).optional(),
  unannouncedTurns: z.array(reportTurnSchema).optional(),
  draft: callReportSchema.nullable().default(null),
  unannounced: callReportSchema.nullable().optional(),
  final: callReportSchema.nullable().default(null),
  clawopsSummary: z.unknown().optional(),
});
