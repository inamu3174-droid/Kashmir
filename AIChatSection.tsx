"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Volume2, Globe, CheckCircle2, ShieldCheck, RefreshCw, Compass, ArrowRight, User, Bot, HelpCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  language?: "en" | "ur" | "ks";
  sources?: { name: string; url?: string; category: string }[];
  toolsUsed?: string[];
  suggestedFollowups?: string[];
  timestamp: string;
}

interface AIChatSectionProps {
  initialPrompt?: string;
  onClearPrompt?: () => void;
}

export default function AIChatSection({ initialPrompt, onClearPrompt }: AIChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      role: "assistant",
      content: `🌸 **بلاے ما لَیو! Welcome to Kashmir AI.**\n\n` +
        `I am your intelligent assistant for the Kashmir Valley. Ask me anything about places, tourism, real-time weather, Gondola tickets, local businesses, authentic Wazwan, or transport fares.\n\n` +
        `*Try selecting a prompt below or type in English, Urdu (اردو), or Kashmiri (کٲشُر)!*`,
      language: "en",
      sources: [
        { name: "J&K Tourism Official Portal", url: "https://jk-tourism.gov.in", category: "Official Authority" },
        { name: "IMD Kashmir Meteorological Department", category: "Live Weather" }
      ],
      toolsUsed: ["Knowledge_RAG_Engine", "Weather_Database"],
      suggestedFollowups: [
        "What is the weather in Gulmarg today?",
        "Where can I get authentic Kashmiri Wazwan in Srinagar?",
        "How do I book Gulmarg Gondola tickets online?",
        "What are the best places in Pahalgam?"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"en" | "ur" | "ks">("en");
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
      if (onClearPrompt) onClearPrompt();
    }
  }, [initialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, language: selectedLang }),
      });

      const data = await res.json();

      if (res.ok) {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.response,
          language: data.language || selectedLang,
          sources: data.sources || [],
          toolsUsed: data.toolsUsed || [],
          suggestedFollowups: data.suggestedFollowups || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(data.error || "Failed to get AI response");
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ Sorry, I encountered an issue retrieving real-time Kashmir data. Please try again. (${error.message})`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string, msgId: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for natural speech
    const clean = text.replace(/[*_#•]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const quickPrompts = [
    { label: "🏔️ Gulmarg Weather & Snow", prompt: "What is the weather and snow condition in Gulmarg right now?" },
    { label: "🚡 Gondola Booking Guide", prompt: "How do I book tickets for Gulmarg Gondola Phase 1 & Phase 2?" },
    { label: "🍲 Best Wazwan in Srinagar", prompt: "Find me the best authentic Wazwan restaurants in Srinagar with ratings." },
    { label: "🚕 Airport Cab Tariffs", prompt: "What is the cab fare from Srinagar Airport to Pahalgam and Gulmarg?" },
    { label: "🧣 Authentic Pashmina Guide", prompt: "How do I verify pure 100% Pashmina shawls in Srinagar markets?" },
    { label: "🎓 Kashmir Universities", prompt: "What are the top universities and youth schemes in Kashmir?" },
  ];

  return (
    <div className="flex flex-col h-[700px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 bg-slate-800/90 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base tracking-tight">Kashmir AI Assistant</h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                v1.0 Live
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Local Knowledge & Tool Reasoning Engine
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-slate-950/60 border border-slate-700/80 p-1 rounded-xl text-xs">
          <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1.5" />
          <button
            onClick={() => setSelectedLang("en")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedLang === "en" ? "bg-emerald-500 text-slate-950 font-bold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLang("ur")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedLang === "ur" ? "bg-emerald-500 text-slate-950 font-bold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            اردو (Urdu)
          </button>
          <button
            onClick={() => setSelectedLang("ks")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedLang === "ks" ? "bg-emerald-500 text-slate-950 font-bold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            کٲشُر (Kashmiri)
          </button>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
        <span className="text-slate-400 text-[11px] font-medium whitespace-nowrap flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> Quick Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            className="px-3 py-1 bg-slate-800/80 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-slate-700/70 text-slate-300 hover:text-emerald-300 rounded-full font-medium transition-all whitespace-nowrap flex-shrink-0"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-slate-950/30">
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md ${
                  isUser
                    ? "bg-slate-700 text-white border border-slate-600"
                    : "bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 border border-emerald-300"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Box */}
              <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                      : "bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-none"
                  } ${msg.language === "ks" || msg.language === "ur" ? "font-serif text-base" : ""}`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Audio / Listen Button for Assistant */}
                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      <button
                        onClick={() => speakText(msg.content, msg.id)}
                        className="flex items-center gap-1.5 px-2 py-1 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 rounded-md transition-colors text-[11px]"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isSpeaking === msg.id ? "text-emerald-400 animate-bounce" : ""}`} />
                        {isSpeaking === msg.id ? "Stop Speaking" : "Listen Audio"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Assistant Tools & Sources Badges */}
                {!isUser && (msg.sources?.length || msg.toolsUsed?.length) ? (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs space-y-2 backdrop-blur-xs">
                    {/* Tools Used */}
                    {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Tools Called:
                        </span>
                        {msg.toolsUsed.map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-mono"
                          >
                            ⚡ {tool}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Sources & Citations */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-slate-800/80">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Citations:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                            >
                              📌 {src.name} <span className="text-[9px] text-emerald-400">({src.category})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Suggested Followups */}
                {!isUser && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedFollowups.map((sf, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sf)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 px-3 py-1 rounded-full border border-slate-700/80 transition-all flex items-center gap-1"
                      >
                        {sf} <ArrowRight className="w-3 h-3 text-emerald-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700 px-4 py-3 rounded-2xl rounded-tl-none text-xs text-slate-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              Kashmir AI is reasoning, querying local databases & weather stations...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-slate-800/90 border-t border-slate-700/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedLang === "ks"
                ? "کَشِیرِ مُتعلِق سوال پرِیو (Ask in Kashmiri, Urdu, or English)..."
                : selectedLang === "ur"
                ? "کشمیر سے متعلق اپنا سوال یہاں لکھیں..."
                : "Ask Kashmir AI about weather, places, hotels, transport, or Wazwan..."
            }
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-700/80 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 transition-all"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
