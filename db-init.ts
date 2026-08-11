import { db } from "@/db";
import { places, businesses, events, transportRoutes, weatherForecasts, knowledgeArticles } from "@/db/schema";
import { INITIAL_PLACES, INITIAL_BUSINESSES, INITIAL_EVENTS, INITIAL_TRANSPORT, INITIAL_WEATHER, INITIAL_ARTICLES } from "./seed-data";
import { count } from "drizzle-orm";

let isSeeded = false;

export async function ensureDatabaseSeeded() {
  if (isSeeded) return;
  try {
    const [{ value: placeCount }] = await db.select({ value: count() }).from(places);
    if (Number(placeCount) === 0) {
      console.log("Seeding Kashmir database with initial knowledge and places...");
      
      await db.insert(places).values(INITIAL_PLACES).onConflictDoNothing();
      await db.insert(businesses).values(INITIAL_BUSINESSES).onConflictDoNothing();
      await db.insert(events).values(INITIAL_EVENTS).onConflictDoNothing();
      await db.insert(transportRoutes).values(INITIAL_TRANSPORT).onConflictDoNothing();
      await db.insert(weatherForecasts).values(INITIAL_WEATHER).onConflictDoNothing();
      await db.insert(knowledgeArticles).values(INITIAL_ARTICLES).onConflictDoNothing();

      console.log("Database successfully seeded!");
    }
    isSeeded = true;
  } catch (error) {
    console.error("Database seed check error:", error);
  }
}
