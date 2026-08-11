"use client";

import { useState, useEffect } from "react";
import { Sparkles, Compass, MapPin, Building2, Bus, CloudSnow, GraduationCap, Calendar, Settings, Phone, ShieldCheck, ArrowRight, MessageSquare } from "lucide-react";
import KashmirMap from "@/components/KashmirMap";
import AIChatSection from "@/components/AIChatSection";
import PlacesSection from "@/components/PlacesSection";
import BusinessDirectorySection from "@/components/BusinessDirectorySection";
import TransportSection from "@/components/TransportSection";
import WeatherSection from "@/components/WeatherSection";
import EducationSection from "@/components/EducationSection";
import EventsSection from "@/components/EventsSection";
import AdminSection from "@/components/AdminSection";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "chat" | "places" | "map" | "businesses" | "transport" | "weather" | "education" | "events" | "admin"
  >("chat");

  const [aiPrompt, setAiPrompt] = useState<string>("");

  // Data states
  const [places, setPlaces] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [transport, setTransport] = useState<any[]>([]);
  const [weather, setWeather] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchAllData = async () => {
    setIsLoadingData(true);
    try {
      const [pRes, bRes, eRes, tRes, wRes] = await Promise.all([
        fetch("/api/places").then((r) => r.json()),
        fetch("/api/businesses").then((r) => r.json()),
        fetch("/api/events").then((r) => r.json()),
        fetch("/api/transport").then((r) => r.json()),
        fetch("/api/weather").then((r) => r.json()),
      ]);

      if (pRes.places) setPlaces(pRes.places);
      if (bRes.businesses) setBusinesses(bRes.businesses);
      if (eRes.events) setEvents(eRes.events);
      if (tRes.transport) setTransport(tRes.transport);
      if (wRes.weather) setWeather(wRes.weather);
    } catch (err) {
      console.error("Failed to load Kashmir platform data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAskAI = (prompt: string) => {
    setAiPrompt(prompt);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* Emergency Helpline & Live Ticker Bar */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/60 py-1.5 px-4 text-[11px] text-emerald-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase">
            Live Kashmir Status
          </span>
          <span className="flex items-center gap-1 font-mono">
            🌡️ Srinagar: 4°C | Gulmarg: -5°C (Snowing) | Pahalgam: -1°C
          </span>
        </div>

        <div className="flex items-center gap-4 text-emerald-300 font-medium">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-emerald-400" /> J&K Tourist Helpline: 1800-180-7193
          </span>
          <span className="hidden sm:inline-block text-emerald-400 font-mono">|</span>
          <span className="hidden sm:inline-block">Gondola Status: Operational</span>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("chat")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">KASHMIR AI</h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Valley Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Digital Assistant for Kashmir Tourism, Places, Business & Local Life
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "chat"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Sparkles className="w-4 h-4" /> AI Assistant
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "map"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Compass className="w-4 h-4" /> Interactive Map
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none border-t border-slate-800/80">
          <nav className="flex items-center gap-1 py-2 text-xs font-medium min-w-max">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "chat"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" /> 🤖 AI Assistant
            </button>

            <button
              onClick={() => setActiveTab("places")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "places"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <MapPin className="w-4 h-4" /> 🏔️ Explore Places ({places.length})
            </button>

            <button
              onClick={() => setActiveTab("map")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "map"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Compass className="w-4 h-4" /> 🗺️ Kashmir Map
            </button>

            <button
              onClick={() => setActiveTab("businesses")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "businesses"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" /> 🏨 Local Businesses ({businesses.length})
            </button>

            <button
              onClick={() => setActiveTab("transport")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "transport"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Bus className="w-4 h-4" /> 🚌 Transport & Gondola
            </button>

            <button
              onClick={() => setActiveTab("weather")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "weather"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <CloudSnow className="w-4 h-4" /> 🌦️ Weather & Seasons
            </button>

            <button
              onClick={() => setActiveTab("education")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "education"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> 🎓 Education & Jobs
            </button>

            <button
              onClick={() => setActiveTab("events")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "events"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" /> 🎉 Events ({events.length})
            </button>

            <button
              onClick={() => setActiveTab("admin")}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "admin"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" /> ⚙️ Admin Dashboard
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Quick Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950 border-b border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              🏔️ Discover & Navigate Kashmir with AI
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Instant accurate answers on Srinagar, Gulmarg, Pahalgam, Sonamarg, Gurez, local Wazwan, Gondola cable car passes, weather, and business directory. Powered by Kashmir AI.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => handleAskAI("What is the weather in Gulmarg today?")}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 border border-slate-700/80 text-emerald-300 font-medium transition-all"
            >
              🌦️ Gulmarg Weather
            </button>
            <button
              onClick={() => handleAskAI("Find luxury houseboats on Dal Lake Srinagar")}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 border border-slate-700/80 text-emerald-300 font-medium transition-all"
            >
              🛶 Dal Lake Houseboats
            </button>
            <button
              onClick={() => handleAskAI("How do I book tickets for Gulmarg Gondola?")}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 border border-slate-700/80 text-emerald-300 font-medium transition-all"
            >
              🚡 Gondola Guide
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === "chat" && (
          <AIChatSection
            initialPrompt={aiPrompt}
            onClearPrompt={() => setAiPrompt("")}
          />
        )}

        {activeTab === "places" && (
          <PlacesSection places={places} onAskAI={handleAskAI} />
        )}

        {activeTab === "map" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
              <h2 className="text-lg font-bold text-white mb-1">🗺️ Kashmir Valley Interactive Map</h2>
              <p className="text-xs text-slate-400">
                Click any destination pin to open geographical coordinates, travel highlights, and ask Kashmir AI for custom itineraries.
              </p>
            </div>
            <KashmirMap places={places} onAskAI={handleAskAI} />
          </div>
        )}

        {activeTab === "businesses" && (
          <BusinessDirectorySection
            businesses={businesses}
            onRefresh={fetchAllData}
            onAskAI={handleAskAI}
          />
        )}

        {activeTab === "transport" && (
          <TransportSection transportRoutes={transport} onAskAI={handleAskAI} />
        )}

        {activeTab === "weather" && (
          <WeatherSection weatherList={weather} onAskAI={handleAskAI} />
        )}

        {activeTab === "education" && (
          <EducationSection onAskAI={handleAskAI} />
        )}

        {activeTab === "events" && (
          <EventsSection events={events} onAskAI={handleAskAI} />
        )}

        {activeTab === "admin" && (
          <AdminSection
            places={places}
            businesses={businesses}
            events={events}
            transport={transport}
            weather={weather}
            onRefreshAll={fetchAllData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-slate-900 border-t border-slate-800 py-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-sm">Kashmir AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Empowering people and travelers in the Kashmir Valley with AI assistance, verified local directory, transport tariffs, and meteorological advice.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2 uppercase text-[11px] tracking-wider">Top Destinations</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Srinagar & Dal Lake</li>
              <li>• Gulmarg Ski Slopes & Gondola</li>
              <li>• Pahalgam & Betaab Valley</li>
              <li>• Sonamarg & Thajiwas Glacier</li>
              <li>• Gurez Valley & Dawar</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2 uppercase text-[11px] tracking-wider">Languages Supported</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• English (Full Detailed Insights)</li>
              <li>• Urdu / اردو (Nastaliq & Standard)</li>
              <li>• Kashmiri / کٲشُر (Authentic Dual Script)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2 uppercase text-[11px] tracking-wider">Verified Sources</h4>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>• J&K Directorate of Tourism</li>
              <li>• IMD Weather Observatory Srinagar</li>
              <li>• Gulmarg Gondola Board</li>
              <li>• Kashmir Chamber of Commerce</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span>© 2025 Kashmir AI Platform. Respectfully built for the Kashmir Valley.</span>
          <span className="text-emerald-400 font-mono">Status: All Systems & Databases Operational</span>
        </div>
      </footer>
    </div>
  );
}
