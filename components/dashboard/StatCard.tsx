"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

function useCountUp(target: number, inView: boolean, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf = 0;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return value;
}

export default function StatCard({
  icon,
  label,
  value,
  prefix = "",
  suffix = "",
  trend,
}: {
  /** Pass an already-rendered icon element, e.g. `<Users size={18} />` —
   *  not the component reference itself (Server → Client Component props
   *  must be plain data or rendered elements, not function/class references). */
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: { value: string; positive: boolean };
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const animated = useCountUp(value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
            {icon}
          </div>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-primary" : "text-red-400"
              )}
            >
              {trend.positive ? "+" : ""}
              {trend.value}
            </span>
          )}
        </div>
        <p className="mb-1 font-display text-3xl font-semibold">
          {prefix}
          {animated.toLocaleString()}
          {suffix}
        </p>
        <p className="text-sm text-secondary">{label}</p>
      </GlassCard>
    </motion.div>
  );
}
