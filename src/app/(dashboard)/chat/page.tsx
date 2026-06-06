"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { sendChatMessage, ChatMessage } from "@/app/actions/ai";
import Link from "next/link";

const SUGGESTIONS = [
  "I'm really stressed about my upcoming mock test",
  "How do I stop comparing myself to my classmates?",
  "I can't focus on studying, what should I do?",
  "I'm feeling burnt out and don't know how to cope",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hey! I'm Menti, your wellness companion 💙\n\nI'm here to listen — whether it's exam stress, feeling overwhelmed, or just needing someone to talk to. What's on your mind today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    const userMsg: ChatMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    startTransition(async () => {
      // Pass history minus the welcome message for cleaner context
      const historyForAI: ChatMessage[] = messages.slice(1).concat(userMsg);
      const reply = await sendChatMessage(historyForAI, trimmed);
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col" style={{ height: "calc(100vh - 180px)" }}>
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg" aria-hidden="true">
          🤖
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Menti — AI Wellness Coach</h1>
          <p className="text-xs text-slate-400">Powered by Gemini · Not a substitute for professional help</p>
        </div>
        <Link href="/dashboard" className="ml-auto text-sm text-slate-400 hover:text-white">
          ← Back
        </Link>
      </div>

      {/* Messages */}
      <div
        className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-4"
        aria-live="polite"
        aria-label="Chat conversation"
        role="log"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "model" && (
              <span className="mr-2 mt-1 text-lg shrink-0" aria-hidden="true">💙</span>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-slate-800 text-slate-100 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isPending && (
          <div className="flex items-center gap-2" aria-label="Menti is typing">
            <span className="text-lg" aria-hidden="true">💙</span>
            <div className="flex gap-1 rounded-2xl bg-slate-800 px-4 py-3">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                  style={{ animationDelay: `${n * 150}ms` }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (only before first user message) */}
      {messages.length === 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 transition hover:border-indigo-500 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-3 flex items-end gap-2">
        <label htmlFor="chat-input" className="sr-only">Message Menti</label>
        <textarea
          ref={inputRef}
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Talk to Menti… (Enter to send, Shift+Enter for newline)"
          rows={2}
          maxLength={1000}
          disabled={isPending}
          className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isPending || !input.trim()}
          aria-label="Send message"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:opacity-40"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M3.105 3.105a1 1 0 011.318-.08l12 8a1 1 0 010 1.65l-12 8a1 1 0 01-1.47-.89V11.5l7.25-1.5L2.952 8.5V4.875a1 1 0 01.153-.77z" />
          </svg>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="mt-2 text-center text-xs text-slate-600">
        Menti is an AI — not a therapist. For crisis support call iCall{" "}
        <a href="tel:9152987821" className="text-slate-500 hover:text-slate-300">9152987821</a>
      </p>
    </div>
  );
}
