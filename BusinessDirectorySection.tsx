"use client";

import { useState } from "react";
import { Search, Phone, Star, Building2, MapPin, PlusCircle, CheckCircle2, DollarSign, Globe, Mail } from "lucide-react";

interface Business {
  id: string;
  name: string;
  category: string;
  district: string;
  location: string;
  address: string;
  phone: string;
  email?: string | null;
  website?: string | null;
  openingHours: string;
  services?: string | null;
  rating: number;
  totalReviews: number;
  priceRange: string;
  imageUrl: string;
  verified: boolean;
}

interface BusinessProps {
  businesses: Business[];
  onRefresh: () => void;
  onAskAI: (prompt: string) => void;
}

export default function BusinessDirectorySection({ businesses, onRefresh, onAskAI }: BusinessProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowShowAddModal] = useState(false);

  // New business form state
  const [newBiz, setNewBiz] = useState({
    name: "",
    category: "Hotel",
    district: "Srinagar",
    location: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    openingHours: "9:00 AM - 8:00 PM",
    services: "",
    priceRange: "$$",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["All", "Hotel", "Houseboat", "Restaurant", "Cafe", "Bakery", "Handicrafts & Pashmina", "Transport / Taxi", "Hospital & Health"];
  const districts = ["All", "Srinagar", "Baramulla", "Anantnag", "Pulwama", "Kupwara", "Bandipora", "Doda"];

  const filteredBiz = businesses.filter((b) => {
    const matchCat = selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchDist = selectedDistrict === "All" || b.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchSearch =
      searchQuery === "" ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.services && b.services.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCat && matchDist && matchSearch;
  });

  const handleRegisterBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBiz.name || !newBiz.phone) {
      alert("Please fill in Business Name and Phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const servicesArray = newBiz.services.split(",").map((s) => s.trim()).filter(Boolean);

      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newBiz,
          services: servicesArray.length > 0 ? servicesArray : ["Local Services"],
        }),
      });

      if (res.ok) {
        alert("🎉 Business successfully registered and verified in Kashmir AI Database!");
        setShowShowAddModal(false);
        setNewBiz({
          name: "",
          category: "Hotel",
          district: "Srinagar",
          location: "",
          address: "",
          phone: "",
          email: "",
          website: "",
          openingHours: "9:00 AM - 8:00 PM",
          services: "",
          priceRange: "$$",
          imageUrl: "",
        });
        onRefresh();
      } else {
        alert("Failed to register business.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Directory Banner & Filter */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">🏪 Kashmir Local Business & Services Directory</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Search verified Kashmir hotels, luxury houseboats, Wazwan restaurants, Pashmina cottage crafts, taxi stands, and bakeries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" /> Register Your Business
            </button>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by business name, wazwan, pashmina, bakery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                District: {d}
              </option>
            ))}
          </select>
        </div>

        {/* Category Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === c
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBiz.map((biz) => {
          const servicesList: string[] = JSON.parse(biz.services || "[]");

          return (
            <div
              key={biz.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                      <img src={biz.imageUrl} alt={biz.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-white text-base leading-snug">{biz.name}</h3>
                        {biz.verified && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {biz.location}, {biz.district}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                      {biz.priceRange}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs border-y border-slate-800/80 py-2">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {biz.rating.toFixed(1)}
                  </span>
                  <span className="text-slate-400">({biz.totalReviews} reviews)</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-medium">{biz.category}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{biz.openingHours}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  📍 <strong>Address:</strong> {biz.address}
                </p>

                {servicesList.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {servicesList.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/80"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                <a
                  href={`tel:${biz.phone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call {biz.phone}
                </a>
                <button
                  onClick={() =>
                    onAskAI(`Tell me about ${biz.name} in ${biz.location}, including prices and recommendations.`)
                  }
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
                >
                  Ask AI
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Business Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" /> Register Local Business on Kashmir AI
              </h3>
              <button
                onClick={() => setShowShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterBusiness} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Business / Enterprise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalimar Wazwan House or Royal Houseboat"
                  value={newBiz.name}
                  onChange={(e) => setNewBiz({ ...newBiz, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category *</label>
                  <select
                    value={newBiz.category}
                    onChange={(e) => setNewBiz({ ...newBiz, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Houseboat">Houseboat</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Handicrafts & Pashmina">Handicrafts & Pashmina</option>
                    <option value="Transport / Taxi">Transport / Taxi</option>
                    <option value="Hospital & Health">Hospital & Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">District *</label>
                  <select
                    value={newBiz.district}
                    onChange={(e) => setNewBiz({ ...newBiz, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {districts.filter((d) => d !== "All").map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Location / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Lal Chowk or Nigeen Lake"
                  value={newBiz.location}
                  onChange={(e) => setNewBiz({ ...newBiz, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Address</label>
                <input
                  type="text"
                  placeholder="e.g. Residency Road, Srinagar 190001"
                  value={newBiz.address}
                  onChange={(e) => setNewBiz({ ...newBiz, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 194 000 0000"
                    value={newBiz.phone}
                    onChange={(e) => setNewBiz({ ...newBiz, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Opening Hours</label>
                  <input
                    type="text"
                    placeholder="9:00 AM - 9:00 PM"
                    value={newBiz.openingHours}
                    onChange={(e) => setNewBiz({ ...newBiz, openingHours: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Key Services / Specialties (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Rogan Josh, Gushtaba, Saffron Kahwa, Parking"
                  value={newBiz.services}
                  onChange={(e) => setNewBiz({ ...newBiz, services: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 rounded-xl"
                >
                  {isSubmitting ? "Registering..." : "Submit Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
