"use client";

import { useState } from "react";
import { MapPin, Navigation, Info, ExternalLink, Sparkles, Compass } from "lucide-react";

interface PlacePin {
  id: string;
  name: string;
  district: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  imageUrl: string;
  bestTime: string;
}

interface MapProps {
  places: PlacePin[];
  onSelectPlace?: (place: PlacePin) => void;
  onAskAI?: (prompt: string) => void;
}

export default function KashmirMap({ places, onSelectPlace, onAskAI }: MapProps) {
  const [selectedPlace, setSelectedPlace] = useState<PlacePin | null>(places[0] || null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const categories = ["All", "Tourism", "Skiing", "Nature", "Heritage"];

  const filteredPlaces = places.filter(p => 
    categoryFilter === "All" || p.category.toLowerCase() === categoryFilter.toLowerCase()
  );

  // Map viewport bounds roughly covering Kashmir Valley (Lat 33.0 to 34.8, Lng 74.0 to 75.8)
  const getMapXY = (lat: number, lng: number) => {
    // Convert Lat/Lng to % offsets inside container box
    const minLat = 33.2;
    const maxLat = 34.8;
    const minLng = 73.9;
    const maxLng = 75.8;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100; // inverted Y

    return {
      x: Math.max(5, Math.min(92, x)),
      y: Math.max(5, Math.min(92, y)),
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100">
      {/* Top Header & Filter Controls */}
      <div className="p-4 bg-slate-800/80 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400 animate-spin-slow" />
          <h3 className="font-semibold text-white tracking-wide">Interactive Kashmir Valley Map</h3>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
            10 Main Districts
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === cat
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[480px]">
        {/* Visual Kashmir Map Canvas */}
        <div className="lg:col-span-2 relative min-h-[380px] bg-slate-950 p-4 overflow-hidden flex items-center justify-center">
          {/* Topographic valley background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-slate-950 opacity-90" />
          
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Mountain contour decor */}
            <path d="M 100,200 Q 200,100 350,180 T 600,150 T 800,220" fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 50,300 Q 250,220 400,280 T 700,230" fill="none" stroke="#0284c7" strokeWidth="1.5" />
          </svg>

          {/* Valley Landmarks & Region Labels */}
          <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700/60 rounded-lg p-2.5 text-[11px] text-slate-300 backdrop-blur-sm z-10 shadow-lg">
            <div className="flex items-center gap-1.5 font-bold text-white mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Kashmir Valley GIS Grid
            </div>
            <div>Center: 34.0837° N, 74.7973° E</div>
            <div className="text-slate-400">Elevation: 1,580m - 4,390m</div>
          </div>

          {/* Map Pins */}
          <div className="relative w-full h-[400px] border border-slate-800/80 rounded-xl bg-slate-900/50 backdrop-blur-xs overflow-hidden">
            {filteredPlaces.map(place => {
              const pos = getMapXY(place.lat, place.lng);
              const isSelected = selectedPlace?.id === place.id;

              return (
                <div
                  key={place.id}
                  onClick={() => {
                    setSelectedPlace(place);
                    if (onSelectPlace) onSelectPlace(place);
                  }}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Pin Circle with Ripple effect when selected */}
                  <div className="relative flex items-center justify-center">
                    {isSelected && (
                      <span className="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping" />
                    )}
                    <div
                      className={`p-2 rounded-full border shadow-xl transition-all transform group-hover:scale-110 ${
                        isSelected
                          ? "bg-emerald-500 border-white text-slate-950 scale-110 shadow-emerald-500/50"
                          : "bg-slate-800/90 border-emerald-400 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950"
                      }`}
                    >
                      <MapPin className="w-4 h-4 fill-current" />
                    </div>
                  </div>

                  {/* Pin Title Label */}
                  <div
                    className={`mt-1 whitespace-nowrap text-[11px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md shadow-md transition-all ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 border-white"
                        : "bg-slate-900/90 text-slate-200 border-slate-700/80 group-hover:text-white"
                    }`}
                  >
                    {place.name.split(" ")[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Place Details Card */}
        <div className="p-5 bg-slate-800/50 border-t lg:border-t-0 lg:border-l border-slate-700/60 flex flex-col justify-between">
          {selectedPlace ? (
            <div className="space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden border border-slate-700 shadow-md group">
                <img
                  src={selectedPlace.imageUrl}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-500/90 text-slate-950">
                    {selectedPlace.category}
                  </span>
                  <h4 className="text-lg font-bold text-white leading-tight mt-1">
                    {selectedPlace.name}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium">
                    📍 {selectedPlace.district} District, Kashmir
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p className="leading-relaxed text-slate-300 line-clamp-3">
                  {selectedPlace.description}
                </p>

                <div className="pt-2 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-medium">Best Season</span>
                    <span className="text-emerald-300 font-semibold">{selectedPlace.bestTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Coordinates</span>
                    <span className="text-slate-200 font-mono">
                      {selectedPlace.lat.toFixed(2)}°N, {selectedPlace.lng.toFixed(2)}°E
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick AI Trigger Button */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    if (onAskAI) {
                      onAskAI(`Tell me everything about ${selectedPlace.name} in ${selectedPlace.district}, including travel advice, hotels, and best time to visit.`);
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Ask Kashmir AI About {selectedPlace.name.split(" ")[0]}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-6">
              <Info className="w-8 h-8 text-emerald-400 mb-2" />
              <p className="text-xs">Click any pin on the Kashmir Valley map to explore detailed local insights.</p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Verified J&K Coordinates</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Navigation className="w-3 h-3" /> Live Route Data
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
