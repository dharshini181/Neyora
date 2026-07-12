"use client";

import { Printer } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";

/**
 * Uses the browser's native print dialog (Save as PDF works out of the box
 * on every OS). A dedicated server-generated PDF — for invoices, with your
 * letterhead — arrives with the Invoice Generator round.
 */
export default function PrintButton() {
  return (
    <GlowButton variant="outline" className="px-4 py-2 text-xs" onClick={() => window.print()}>
      <Printer size={13} /> Print / Save as PDF
    </GlowButton>
  );
}
