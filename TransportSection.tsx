"use client";

import { useState } from "react";
import { Bus, Car, Ticket, AlertTriangle, Sparkles, Navigation, Clock, ShieldAlert } from "lucide-react";

interface Route {
  id: string;
  mode: string;
  fromLocation: string;
  toLocation: string;
  distanceKm: number;
  approxTime: string;
  estimatedFare: string;
  operatingHours: string;
  contactInfo?: string | null;
  tips: string;
}

interface TransportProps {
  transportRoutes: Route[];
  onAskAI: (prompt: string) => void;
}

export default function TransportSection({ transportRoutes, onAskAI }: TransportProps) {
  const [activeTab, setActiveTab] = useState<"routes" | "gondola" | "shikara">("routes");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🚌 Kashmir Transport, Gondola & Travel Guide
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Verified fares, official J&K cable car booking rules, Shikara rates, airport taxi stands, and winter road advisories.
            </p>
          </div>

          {/* Quick Nav Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("routes")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === "routes" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Cab & Taxi Routes
            </button>
            <button
              onClick={() => setActiveTab("gondola")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === "gondola" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              🚡 Gondola Cable Car
            </button>
            <button
              onClick={() => setActiveTab("shikara")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === "shikara" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              🛶 Shikara Rates
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "routes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {transportRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {route.fromLocation} ➔ {route.toLocation}
                      </h3>
                      <p className="text-[11px] text-emerald-300 font-semibold">{route.mode}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-mono">
                    {route.distanceKm} km
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                    <span className="text-white font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> {route.approxTime}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard Fare</span>
                    <span className="text-emerald-300 font-bold mt-0.5 block">{route.estimatedFare}</span>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200 leading-relaxed">
                  <strong className="text-amber-400 block mb-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Travel Advisory:
                  </strong>
                  {route.tips}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Hours: {route.operatingHours}</span>
                <button
                  onClick={() =>
                    onAskAI(
                      `What is the best way to travel from ${route.fromLocation} to ${route.toLocation}? Provide cab options and timings.`
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Ask AI
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gondola Info */}
      {activeTab === "gondola" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Ticket className="w-8 h-8 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Gulmarg Gondola Official Booking Rules & Phases</h3>
              <p className="text-xs text-slate-400">
                Official Asia&apos;s Highest Cable Car ascending from Gulmarg (2,650m) to Apharwat Peak (4,390m).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded uppercase">
                Phase 1: Gulmarg ➔ Kongdoori
              </span>
              <h4 className="text-base font-bold text-white">Altitude: 3,050m</h4>
              <p className="text-slate-300 leading-relaxed">
                Smooth 10-minute scenic ride through dense pine forests to Kongdoori Valley. Ideal for beginners, snow play, and family photos.
              </p>
              <div className="pt-2 text-emerald-300 font-bold">Standard Tariff: ₹740 per person</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 bg-teal-500 text-slate-950 font-bold text-[10px] rounded uppercase">
                Phase 2: Kongdoori ➔ Apharwat Peak
              </span>
              <h4 className="text-base font-bold text-white">Altitude: 4,390m</h4>
              <p className="text-slate-300 leading-relaxed">
                Ascends above tree line into high alpine powder snow facing the Line of Control. Ideal for advanced skiers and snow lovers.
              </p>
              <div className="pt-2 text-teal-300 font-bold">Standard Tariff: ₹950 per person</div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
            <h4 className="text-white font-bold flex items-center gap-1.5 text-sm">
              <ShieldAlert className="w-4 h-4 text-emerald-400" /> How to Avoid Cable Car Scams:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Always book online ONLY at official J&K portal: <strong className="text-emerald-400">gulmarggondola.com</strong></li>
              <li>Do NOT purchase physical tickets from unauthorized agents or touts at the parking lot.</li>
              <li>Bring physical printed tickets and matching government photo ID (Aadhaar/Passport).</li>
            </ul>
          </div>
        </div>
      )}

      {/* Shikara Tariff Info */}
      {activeTab === "shikara" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🛶 Official J&K Tourism Shikara Tariff Card
          </h3>
          <p className="text-slate-400">Approved rate chart for Dal Lake and Nigeen Lake boat rides in Srinagar.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold">1 Hour Standard Ride</span>
              <div className="text-2xl font-bold text-white">₹770</div>
              <p className="text-slate-400">Covers up to 4 passengers per boat. Visits nearby floating markets and Char Chinar view.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-teal-400 font-bold">2 Hours Circuit Ride</span>
              <div className="text-2xl font-bold text-white">₹1,500</div>
              <p className="text-slate-400">Includes Nehru Park, Floating Lotus gardens, Houseboat colonies, and Open Lake sunset point.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold">3 Hours Complete Dal Tour</span>
              <div className="text-2xl font-bold text-white">₹2,200</div>
              <p className="text-slate-400">Includes Early Morning 6 AM Vegetable Market, Old City bridges, Kabutar Khana, and Hazratbal view.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
