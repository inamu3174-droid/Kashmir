"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Clock, ExternalLink, Sparkles, Filter } from "lucide-react";

interface Place {
  id: string;
  name: string;
  district: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  bestTime: string;
  openingHours: string;
  officialWebsite?: string | null;
  seasonalInfo?: string | null;
  nearbyAttractions?: string | null;
  imageUrl: string;
}

interface PlacesSectionProps {
  places: Place[];
  onAskAI: (prompt: string) => void;
}

export default function PlacesSection({ places, onAskAI }: PlacesSectionProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalPlace, setActiveModalPlace] = useState<Place | null>(null);

  const districts = ["All", "Srinagar", "Baramulla", "Anantnag", "Ganderbal", "Kupwara", "Bandipora", "Badgam", "Doda"];
  const categories = ["All", "Tourism", "Skiing", "Nature", "Heritage"];

  const filteredPlaces = places.filter((p) => {
    const matchDistrict = selectedDistrict === "All" || p.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchCategory = selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchDistrict && matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🏔️ Explore Kashmir Places & Destinations
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Detailed local insights, best seasons to visit, operating hours, and coordinates.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search places or districts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mr-2">
            <Filter className="w-3.5 h-3.5 text-emerald-400" /> District:
          </div>
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedDistrict === d
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Places Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlaces.map((place) => {
          const nearby: string[] = JSON.parse(place.nearbyAttractions || "[]");

          return (
            <div
              key={place.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Place Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-emerald-500 text-slate-950 shadow-md">
                      {place.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mb-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {place.district} District
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {place.name}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3 text-xs text-slate-300">
                  <p className="line-clamp-3 leading-relaxed text-slate-300">
                    {place.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-400">Best Time:</span>
                      <span className="text-slate-200 font-medium">{place.bestTime}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                      <span className="text-slate-400">Hours:</span>
                      <span className="text-slate-200 font-medium">{place.openingHours}</span>
                    </div>
                  </div>

                  {nearby.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Nearby Highlights:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {nearby.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setActiveModalPlace(place)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() =>
                    onAskAI(
                      `Provide travel tips, hotels, and transport for ${place.name} in ${place.district}.`
                    )
                  }
                  className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Ask AI
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Place Modal */}
      {activeModalPlace && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl space-y-4">
            <div className="relative h-56">
              <img
                src={activeModalPlace.imageUrl}
                alt={activeModalPlace.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <button
                onClick={() => setActiveModalPlace(null)}
                className="absolute top-3 right-3 bg-slate-950/80 hover:bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center border border-slate-700 font-bold"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500 text-slate-950">
                  {activeModalPlace.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {activeModalPlace.name}
                </h3>
                <p className="text-xs text-emerald-300">
                  📍 {activeModalPlace.district} District, Kashmir Valley
                </p>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-300">
              <p className="leading-relaxed text-sm text-slate-200">
                {activeModalPlace.description}
              </p>

              {activeModalPlace.seasonalInfo && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-emerald-300">
                  <span className="font-bold block text-slate-200 mb-0.5">❄️ Seasonal Information:</span>
                  {activeModalPlace.seasonalInfo}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Best Season</span>
                  <span className="text-white font-semibold">{activeModalPlace.bestTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Opening Hours</span>
                  <span className="text-white font-semibold">{activeModalPlace.openingHours}</span>
                </div>
              </div>

              {activeModalPlace.officialWebsite && (
                <div className="pt-2">
                  <a
                    href={activeModalPlace.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline font-semibold"
                  >
                    Official Portal <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setActiveModalPlace(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const place = activeModalPlace;
                  setActiveModalPlace(null);
                  onAskAI(`Tell me about itinerary and transport for ${place.name}.`);
                }}
                className="px-4 py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ask Kashmir AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
