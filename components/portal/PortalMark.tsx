export function PortalMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      focusable="false"
    >
      <circle cx="24" cy="24" r="23" fill="#0b2a4a" stroke="#d4b36a" strokeWidth="2" />
      <circle cx="24" cy="24" r="17" fill="none" stroke="#d4b36a" strokeWidth="1" />
      <path
        d="M24 10v8M16 18h16l-2.2 16H18.2L16 18Z"
        fill="none"
        stroke="#f2e6c4"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="15" r="1.6" fill="#d4b36a" />
    </svg>
  );
}
