import Link from "next/link";
import { notFound } from "next/navigation";
import { Ruler, Layers, Scissors, Sparkles, Info } from "lucide-react";
import { getPatternById } from "@/lib/data/patterns";
import GlassCard from "@/components/ui/GlassCard";
import PatternDiagram from "@/components/patterns/PatternDiagram";
import FabricBreakdown from "@/components/patterns/FabricBreakdown";
import CuttingLayout from "@/components/patterns/CuttingLayout";
import PrintButton from "@/components/patterns/PrintButton";
import WorkflowNav from "@/components/ui/WorkflowNav";

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pattern = await getPatternById(id);
  if (!pattern) notFound();

  const dressName = pattern.dress_types?.name ?? "Custom Dress";

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{dressName}</h1>
          <p className="text-sm text-secondary">
            for{" "}
            <Link
              href={`/dashboard/customers/${pattern.customer_id}`}
              className="text-primary hover:underline"
            >
              {pattern.customers?.name ?? "Unknown customer"}
            </Link>{" "}
            &middot;{" "}
            {new Date(pattern.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="no-print">
          <PrintButton />
        </div>
      </div>

      {pattern.pattern_data.warnings.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3">
          <Info size={16} className="mt-0.5 shrink-0 text-yellow-400" />
          <ul className="space-y-1 text-xs text-yellow-200/80">
            {pattern.pattern_data.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80">
            <Ruler size={15} className="text-primary" /> Pattern Diagram
          </h2>
          <PatternDiagram pattern={pattern.pattern_data} />
          <p className="mt-3 text-xs text-secondary">
            Seam allowance: {pattern.pattern_data.seamAllowance}&Prime; on all edges &middot; Dart:{" "}
            {pattern.pattern_data.dartWidth}&Prime; × {pattern.pattern_data.dartLength}&Prime;
          </p>
          <p className="mt-2 text-[11px] text-secondary/70">
            Simplified drafting guide based on standard ease formulas — always confirm with a
            trial fitting.
          </p>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-white/80">
            <Layers size={15} className="text-primary" /> Fabric Calculator
          </h2>
          <FabricBreakdown fabric={pattern.fabric_data} />
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-medium text-white/80">
            <Scissors size={15} className="text-primary" /> Cutting Layout &amp; Guide
          </h2>
          <CuttingLayout dressName={dressName} />
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80">
            <Sparkles size={15} className="text-primary" />
            {pattern.ai_generated ? "AI Stitching Tips" : "Stitching Tips"}
          </h2>
          {pattern.ai_notes ? (
            <p className="whitespace-pre-line text-sm text-secondary">{pattern.ai_notes}</p>
          ) : (
            <p className="text-sm text-secondary">
              Add <code className="text-primary">GEMINI_API_KEY</code> to your{" "}
              <code className="text-primary">.env.local</code> to get AI-generated, garment-specific
              stitching tips here. For now, see the static Cutting Layout guide above.
            </p>
          )}
        </GlassCard>
      </div>

      <WorkflowNav
        prev={{ label: "Back to Patterns", href: "/dashboard/patterns" }}
        next={{ label: "Create Order", href: "/dashboard/orders/new" }}
      />
    </div>
  );
}
