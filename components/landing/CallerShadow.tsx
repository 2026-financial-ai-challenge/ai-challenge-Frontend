import Image from "next/image";

export function CallerShadow({ caller = true }: { caller?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #4a5465 0%, #3a4252 38%, #262c38 68%, #16181f 100%)",
        }}
      />

      {caller && (
        <Image
          src="/landing/caller.png"
          alt=""
          width={720}
          height={733}
          priority
          className="absolute left-1/2 top-[6%] w-[128%] max-w-none -translate-x-1/2"
          style={{
            maskImage:
              "linear-gradient(180deg, #000 56%, rgba(0,0,0,0.35) 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, #000 56%, rgba(0,0,0,0.35) 80%, transparent 100%)",
          }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,11,15,0.72) 0%, rgba(10,11,15,0.28) 14%, rgba(10,11,15,0) 32%, rgba(10,11,15,0) 60%, rgba(10,11,15,0.78) 82%, rgba(10,11,15,0.96) 100%)",
        }}
      />
    </div>
  );
}
