"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { parseMeasurementTranscript, type ParsedMeasurements } from "@/lib/voice/parse-measurements";

// The Web Speech API isn't in TypeScript's default DOM lib — declare the
// minimal shape we use rather than pulling in a whole ambient types package.
interface SpeechRecognitionResultLike {
  transcript: string;
}
interface SpeechRecognitionEventLike extends Event {
  results: { [index: number]: { [index: number]: SpeechRecognitionResultLike } };
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

export default function VoiceInputButton({
  onParsed,
}: {
  onParsed: (values: ParsedMeasurements, matchedFields: string[]) => void;
}) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }

    const recognition = new Ctor();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      const { values, matchedFields } = parseMeasurementTranscript(text);
      onParsed(values, matchedFields);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, [onParsed]);

  const toggle = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setListening(true);
    }
  };

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input needs Chrome or Edge (the Web Speech API isn't available in this browser)."
        className="flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-xs text-secondary opacity-50"
      >
        <MicOff size={14} /> Voice Input
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={toggle}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition ${
          listening
            ? "border-primary bg-primary/15 text-primary"
            : "border-primary/20 text-secondary hover:border-primary/50 hover:text-primary"
        }`}
      >
        {listening ? <Loader2 size={14} className="animate-spin" /> : <Mic size={14} />}
        {listening ? "Listening..." : "Voice Input"}
      </button>
      {transcript && <p className="max-w-[220px] text-right text-[11px] text-secondary">"{transcript}"</p>}
    </div>
  );
}
