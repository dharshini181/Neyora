import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormField({ label, error, className, id, ...props }: FormFieldProps) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="mb-1.5 block text-sm text-white/80">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "w-full rounded-xl border border-primary/15 bg-card px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-secondary/60",
          "focus:border-primary/60 focus:shadow-glow-sm",
          error && "border-red-500/60",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
