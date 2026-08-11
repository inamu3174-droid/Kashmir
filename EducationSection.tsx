"use client";

import { useState } from "react";
import { GraduationCap, Award, BookOpen, Briefcase, Sparkles, Building2, CheckCircle2 } from "lucide-react";

interface EducationProps {
  onAskAI: (prompt: string) => void;
}

export default function EducationSection({ onAskAI }: EducationProps) {
  const universities = [
    {
      name: "University of Kashmir (KU)",
      location: "Hazratbal, Srinagar",
      category: "Central / State University",
      established: "1948",
      description: "NAAC A+ accredited premier research university offering degrees in Engineering, Law, Pharmacy, Humanities, and Natural Sciences.",
      highlights: ["Sir Syed Chair", "Center for Kashmiri Language & Culture", "South & North Campuses"],
    },
    {
      name: "National Institute of Technology (NIT Srinagar)",
      location: "Hazratbal, Srinagar",
      category: "Institute of National Importance",
      established: "1960",
      description: "Premier engineering technology institution with B.Tech, M.Tech, and Ph.D. programs across Civil, Computer Science, and Electrical fields.",
      highlights: ["TBI Innovation Center", "Placement Cell", "World-class Labs"],
    },
    {
      name: "Islamic University of Science & Technology (IUST)",
      location: "Awantipora, Pulwama",
      category: "State University",
      established: "2005",
      description: "Rapidly growing university specializing in Computer Science, Food Technology, Journalism, and Design Innovation.",
      highlights: ["Design Innovation Center", "International Collaborations", "Food Tech Labs"],
    },
    {
      name: "SKUAST Kashmir",
      location: "Shalimar, Srinagar",
      category: "Agricultural & Saffron Research University",
      established: "1982",
      description: "Leading agricultural sciences research university pioneering Saffron biotechnology, Apple horticulture, and High-altitude veterinary research.",
      highlights: ["Saffron Research Station Pampore", "Horticulture Incubation", "Organic Farming Grants"],
    },
  ];

  const schemes = [
    {
      title: "Mission Youth J&K Startup & Tejaswini Grant",
      type: "Youth Financial Scheme",
      benefit: "Financial assistance up to ₹5 Lakhs for women entrepreneurs and young Kashmir innovators.",
      eligibility: "Residents of J&K aged 18-35 years",
    },
    {
      title: "Handicraft Artisan Apprentice Stipend Scheme",
      type: "Craft Skill Grant",
      benefit: "Monthly stipend of ₹2,000 for training in Pashmina spinning, Kani shawl weaving, and Khatamband woodwork.",
      eligibility: "Artisans & interested youth across all Kashmir districts",
    },
    {
      title: "Special Scholarship Scheme for J&K (SSSJK)",
      type: "Student Scholarship",
      benefit: "Full tuition fee & hostel allowance for pursuing undergraduate degrees across India.",
      eligibility: "Students passing Class 12th from J&K State Board / CBSE",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎓 Education, Youth Opportunities & Artisan Schemes
        </h2>
        <p className="text-xs text-slate-400">
          Comprehensive directory of Kashmir universities, research institutions, youth startup grants, and skill apprenticeships.
        </p>
      </div>

      {/* Universities Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" /> Key Universities & Academic Institutions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universities.map((uni, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{uni.name}</h4>
                    <p className="text-xs text-emerald-300 font-medium">{uni.location}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                    Est. {uni.established}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{uni.description}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {uni.highlights.map((h, hIdx) => (
                    <span
                      key={hIdx}
                      className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() =>
                  onAskAI(`Tell me about admission procedures and programs at ${uni.name} in Kashmir.`)
                }
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Ask AI About Admissions
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Youth Schemes */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-teal-400" /> Youth Startup & Artisan Skill Schemes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schemes.map((s, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2 text-xs"
            >
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded text-[10px]">
                {s.type}
              </span>
              <h4 className="font-bold text-white text-sm mt-1">{s.title}</h4>
              <p className="text-slate-300 leading-relaxed">{s.benefit}</p>
              <div className="pt-2 border-t border-slate-800 text-slate-400">
                <strong>Eligibility:</strong> {s.eligibility}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
