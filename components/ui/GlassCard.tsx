import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  active?: boolean;
}

export default function GlassCard({ children, className, active, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass glass-hover rounded-2xl p-6",
        active && "border-primary/60 shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
