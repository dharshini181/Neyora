"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Sparkles, Bot, User } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { sendChatMessage } from "@/lib/actions/ai";
import type { ChatTurn } from "@/lib/gemini/client";

const SUGGESTIONS = [
  "How do I stitch a princess-cut blouse?",
  "How much fabric is needed for a 40-inch Anarkali?",
  "What's the difference between a Peter Pan collar and a Mandarin collar?",
  "How do I fix puckering on a sleeve seam?",
];

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);
    const nextHistory: ChatTurn[] = [...messages, { role: "user", text }];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    const res = await sendChatMessage(nextHistory);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }
    setMessages([...nextHistory, { role: "model", text: res.reply! }]);
  };

  return (
    <GlassCard className="flex h-[70vh] flex-col p-0">
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
              <Sparkles size={20} />
            </div>
            <p className="mb-6 max-w-sm text-sm text-secondary">
              Ask about stitching techniques, fabric requirements, or garment construction.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-primary/20 px-3.5 py-2 text-xs text-secondary transition hover:border-primary/50 hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    m.role === "user" ? "bg-white/10 text-white" : "bg-primary/15 text-primary"
                  }`}
                >
                  {m.role === "user" ? <User size={15} /> : <Bot size={15} />}
                </div>
                <div
                  className={`max-w-[75%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user" ? "bg-primary text-black" : "bg-white/[0.05] text-white/90"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Bot size={15} />
                </div>
                <div className="flex items-center rounded-2xl bg-white/[0.05] px-4 py-2.5">
                  <Loader2 size={14} className="animate-spin text-secondary" />
                </div>
              </div>
            )}
            {error && (
              <p className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-xs text-yellow-200/80">
                {error}
              </p>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-primary/10 p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about stitching, fabric, or measurements..."
          className="flex-1 rounded-full border border-primary/15 bg-card px-4 py-2.5 text-sm outline-none placeholder:text-secondary/60 focus:border-primary/50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-black transition hover:brightness-110 disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </GlassCard>
  );
}
