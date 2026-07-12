"use client";

import { useEffect, useRef } from "react";

/**
 * GPU-accelerated cursor glow. Uses a single fixed-position div moved via
 * requestAnimationFrame + transform (never top/left) so it never triggers layout.
 */
export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let glowX = targetX;
    let glowY = targetY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX - 4}px, ${targetY - 4}px, 0)`;
      }
    };

    const onDown = () => glowRef.current?.classList.add("scale-125", "opacity-70");
    const onUp = () => glowRef.current?.classList.remove("scale-125", "opacity-70");

    const tick = () => {
      // Ease the big glow toward the cursor for a soft trailing feel
      glowX += (targetX - glowX) * 0.12;
      glowY += (targetY - glowY) * 0.12;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowX - 220}px, ${glowY - 220}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={glowRef}
        className="absolute h-[440px] w-[440px] rounded-full opacity-50 blur-[80px] transition-[opacity,transform] duration-150 ease-out will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,136,0.35) 0%, rgba(0,255,136,0.08) 45%, transparent 70%)",
        }}
      />
      <div
        ref={dotRef}
        className="absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_4px_rgba(0,255,136,0.6)] will-change-transform"
      />
    </div>
  );
}
