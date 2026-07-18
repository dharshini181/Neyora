"use client";

import { motion } from "framer-motion";

/**
 * Hand-drawn line-art scene for the hero — a dress form at the center with
 * tailoring tools floating around it, matching the composition of the
 * reference design (scissors upper-left, thread/buttons upper-right,
 * sewing machine lower-right, measuring tape draping across the bottom).
 * All original SVG paths, neon-green stroke on transparent background.
 */
export default function HeroIllustration() {
  return (
    <div className="relative flex h-[460px] w-full items-center justify-center">
      <div className="absolute h-80 w-80 rounded-full bg-primary/10 blur-[110px]" />

      {/* Dress form — the anchor piece, stays still while tools float around it */}
      <svg viewBox="0 0 200 340" className="relative h-[440px] w-auto text-primary/80">
        <defs>
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* neck + shoulders + bust + waist + hip, on a stand */}
        <path
          d="M92 18 Q100 8 108 18 L110 30 Q135 40 138 75 Q140 110 128 140 Q124 155 130 168
             L133 210 Q136 235 122 250 L78 250 Q64 235 67 210 L70 168
             Q76 155 72 140 Q60 110 62 75 Q65 40 90 30 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.75"
          filter="url(#neonGlow)"
        />
        {/* center seam */}
        <line x1="100" y1="30" x2="100" y2="250" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        {/* waist seam */}
        <path d="M68 168 Q100 178 132 168" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
        {/* stand */}
        <line x1="100" y1="250" x2="100" y2="300" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="100" cy="308" rx="34" ry="8" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
        <line x1="70" y1="304" x2="130" y2="304" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>

      {/* Scissors — upper left */}
      <FloatItem style={{ top: "6%", left: "2%" }} duration={7}>
        <svg viewBox="0 0 60 60" className="h-14 w-14 text-primary">
          <circle cx="14" cy="44" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="30" cy="48" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="18" y1="39" x2="52" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="43" x2="52" y2="52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="21" cy="41" r="1.6" fill="currentColor" />
        </svg>
      </FloatItem>

      {/* Thread spool — upper right */}
      <FloatItem style={{ top: "2%", right: "4%" }} duration={8}>
        <svg viewBox="0 0 60 70" className="h-16 w-14 text-primary">
          <ellipse cx="30" cy="12" rx="16" ry="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <ellipse cx="30" cy="58" rx="16" ry="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <line x1="14" y1="12" x2="14" y2="58" stroke="currentColor" strokeWidth="1.8" />
          <line x1="46" y1="12" x2="46" y2="58" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 20 Q30 26 44 20 M16 30 Q30 36 44 30 M16 40 Q30 46 44 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </svg>
      </FloatItem>

      {/* Buttons — right side, middle */}
      <FloatItem style={{ top: "34%", right: "-2%" }} duration={6}>
        <svg viewBox="0 0 40 40" className="h-9 w-9 text-primary">
          <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="14" cy="14" r="1.8" fill="currentColor" />
          <circle cx="26" cy="14" r="1.8" fill="currentColor" />
          <circle cx="14" cy="26" r="1.8" fill="currentColor" />
          <circle cx="26" cy="26" r="1.8" fill="currentColor" />
        </svg>
      </FloatItem>

      {/* Safety pin — top center-right */}
      <FloatItem style={{ top: "16%", right: "22%" }} duration={9}>
        <svg viewBox="0 0 70 45" className="h-9 w-14 text-primary">
          {/* coiled spring end */}
          <circle cx="10" cy="32" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="15" cy="29" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          {/* pin shaft */}
          <path d="M17 27 Q35 6 55 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          {/* clasp cap catching the point */}
          <path d="M55 8 Q64 8 64 15 Q64 22 55 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </FloatItem>

      {/* Sewing machine — lower right */}
      <FloatItem style={{ bottom: "4%", right: "0%" }} duration={7.5}>
        <svg viewBox="0 0 140 90" className="h-20 w-28 text-primary">
          {/* base / platform */}
          <rect x="8" y="68" width="120" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          {/* body: post + arm + head, classic C-silhouette */}
          <path
            d="M28 68 L28 28 Q28 16 40 16 L88 16 Q104 16 104 32 L104 58"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* needle */}
          <line x1="104" y1="58" x2="104" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* spool pin on top */}
          <line x1="40" y1="16" x2="40" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="40" cy="4" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          {/* hand wheel on the side */}
          <circle cx="30" cy="42" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </FloatItem>

      {/* Measuring tape — draping across the bottom */}
      <FloatItem style={{ bottom: "0%", left: "0%" }} duration={10}>
        <svg viewBox="0 0 140 50" className="h-10 w-32 text-primary">
          <path
            d="M2 6 Q30 -2 55 10 Q80 22 105 8 Q120 0 138 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.85"
          />
          {Array.from({ length: 14 }).map((_, i) => (
            <line
              key={i}
              x1={4 + i * 9.6}
              y1={6 + Math.sin(i / 2) * 6 - 3}
              x2={4 + i * 9.6}
              y2={6 + Math.sin(i / 2) * 6 + 3}
              stroke="#050505"
              strokeWidth="1"
              opacity="0.7"
            />
          ))}
        </svg>
      </FloatItem>
    </div>
  );
}

function FloatItem({
  children,
  style,
  duration,
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute drop-shadow-[0_0_6px_rgba(0,255,136,0.45)]"
      style={style}
      animate={{ y: [0, -14, 0], rotate: [0, 3, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
