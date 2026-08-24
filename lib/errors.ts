export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** 서버가 준 message만 보여 준다. 코드별 문구를 프론트에서 다시 쓰지 않는다. */
export function apiErrorMessage(error: unknown, fallback?: string): string | null {
  if (error instanceof ApiError) return error.message;
  if (error && fallback) return fallback;
  return null;
}
