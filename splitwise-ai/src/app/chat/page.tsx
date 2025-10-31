"use client";

import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bot, User, Loader2 } from "lucide-react";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import type { AiMessage } from "@/types";
import { toast } from "@/components/ui/sonner";

export default function ChatPage() {
  const { groups, expenses } = useRealtimeData();
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: "initial",
      role: "assistant",
      content:
        "Hey Jordan! I'm your Gemini copilot. Ask about balances, spending patterns, or request reports.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    const userMessage: AiMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [...messages, userMessage],
          groups,
          expenses,
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch response");
      const assistantMessage = (await response.json()) as AiMessage;
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast.error("Gemini is offline. Try again soon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  return (
    <AppShell>
      <div className="col-span-2 flex flex-col gap-6 xl:col-span-1">
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Bot className="h-5 w-5" /> Gemini conversation
            </CardTitle>
            <CardDescription>
              Get proactive coaching: settlements, budgets, insights, and multilingual advice.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-full flex-col gap-4">
            <div ref={listRef} className="flex h-[520px] flex-col gap-3 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "assistant"
                      ? "ml-auto max-w-[80%] rounded-3xl bg-white/15 p-4 text-sm text-white"
                      : "mr-auto max-w-[80%] rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white"
                  }
                >
                  <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-white/60">
                    {message.role === "assistant" ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {message.role === "assistant" ? "Gemini" : "You"}
                  </div>
                  <p>{message.content}</p>
                </div>
              ))}
              {loading && (
                <div className="ml-auto flex items-center gap-2 rounded-3xl bg-white/10 px-4 py-3 text-sm text-white/70">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gemini is composing…
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask for a budget summary, settlement plan, or travel itinerary insights."
                className="min-h-[120px]"
              />
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="outline">Context aware</Badge>
                <Button className="gap-2" onClick={handleSend} disabled={loading}>
                  <Sparkles className="h-4 w-4" /> Send to Gemini
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Prompt playground</CardTitle>
            <CardDescription>Examples tuned for finance, travel, and lifestyle scenarios.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-white/70">
            <button
              className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
              onClick={() => setInput("Generate a multilingual trip report for Lisbon Escape with savings tips.")}
            >
              Generate a multilingual trip report for Lisbon Escape with savings tips.
            </button>
            <button
              className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
              onClick={() => setInput("How can we settle Mission Loft balances in the fewest payments?")}
            >
              How can we settle Mission Loft balances in the fewest payments?
            </button>
            <button
              className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
              onClick={() => setInput("Create a monthly budget plan and detect categories trending above target.")}
            >
              Create a monthly budget plan and detect categories trending above target.
            </button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
