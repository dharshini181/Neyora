import { Scissors } from "lucide-react";
import FloatingBackground from "@/components/landing/FloatingBackground";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden overflow-hidden border-r border-primary/10 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <FloatingBackground />
        <a href="/" className="relative z-10 flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
            <Scissors size={16} />
          </span>
          NEYORA
        </a>

        <div className="relative z-10 max-w-md">
          <h2 className="mb-4 font-display text-4xl font-semibold leading-tight">
            Run your tailoring business like a <span className="text-gradient">studio.</span>
          </h2>
          <p className="text-secondary">
            Measurements, patterns, fabric planning, and orders — all in one calm,
            connected workspace built for tailors.
          </p>
        </div>

        <p className="relative z-10 text-xs text-secondary">
          &copy; 2026 Neyora. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center px-6 py-16">
        <div className="absolute inset-0 grid-bg opacity-40 lg:hidden" />
        <div className="relative z-10 w-full max-w-sm">
          <a href="/" className="mb-10 flex items-center gap-2 font-display text-lg font-semibold lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
              <Scissors size={16} />
            </span>
            NEYORA
          </a>
          <h1 className="mb-2 font-display text-3xl font-semibold">{title}</h1>
          <p className="mb-8 text-sm text-secondary">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
