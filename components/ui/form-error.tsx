import { cn } from "@/lib/utils";

type FormErrorProps = {
  id?: string;
  message?: string | null;
  className?: string;
};

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
