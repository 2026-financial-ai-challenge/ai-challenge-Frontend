import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PortalField({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-[#1a2433]">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-[#5b6777]">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1 text-sm text-[#b42318]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function portalInputClass(error?: boolean) {
  return cn(
    "h-11 w-full border bg-white px-3 text-[15px] text-[#1a2433] outline-none",
    "placeholder:text-[#8b95a3]",
    "focus-visible:border-[#123056] focus-visible:ring-2 focus-visible:ring-[#123056]/25",
    error ? "border-[#b42318]" : "border-[#c5ced9]",
  );
}

export function PortalButton({
  children,
  pending,
  type = "submit",
}: {
  children: ReactNode;
  pending?: boolean;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      disabled={pending}
      className="inline-flex min-h-11 min-w-[8.5rem] cursor-pointer items-center justify-center bg-[#123056] px-5 text-sm font-semibold text-white hover:bg-[#0d2442] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#123056] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "처리 중" : children}
    </button>
  );
}
