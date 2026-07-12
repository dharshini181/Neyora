"use client";

import { motion } from "framer-motion";
import { Scissors, Zap, Ruler, Shirt, CircleDot } from "lucide-react";

type Particle = {
  Icon: typeof Scissors;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

const particles: Particle[] = [
  { Icon: Scissors, top: "26%", left: "6%", size: 28, duration: 9, delay: 0, opacity: 0.18 },
  { Icon: Ruler, top: "32%", left: "90%", size: 24, duration: 11, delay: 1, opacity: 0.15 },
  { Icon: Shirt, top: "68%", left: "5%", size: 30, duration: 8, delay: 2, opacity: 0.14 },
  { Icon: CircleDot, top: "80%", left: "92%", size: 18, duration: 7, delay: 0.5, opacity: 0.2 },
  { Icon: Zap, top: "44%", left: "50%", size: 20, duration: 10, delay: 1.5, opacity: 0.12 },
  { Icon: Scissors, top: "85%", left: "40%", size: 22, duration: 12, delay: 3, opacity: 0.15 },
  { Icon: Ruler, top: "24%", left: "45%", size: 20, duration: 9.5, delay: 2.2, opacity: 0.13 },
  { Icon: CircleDot, top: "55%", left: "82%", size: 16, duration: 6.5, delay: 0.8, opacity: 0.18 },
];

export default function FloatingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />

      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute text-primary"
          style={{ top: p.top, left: p.left, opacity: p.opacity }}
          animate={{ y: [0, -22, 0], rotate: [0, 10, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <p.Icon size={p.size} strokeWidth={1.25} />
        </motion.div>
      ))}
    </div>
  );
}
