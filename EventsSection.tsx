"use client";

import { Calendar, MapPin, Sparkles, Tag, Users } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  category: string;
  district: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  organizer: string;
  contact?: string | null;
  imageUrl?: string | null;
  status: string;
}

interface EventsProps {
  events: EventItem[];
  onAskAI: (prompt: string) => void;
}

export default function EventsSection({ events, onAskAI }: EventsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎉 Kashmir Festivals, Events & Cultural Notices
        </h2>
        <p className="text-xs text-slate-400">
          Official schedule for Tulip Festival, Snow Sports Carnivals, Saffron Harvest, and Artisan Heritage Expos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500 text-slate-950">
                    {evt.category}
                  </span>
                  <h3 className="font-bold text-white text-base mt-1.5 leading-snug">{evt.title}</h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                    evt.status === "ongoing"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  {evt.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-400">Dates:</span>
                  <span className="font-semibold text-white">
                    {evt.startDate} to {evt.endDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-white">
                    {evt.location} ({evt.district})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-400">Organizer:</span>
                  <span className="text-slate-300 font-medium">
                    {evt.organizer} {evt.contact ? `(${evt.contact})` : ""}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                onAskAI(`Give me dates, entry details, and travel tips for ${evt.title} in Kashmir.`)
              }
              className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Ask AI About Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
