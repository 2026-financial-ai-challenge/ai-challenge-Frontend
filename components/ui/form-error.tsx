import { cn } from "@/lib/utils";

type FormErrorProps = {
  /** aria-describedby로 입력과 연결할 때 쓴다. */
  id?: string;
  message?: string | null;
  className?: string;
};

/** 폼 오류 문구. message가 없으면 아무것도 그리지 않는다. */
export function FormError({ id, message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={cn("text-sm text-destructive", className)}
    >
      {message}
    </p>
  );
}
