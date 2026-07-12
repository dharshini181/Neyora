import { getCustomers } from "@/lib/data/customers";
import { getDressTypes } from "@/lib/data/patterns";
import PatternGeneratorForm from "@/components/patterns/PatternGeneratorForm";

export default async function NewPatternPage() {
  const [customers, dressTypes] = await Promise.all([getCustomers(), getDressTypes()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Generate Pattern</h1>
        <p className="text-sm text-secondary">
          Pick a customer, a saved measurement set, and a dress type — the Pattern Rule Engine
          does the drafting math.
        </p>
      </div>
      <PatternGeneratorForm customers={customers} dressTypes={dressTypes} />
    </div>
  );
}
