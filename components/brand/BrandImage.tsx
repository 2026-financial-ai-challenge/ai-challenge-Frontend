import Image from "next/image";

const assets = {
  hero: { src: "/brand/hero.png", width: 1156, height: 1361 },
  wordmark: { src: "/brand/logo-pill.png", width: 831, height: 206 },
  mascot: { src: "/brand/lockup.png", width: 264, height: 256 },
  shield: { src: "/brand/shield-check.png", width: 160, height: 176 },
  phone: { src: "/brand/phone.png", width: 131, height: 139 },
  alert: { src: "/brand/icon-alert.png", width: 145, height: 118 },
  favicon: { src: "/brand/favicon.png", width: 255, height: 254 },
} as const;

type BrandName = keyof typeof assets;

type BrandImageProps = {
  name: BrandName;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function BrandImage({ name, alt, className, priority }: BrandImageProps) {
  const asset = assets[name];

  return (
    <Image
      src={asset.src}
      alt={alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      className={`object-contain ${className ?? ""}`}
    />
  );
}
