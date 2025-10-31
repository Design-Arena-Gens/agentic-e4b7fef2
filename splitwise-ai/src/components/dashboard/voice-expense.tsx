"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeData } from "@/providers/realtime-data-provider";

type SpeechRecognitionResultLike = {
  0?: {
    transcript?: string;
  };
};

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    SpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export function VoiceExpense() {
  const { addExpense } = useRealtimeData();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognitionImpl =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionImpl) {
      const recognition = new SpeechRecognitionImpl();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        const texts = Array.from(event.results)
          .slice(event.resultIndex)
          .map((result) => result[0]?.transcript ?? "")
          .join(" ");
        setTranscript((prev) => `${prev} ${texts}`.trim());
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, []);

  const handleToggle = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition is unavailable in this browser");
      return;
    }
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      setTranscript("");
      recognition.start();
      setListening(true);
    }
  };

  const handleSubmit = () => {
    if (!transcript) return;
    addExpense({
      payerId: "user_001",
      title: transcript.slice(0, 48) || "Voice expense",
      amount: Math.random() * 120 + 20,
      currency: "USD",
      category: "Misc",
      splits: [{ userId: "user_001", amount: Math.random() * 60 + 15 }],
      notes: transcript,
    });
    setTranscript("");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-white">Voice capture</CardTitle>
        <CardDescription>Hands-free expense entry powered by Web Speech API</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          placeholder="Describe your expense and Gemini will structure it for you."
          className="min-h-[160px]"
        />
        <div className="flex items-center gap-2">
          <Button variant={listening ? "default" : "secondary"} className="gap-2" onClick={handleToggle}>
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {listening ? "Stop" : "Start"} listening
          </Button>
          <Button variant="secondary" className="gap-2" onClick={handleSubmit} disabled={!transcript}>
            <Upload className="h-4 w-4" />
            Save expense
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
