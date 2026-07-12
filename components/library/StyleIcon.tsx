import type { StyleCategory } from "@/lib/content/design-library";

function NeckIcon({ variant }: { variant: string }) {
  const necklines: Record<string, string> = {
    round: "M30 30 Q50 48 70 30",
    v: "M32 28 L50 55 L68 28",
    boat: "M22 32 Q50 42 78 32",
    sweetheart: "M30 30 Q40 42 50 32 Q60 42 70 30",
    halter: "M42 15 L42 30 Q50 45 58 30 L58 15",
  };
  return (
    <svg viewBox="0 0 100 80" className="h-full w-full">
      <path d="M15 75 L25 25 Q50 12 75 25 L85 75" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d={necklines[variant]} fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function SleeveIcon({ variant }: { variant: string }) {
  const shapes: Record<string, string> = {
    full: "M20 15 Q45 5 55 15 L60 75 L15 75 Z",
    puff: "M15 15 Q45 0 65 20 Q55 30 60 40 L45 55 L20 45 Z",
    bell: "M25 15 Q45 5 50 15 L65 75 L10 75 Z",
    cap: "M20 20 Q45 8 60 20 L55 35 L25 35 Z",
    sleeveless: "M30 15 L45 15 L50 40 L25 40 Z",
  };
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      <path d={shapes[variant]} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function CollarIcon({ variant }: { variant: string }) {
  const shapes: Record<string, string> = {
    peterpan: "M20 30 Q50 55 80 30 Q65 20 50 30 Q35 20 20 30 Z",
    mandarin: "M28 30 Q50 15 72 30 L72 42 Q50 30 28 42 Z",
    shirt: "M18 32 L45 22 L50 32 L55 22 L82 32 L70 45 L50 38 L30 45 Z",
    shawl: "M15 45 Q30 10 55 15 Q40 25 42 45 Z",
    notched: "M20 35 L45 20 L52 30 L58 20 L80 35 L64 30 L58 42 L42 42 L36 30 Z",
  };
  return (
    <svg viewBox="0 0 100 60" className="h-full w-full">
      <path d={shapes[variant]} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function PocketIcon({ variant }: { variant: string }) {
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      <rect x="10" y="10" width="60" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      {variant === "patch" && (
        <rect x="24" y="35" width="32" height="28" rx="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
      )}
      {variant === "welt" && (
        <rect x="24" y="42" width="32" height="6" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
      )}
      {variant === "slant" && (
        <path d="M22 40 L58 30 L58 36 L26 46 Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      )}
      {variant === "flap" && (
        <>
          <rect x="24" y="42" width="32" height="20" rx="3" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
          <path d="M22 42 L58 42 L54 34 L26 34 Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" />
        </>
      )}
      {variant === "hidden" && (
        <path d="M24 45 L56 45" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
      )}
    </svg>
  );
}

function BorderIcon({ variant }: { variant: string }) {
  return (
    <svg viewBox="0 0 100 40" className="h-full w-full">
      <line x1="5" y1="20" x2="95" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      {variant === "piping" && <line x1="5" y1="20" x2="95" y2="20" stroke="currentColor" strokeWidth="3" />}
      {variant === "lace" && (
        <path d="M5 20 Q15 8 25 20 Q35 8 45 20 Q55 8 65 20 Q75 8 85 20 Q90 15 95 20" fill="none" stroke="currentColor" strokeWidth="2" />
      )}
      {variant === "embroidery" && (
        <>
          <circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity="0.3" />
          <circle cx="40" cy="20" r="4" fill="currentColor" fillOpacity="0.3" />
          <circle cx="60" cy="20" r="4" fill="currentColor" fillOpacity="0.3" />
          <circle cx="80" cy="20" r="4" fill="currentColor" fillOpacity="0.3" />
        </>
      )}
      {variant === "contrast" && <rect x="5" y="14" width="90" height="12" fill="currentColor" fillOpacity="0.15" />}
      {variant === "scallop" && (
        <path d="M5 14 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0 a8 8 0 0 0 16 0" fill="none" stroke="currentColor" strokeWidth="2" />
      )}
    </svg>
  );
}

export default function StyleIcon({ category, variant }: { category: StyleCategory; variant: string }) {
  switch (category) {
    case "neck":
      return <NeckIcon variant={variant} />;
    case "sleeve":
      return <SleeveIcon variant={variant} />;
    case "collar":
      return <CollarIcon variant={variant} />;
    case "pocket":
      return <PocketIcon variant={variant} />;
    case "border":
      return <BorderIcon variant={variant} />;
  }
}
