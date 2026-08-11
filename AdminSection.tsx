"use client";

import { useState } from "react";
import { Database, Trash2, Plus, ShieldCheck, RefreshCw, Layers, MapPin, Building2, Calendar, Bus } from "lucide-react";

interface AdminProps {
  places: any[];
  businesses: any[];
  events: any[];
  transport: any[];
  weather: any[];
  onRefreshAll: () => void;
}

export default function AdminSection({
  places,
  businesses,
  events,
  transport,
  weather,
  onRefreshAll,
}: AdminProps) {
  const [activeTab, setActiveTab] = useState<"places" | "businesses" | "events" | "transport" | "weather">("places");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (table: string, id: string) => {
    if (!confirm(`Are you sure you want to delete item ID ${id} from ${table}?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin?table=${table}&id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("✅ Item successfully removed from Kashmir Knowledge Base.");
        onRefreshAll();
      } else {
        alert("Failed to delete item.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                ⚙️ Kashmir AI System Admin Dashboard
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                Knowledge Control Center
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Directly control and update local facts, tourism places, business listings, event schedules, and transport fares.
            </p>
          </div>

          <button
            onClick={onRefreshAll}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" /> Refresh System Knowledge
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("places")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "places" ? "bg-emerald-500 text-slate-950 shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <MapPin className="w-4 h-4" /> Places ({places.length})
          </button>
          <button
            onClick={() => setActiveTab("businesses")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "businesses" ? "bg-emerald-500 text-slate-950 shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Building2 className="w-4 h-4" /> Businesses ({businesses.length})
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "events" ? "bg-emerald-500 text-slate-950 shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Calendar className="w-4 h-4" /> Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("transport")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "transport" ? "bg-emerald-500 text-slate-950 shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Bus className="w-4 h-4" /> Transport ({transport.length})
          </button>
        </div>
      </div>

      {/* Admin Table View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 font-bold text-white text-sm flex items-center justify-between">
          <span className="capitalize">{activeTab} Knowledge Database</span>
          <span className="text-xs text-slate-400 font-normal">Active PostgreSQL Schema</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">ID / Name</th>
                <th className="p-3">District / Location</th>
                <th className="p-3">Category / Mode</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {activeTab === "places" &&
                places.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{p.name}</td>
                    <td className="p-3">{p.district}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20 font-bold">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete("places", p.id)}
                        disabled={deletingId === p.id}
                        className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded font-medium flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}

              {activeTab === "businesses" &&
                businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{b.name}</td>
                    <td className="p-3">{b.location}, {b.district}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-teal-500/10 text-teal-300 rounded border border-teal-500/20 font-bold">
                        {b.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete("businesses", b.id)}
                        disabled={deletingId === b.id}
                        className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded font-medium flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}

              {activeTab === "events" &&
                events.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{e.title}</td>
                    <td className="p-3">{e.district}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20 font-bold">
                        {e.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete("events", e.id)}
                        disabled={deletingId === e.id}
                        className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded font-medium flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}

              {activeTab === "transport" &&
                transport.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">
                      {t.fromLocation} ➔ {t.toLocation}
                    </td>
                    <td className="p-3">{t.distanceKm} km (~{t.approxTime})</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20 font-bold">
                        {t.mode}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete("transport", t.id)}
                        disabled={deletingId === t.id}
                        className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded font-medium flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
