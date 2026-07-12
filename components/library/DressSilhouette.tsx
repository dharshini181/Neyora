import type { SilhouetteShape } from "@/lib/content/dress-library";

const PATHS: Record<SilhouetteShape, string> = {
  // Fitted top flaring into a long, wide skirt
  flared:
    "M38 8 Q50 2 62 8 L66 34 Q88 60 84 96 L16 96 Q12 60 34 34 Z",
  // Narrow, roughly rectangular body (kurti/shirt)
  straight: "M36 8 Q50 2 64 8 L68 30 L72 96 L28 96 L32 30 Z",
  // Close-fitted through bust and waist (blouse/churidar)
  fitted: "M38 8 Q50 3 62 8 L64 30 Q66 55 60 70 L40 70 Q34 55 36 30 Z",
  // Two separate pieces (salwar-kameez style)
  twopiece:
    "M38 6 Q50 2 62 6 L65 26 L58 50 L42 50 L35 26 Z M30 58 Q50 52 70 58 L64 96 L54 70 L46 70 L36 96 Z",
  // Tunic — looser straight shape with slightly wider hem
  tunic: "M36 8 Q50 2 64 8 L70 34 L76 96 L24 96 L30 34 Z",
};

export default function DressSilhouette({
  shape,
  className,
}: {
  shape: SilhouetteShape;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <path
        d={PATHS[shape]}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.08"
      />
    </svg>
  );
}
