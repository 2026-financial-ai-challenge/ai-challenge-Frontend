import type { ReactNode } from "react";

type AuthPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

/** 로그인·회원가입·동의처럼 폼 하나만 세로 가운데에 두는 화면의 공통 틀. */
export function AuthPageShell({
  title,
  description,
  children,
}: AuthPageShellProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 py-12 sm:min-h-[75vh] sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">
        {title}
      </h1>
      <p className="mt-3 text-base leading-6 text-text-primary">{description}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}
