"use client";

import { ButtonHTMLAttributes, ReactNode, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
  /** If provided, renders as a Next.js Link with the same styling/magnetic effect. */
  href?: string;
}

/** Magnetic, glow-on-hover button (or link, if `href` is provided) used across the site. */
export default function GlowButton({
  variant = "primary",
  className,
  children,
  href,
  ...props
}: GlowButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
  };

  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-out";

  const variants: Record<string, string> = {
    primary:
      "bg-primary text-black shadow-glow hover:shadow-glow-lg hover:brightness-110",
    outline:
      "border border-primary/30 text-white hover:border-primary/70 hover:bg-primary/5",
    ghost: "text-white/80 hover:text-primary",
  };

  if (href) {
    return (
      <Link
        ref={ref}
        href={href}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={cn(base, variants[variant], className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
