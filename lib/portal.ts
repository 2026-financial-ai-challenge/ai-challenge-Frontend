export const PORTAL_NAME = "가온형사사법지원포털";
export const PORTAL_NAME_EN = "GAON Criminal Support";
export const PORTAL_AGENCY = "금융범죄 합동대응반";
export const PORTAL_TEAM = "자산보전과";

export function portalHref(path = "/"): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export const PORTAL_BANKS = [
  "선택",
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "농협은행",
  "기업은행",
  "카카오뱅크",
  "토스뱅크",
  "기타",
] as const;
