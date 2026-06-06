"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { sendChatMessage, ChatMessage } from "@/app/actions/ai";
import { HELPLINES } from "@/lib/constants";

const SUGGESTIONS = [
  "I'm really stressed about my mock test",
  "How do I stop comparing myself to classmates?",
  "I can't focus on studying today",
  "I'm feeling burnt out — help",
];

interface Message extends ChatMessage {
  id: number;
}

export default function ChatPage() {
  const [messages, setMessages]       = useState<Message[]>([{
    id: 0,
    role: "model",
    text: "Hey! I'm Mentice AI Coach 💙\n\nI'm here to listen — exam stress, feeling overwhelmed, or just needing someone to talk to. What's on your mind?",
  }]);
  const [input, setInput]             = useState("");
  const [isPending, startTransition]  = useTransition();
  const [distressDetected, setDistress] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef     = useRef(1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    const userMsg: Message = { id: idRef.current++, role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    startTransition(async () => {
      const historyForAI: ChatMessage[] = messages.slice(1).map(({ role, text }) => ({ role, text })).concat({ role: "user", text: trimmed });
      const { text: reply, distress } = await sendChatMessage(historyForAI, trimmed);

      if (distress) setDistress(true);
      setMessages((prev) => [...prev, { id: idRef.current++, role: "model", text: reply }]);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col" style={{ height: "calc(100vh - 130px)" }}>

      {/* ── Header ── */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-xl shadow-sm" aria-hidden="true">
          🧠
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900">Mentice AI Coach</h1>
          <p className="text-xs text-slate-400">Powered by Gemini · Not a substitute for professional help</p>
        </div>
      </div>

      {/* ── Distress banner — appears when triggered ── */}
      {distressDetected && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 p-4"
        >
          <p className="mb-2 text-sm font-bold text-rose-700">
            💛 You&apos;re not alone — please reach out right now
          </p>
          <p className="mb-3 text-xs text-rose-600 leading-relaxed">
            Trained counsellors are available. A 2-minute call can make a real difference.
          </p>
          <ul className="space-y-1.5">
            {HELPLINES.map((h) => (
              <li key={h.name} className="flex items-center justify-between rounded-xl border border-rose-200 bg-white px-3 py-2">
                <div>
                  <span className="text-sm font-semibold text-slate-800">{h.name}</span>
                  <span className="ml-2 text-xs text-slate-400">{h.desc}</span>
                </div>
                <a
                  href={`tel:${h.number.replace(/-/g, "")}`}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-rose-700"
                  aria-label={`Call ${h.name} at ${h.number}`}
                >
                  📞 {h.number}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setDistress(false)}
            className="mt-2 text-xs text-rose-400 hover:text-rose-600"
            aria-label="Dismiss helpline panel"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Messages ── */}
      <div
        className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        aria-live="polite"
        aria-label="Chat with Mentice AI Coach"
        role="log"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "model" && (
              <div className="mr-2 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm shadow-sm" aria-hidden="true">🧠</div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.role === "user"
                  ? "rounded-br-sm bg-indigo-600 text-white"
                  : "rounded-bl-sm bg-slate-100 text-slate-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isPending && (
          <div className="flex items-center gap-2" aria-label="Mentice AI Coach is typing">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-sm" aria-hidden="true">🧠</div>
            <div className="flex gap-1.5 rounded-2xl bg-slate-100 px-4 py-3">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"
                  style={{ animationDelay: `${n * 150}ms` }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick suggestions (first message only) ── */}
      {messages.length === 1 && !isPending && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <div className="mt-3 flex items-end gap-2">
        <label htmlFor="chat-input" className="sr-only">Message Mentice AI Coach</label>
        <textarea
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Talk to Mentice AI Coach… (Enter to send, Shift+Enter for newline)"
          rows={2}
          maxLength={1000}
          disabled={isPending}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200 disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isPending || !input.trim()}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-40"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 rotate-90" aria-hidden="true">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>

      {/* ── Passive helpline footer ── */}
      <p className="mt-2 text-center text-xs text-slate-400">
        Crisis support 24/7:{" "}
        <a href="tel:9152987821" className="text-rose-500 hover:underline font-medium">iCall 9152987821</a>
        {" · "}
        <a href="tel:18602662345" className="text-rose-500 hover:underline font-medium">Vandrevala 1860-2662-345</a>
      </p>
    </div>
  );
}
