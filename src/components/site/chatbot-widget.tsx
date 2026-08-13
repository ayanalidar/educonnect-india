// Floating AI Chatbot Widget — appears on landing + dashboard

"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle, X, Send, Loader2, Sparkles, Bot, User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string; ts: number };

const QUICK_PROMPTS = [
  "What scholarships are available for UK?",
  "How does the AI Course Matcher work?",
  "What's the visa process for Canada?",
  "Tell me about pricing",
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! 👋 I'm EduBot, your AI assistant. Ask me about universities, scholarships, visas, or EduConnect India. How can I help today?", ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [unread, setUnread] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Generate session ID once
    const sid = localStorage.getItem("educonnect-chat-sid") || `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("educonnect-chat-sid", sid);
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!open && messages.length > 1) {
      setUnread((u) => u + 1);
    } else if (open) {
      setUnread(0);
    }
  }, [messages, open]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;
    setSending(true);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg, ts: Date.now() }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, ts: Date.now() }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble responding right now. Please try again or contact us at hello@educonnect.in", ts: Date.now() }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white pl-3 pr-4 h-14 shadow-2xl shadow-orange-500/40 hover:-translate-y-1 transition-all"
          aria-label="Open chat"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <MessageCircle className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold ring-2 ring-[#e85d2f]">
                {unread}
              </span>
            )}
          </span>
          <span className="text-sm font-bold hidden sm:inline">Ask EduBot</span>
          <Sparkles className="h-3.5 w-3.5 hidden sm:inline" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[60] w-[calc(100vw-2.5rem)] sm:w-[380px] h-[600px] max-h-[calc(100vh-2.5rem)] rounded-3xl bg-white shadow-2xl ring-1 ring-orange-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1c1410] to-[#2a1d15] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d2f] to-[#f59e0b]">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#22c55e] ring-2 ring-[#1c1410]" />
              </span>
              <div>
                <div className="text-sm font-bold">EduBot AI</div>
                <div className="text-[10px] text-[#22c55e] font-semibold">● Online · replies instantly</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#fff8f1]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full shrink-0 ${
                      m.role === "user"
                        ? "bg-[#1c1410] text-white"
                        : "bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white"
                    }`}
                  >
                    {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </span>
                  <div
                    className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#1c1410] text-white rounded-br-md"
                        : "bg-white text-[#1c1410] rounded-bl-md ring-1 ring-orange-100"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                  <div className="bg-white rounded-2xl rounded-bl-md px-3 py-2 ring-1 ring-orange-100 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7a6a5d] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7a6a5d] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7a6a5d] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick prompts (only on first message) */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-[#fff8f1]">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-full bg-white ring-1 ring-orange-200 px-2.5 py-1 text-[10px] font-medium text-[#3a2e26] hover:bg-orange-50"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-orange-100 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask me anything…"
              className="flex-1 h-10 rounded-full bg-[#fff8f1] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20"
              disabled={sending}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || sending}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white disabled:opacity-50 hover:-translate-y-0.5 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          {/* Footer */}
          <div className="px-3 py-1.5 bg-[#fff8f1] border-t border-orange-50 text-center">
            <span className="text-[9px] text-[#7a6a5d]">
              Powered by <strong className="text-[#1c1410]">EduConnect India</strong>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
