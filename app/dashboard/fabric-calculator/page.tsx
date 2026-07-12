import { getDressTypes } from "@/lib/data/patterns";
import StandaloneFabricCalculator from "@/components/patterns/StandaloneFabricCalculator";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

export default async function FabricCalculatorPage() {
  const dressTypes = await getDressTypes();

  return (
    <div>
      <div className="mb-8">
        <BilingualHeading translationKey="fabricCalcTitle" />
        <BilingualText translationKey="fabricCalcSubtitle" />
      </div>
      <StandaloneFabricCalculator dressTypes={dressTypes} />
    </div>
  );
}
