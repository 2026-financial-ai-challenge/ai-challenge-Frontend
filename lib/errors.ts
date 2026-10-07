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

export function apiErrorMessage(error: unknown, fallback?: string): string | null {
  if (error instanceof ApiError) return error.message;
  if (error && fallback) return fallback;
  return null;
}
