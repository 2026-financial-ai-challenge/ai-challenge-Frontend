const DEFAULT_PORTAL_HOSTS = "gaoncs.localhost,gaoncs.vercel.app";

export function isPortalHost(hostHeader: string): boolean {
  if (process.env.NEXT_PUBLIC_PORTAL_ONLY === "true") {
    return true;
  }

  const [hostname, port] = splitHost(hostHeader);

  if (process.env.NODE_ENV !== "production" && port === "3001") {
    return true;
  }

  return portalHostnames().some(
    (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`),
  );
}

export function portalHostnames(): string[] {
  return (process.env.NEXT_PUBLIC_PORTAL_HOSTS ?? DEFAULT_PORTAL_HOSTS)
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function splitHost(hostHeader: string): [string, string] {
  const trimmed = hostHeader.trim().toLowerCase();
  if (!trimmed) return ["", ""];

  if (trimmed.startsWith("[")) {
    const end = trimmed.indexOf("]");
    const hostname = end === -1 ? trimmed : trimmed.slice(1, end);
    const port = end === -1 ? "" : trimmed.slice(end + 2);
    return [hostname, port];
  }

  const cut = trimmed.lastIndexOf(":");
  if (cut === -1) return [trimmed, ""];
  return [trimmed.slice(0, cut), trimmed.slice(cut + 1)];
}
