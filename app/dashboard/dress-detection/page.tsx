import DressDetectionUpload from "@/components/ai/DressDetectionUpload";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

export default function DressDetectionPage() {
  return (
    <div>
      <div className="mb-8">
        <BilingualHeading translationKey="dressDetectionTitle" />
        <BilingualText translationKey="dressDetectionSubtitle" />
      </div>
      <DressDetectionUpload />
    </div>
  );
}
