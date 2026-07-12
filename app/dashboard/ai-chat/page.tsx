import ChatWindow from "@/components/ai/ChatWindow";
import { BilingualHeading, BilingualText } from "@/components/i18n/Bilingual";

export default function AiChatPage() {
  return (
    <div>
      <div className="mb-6">
        <BilingualHeading translationKey="aiChatTitle" />
        <BilingualText translationKey="aiChatSubtitle" />
      </div>
      <ChatWindow />
    </div>
  );
}
