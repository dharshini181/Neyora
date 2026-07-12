import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/settings";
import SettingsForm from "@/components/settings/SettingsForm";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <div>
      <div className="mb-8">
        <BilingualHeading translationKey="settingsTitle" />
        <BilingualText translationKey="settingsSubtitle" />
      </div>
      <SettingsForm profile={profile} />
    </div>
  );
}
