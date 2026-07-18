import DressDetectionUpload from "@/components/ai/DressDetectionUpload";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

// Vercel's default serverless function timeout (10s on Hobby) can be shorter
// than a Gemini vision call takes to respond — this extends it so the call
// has time to finish instead of being killed mid-request.
export const maxDuration = 60;

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