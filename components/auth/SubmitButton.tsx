"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <GlowButton type="submit" disabled={pending} className="w-full justify-center">
      {pending ? <Loader2 size={16} className="animate-spin" /> : children}
    </GlowButton>
  );
}
