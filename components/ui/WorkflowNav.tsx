import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";

type Step = { label: string; href: string };

/**
 * A bottom navigation bar for guided, sequential workflows (Customer →
 * Measurement → Pattern → Order → Invoice) — lets someone move to the next
 * logical step without going back to the sidebar each time.
 */
export default function WorkflowNav({ prev, next }: { prev?: Step; next?: Step }) {
  if (!prev && !next) return null;

  return (
    <div className="mt-10 flex items-center justify-between border-t border-primary/10 pt-6">
      {prev ? (
        <Link href={prev.href}>
          <GlowButton variant="ghost" className="px-4 py-2 text-xs">
            <ArrowLeft size={14} /> {prev.label}
          </GlowButton>
        </Link>
      ) : (
        <span />
      )}

      {next && (
        <Link href={next.href}>
          <GlowButton className="px-5 py-2.5 text-xs">
            {next.label} <ArrowRight size={14} />
          </GlowButton>
        </Link>
      )}
    </div>
  );
}
