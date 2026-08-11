"use client";

import { useState } from "react";
import { CloudSnow, Thermometer, Wind, Droplets, AlertCircle, Sparkles, Snowflake, Sun } from "lucide-react";

interface Weather {
  id: string;
  district: string;
  tempC: number;
  condition: string;
  humidity: number;
  windKmh: number;
  snowChance: number;
  advisory: string;
  seasonContext: string;
}

interface WeatherProps {
  weatherList: Weather[];
  onAskAI: (prompt: string) => void;
}

export default function WeatherSection({ weatherList, onAskAI }: WeatherProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");

  const filteredWeather = weatherList.filter(
    (w) => selectedDistrict === "All" || w.district.toLowerCase() === selectedDistrict.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Weather Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                🌦️ Kashmir Valley Real-time Weather & Seasonal Guide
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Live Station Data
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live district temperatures, snowfall probabilities, mountain advisories, and Chilla-i-Kalan winter advice.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedDistrict("All")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedDistrict === "All" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300"
              }`}
            >
              All Districts
            </button>
            {weatherList.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedDistrict(w.district)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedDistrict === w.district
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {w.district}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* District Weather Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWeather.map((w) => (
          <div
            key={w.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{w.district} District</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    {w.condition.toLowerCase().includes("snow") ? (
                      <Snowflake className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {w.condition}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-white font-mono">{w.tempC}°C</div>
                  <span className="text-[10px] text-slate-400">Current Temp</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 block">Humidity</span>
                  <span className="font-bold text-white">{w.humidity}%</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <Wind className="w-3.5 h-3.5 text-teal-400 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 block">Wind</span>
                  <span className="font-bold text-white">{w.windKmh} km/h</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <CloudSnow className="w-3.5 h-3.5 text-cyan-300 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 block">Snow Chance</span>
                  <span className="font-bold text-emerald-400">{w.snowChance}%</span>
                </div>
              </div>

              {/* Advisory Box */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Official Advisory:
                </span>
                <p className="leading-relaxed">{w.advisory}</p>
              </div>

              <p className="text-[11px] text-slate-400 italic">❄️ {w.seasonContext}</p>
            </div>

            <button
              onClick={() =>
                onAskAI(`What clothes should I pack for ${w.district} given temperature is ${w.tempC}°C and ${w.condition}?`)
              }
              className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Ask AI Clothing Advice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
