import { pgTable, text, timestamp, integer, boolean, real } from "drizzle-orm/pg-core";

export const places = pgTable("places", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  district: text("district").notNull(),
  category: text("category").notNull(), // Tourism, Heritage, Nature, Skiing, Religious, Shopping, Trekking
  description: text("description").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  bestTime: text("best_time").notNull(),
  openingHours: text("opening_hours").notNull(),
  officialWebsite: text("official_website"),
  seasonalInfo: text("seasonal_info"),
  nearbyAttractions: text("nearby_attractions"), // JSON string array
  imageUrl: text("image_url").notNull(),
  verified: boolean("verified").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const businesses = pgTable("businesses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // Hotel, Houseboat, Restaurant, Cafe, Transport / Taxi, Handicrafts & Pashmina, Bakery, Hospital & Health, Education
  district: text("district").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  website: text("website"),
  openingHours: text("opening_hours").notNull(),
  services: text("services"), // JSON string
  rating: real("rating").default(4.5).notNull(),
  totalReviews: integer("total_reviews").default(12).notNull(),
  priceRange: text("price_range").default("$$").notNull(), // $, $$, $$$, $$$$
  imageUrl: text("image_url").notNull(),
  verified: boolean("verified").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // Festival, Cultural, Sports, Exhibition, Government Advisory, Workshop
  district: text("district").notNull(),
  location: text("location").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  description: text("description").notNull(),
  organizer: text("organizer").notNull(),
  contact: text("contact"),
  imageUrl: text("image_url"),
  status: text("status").default("upcoming").notNull(), // upcoming, ongoing, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transportRoutes = pgTable("transport_routes", {
  id: text("id").primaryKey(),
  mode: text("mode").notNull(), // Shared Sumo / Taxi, Private Cab, Shikara, Gondola Cable Car, Srinagar Banihal Train, Electric Bus
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
  distanceKm: integer("distance_km").notNull(),
  approxTime: text("approx_time").notNull(),
  estimatedFare: text("estimated_fare").notNull(),
  operatingHours: text("operating_hours").notNull(),
  contactInfo: text("contact_info"),
  tips: text("tips").notNull(),
});

export const weatherForecasts = pgTable("weather_forecasts", {
  id: text("id").primaryKey(),
  district: text("district").notNull(),
  tempC: integer("temp_c").notNull(),
  condition: text("condition").notNull(), // Snowing, Clear, Sunny, Rainy, Heavy Snow, Foggy
  humidity: integer("humidity").notNull(),
  windKmh: integer("wind_kmh").notNull(),
  snowChance: integer("snow_chance").notNull(),
  advisory: text("advisory").notNull(),
  seasonContext: text("season_context").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const knowledgeArticles = pgTable("knowledge_articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // Culture & Etiquette, Food & Cuisine, Shopping Guide, Travel Advice, Education
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  sources: text("sources").notNull(),
  language: text("language").default("en").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  language: text("language").default("en").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  role: text("role").notNull(), // user | assistant
  content: text("content").notNull(),
  sources: text("sources"), // JSON array string
  toolsUsed: text("tools_used"), // JSON array string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
