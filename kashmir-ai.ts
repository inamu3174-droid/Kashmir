import { db } from "@/db";
import { places, businesses, events, transportRoutes, weatherForecasts, knowledgeArticles } from "@/db/schema";
import { ensureDatabaseSeeded } from "./db-init";
import { ilike, or, eq, like } from "drizzle-orm";

export interface AIResponse {
  response: string;
  language: "en" | "ur" | "ks";
  sources: { name: string; url?: string; category: string }[];
  toolsUsed: string[];
  suggestedFollowups?: string[];
}

export async function processKashmirAIQuery(query: string, requestedLang: "en" | "ur" | "ks" = "en"): Promise<AIResponse> {
  await ensureDatabaseSeeded();

  const lower = query.toLowerCase().trim();
  const toolsUsed: string[] = [];
  const sources: { name: string; url?: string; category: string }[] = [];

  // Determine language if auto-detect
  let lang = requestedLang;
  if (lower.includes("kashmiri") || lower.includes("کٲشُر") || lower.includes("koshur") || lower.includes("vare chha") || lower.includes("waray chha")) {
    lang = "ks";
  } else if (lower.includes("urdu") || lower.includes("اردو") || lower.includes("kya hal hai") || lower.includes("kaise ho")) {
    lang = "ur";
  }

  // 1. Weather Intent Check
  if (lower.includes("weather") || lower.includes("temperature") || lower.includes("snow") || lower.includes("forecast") || lower.includes("rain") || lower.includes("chilla") || lower.includes("mausam") || lower.includes("موسم")) {
    toolsUsed.push("Weather_Database_Tool");
    sources.push({ name: "IMD Weather Station Srinagar & Gulmarg Observatory", category: "Meteorological Data" });

    const allWeather = await db.select().from(weatherForecasts);
    
    // Find specific district match
    let matched = allWeather.find(w => lower.includes(w.district.toLowerCase()));
    if (!matched) matched = allWeather.find(w => w.district === "Srinagar") || allWeather[0];

    if (lang === "ks") {
      return {
        response: `🏔️ **${matched.district} منٛز اَزوک موسم (Weather in ${matched.district}):**\n\n` +
          `• **درجہ حرارت (Temp):** ${matched.tempC}°C\n` +
          `• **حال (Condition):** ${matched.condition}\n` +
          `• **شین پؠنُک امکان (Snow Chance):** ${matched.snowChance}%\n` +
          `• **ہوا (Wind):** ${matched.windKmh} km/h | **نَمی (Humidity):** ${matched.humidity}%\n\n` +
          `⚠️ **مشورہ (Advisory):** ${matched.advisory}\n` +
          `❄️ **موسمی حال (Season):** ${matched.seasonContext}\n\n` +
          `*(Romanized Kashmiri: ${matched.district} manz azuk mausam chhu ${matched.tempC}°C. ${matched.advisory})*`,
        language: "ks",
        sources,
        toolsUsed,
        suggestedFollowups: [`${matched.district} منٛز کِتھ کَن گَھنِتھ؟`, "گلمرگ منٛز موسم کِتھ کَن چُھ؟", "شین خٲطِر لَگَن والِ پلَو"]
      };
    }

    if (lang === "ur") {
      return {
        response: `🏔️ **${matched.district} میں آج کا موسم (Weather in ${matched.district}):**\n\n` +
          `• **درجہ حرارت:** ${matched.tempC}°C\n` +
          `• **صورتحال:** ${matched.condition}\n` +
          `• **برف باری کا امکان:** ${matched.snowChance}%\n` +
          `• **ہوا کی رفتار:** ${matched.windKmh} km/h | **نمی:** ${matched.humidity}%\n\n` +
          `⚠️ **ہدایت / ایڈوائزری:** ${matched.advisory}\n` +
          `❄️ **موسمی پس منظر:** ${matched.seasonContext}`,
        language: "ur",
        sources,
        toolsUsed,
        suggestedFollowups: [`${matched.district} میں ہوٹل اور ٹرانسپورٹ`, "گلمرگ میں گنڈولا ٹکٹ کا طریقہ", "کشمیر میں سردیوں کے ملبوسات"]
      };
    }

    return {
      response: `🌦️ **Current Weather & Seasonal Report for ${matched.district}:**\n\n` +
        `• **Temperature:** ${matched.tempC}°C\n` +
        `• **Condition:** ${matched.condition}\n` +
        `• **Snowfall Probability:** ${matched.snowChance}%\n` +
        `• **Humidity:** ${matched.humidity}% | **Wind:** ${matched.windKmh} km/h\n\n` +
        `⚠️ **Local Advisory:** ${matched.advisory}\n` +
        `🏔️ **Seasonal Context:** ${matched.seasonContext}\n\n` +
        `*Tip: All major mountain passes (Tangmarg-Gulmarg, Zojila, Razdan) require 4WD vehicles or snow chains during snow advisories.*`,
      language: "en",
      sources,
      toolsUsed,
      suggestedFollowups: [
        `Show places to visit in ${matched.district}`,
        "What should I wear in Kashmir in winter?",
        "How is the road condition to Gulmarg?"
      ]
    };
  }

  // 2. Transport & Gondola & Shikara Intent Check
  if (lower.includes("transport") || lower.includes("cab") || lower.includes("taxi") || lower.includes("gondola") || lower.includes("shikara") || lower.includes("fare") || lower.includes("bus") || lower.includes("train") || lower.includes("sumo") || lower.includes("airport cab") || lower.includes("گلاڈی") || lower.includes("گاڑی")) {
    toolsUsed.push("Transport_Route_Database");
    sources.push({ name: "J&K Directorate of Tourism & Transport Union Tariffs", url: "https://jk-tourism.gov.in", category: "Official Tariff" });

    const routes = await db.select().from(transportRoutes);
    let matchedRoutes = routes.filter(r => 
      lower.includes(r.fromLocation.toLowerCase()) || 
      lower.includes(r.toLocation.toLowerCase()) || 
      lower.includes(r.mode.toLowerCase())
    );

    if (matchedRoutes.length === 0) matchedRoutes = routes;

    const routeListStr = matchedRoutes.slice(0, 3).map(r => 
      `🚖 **${r.mode} (${r.fromLocation} ➔ ${r.toLocation})**\n` +
      `• **Distance / Time:** ${r.distanceKm} km (~${r.approxTime})\n` +
      `• **Standard Fare:** ${r.estimatedFare}\n` +
      `• **Operating Hours:** ${r.operatingHours}\n` +
      `• **Local Tip:** ${r.tips}`
    ).join("\n\n");

    if (lang === "ks") {
      return {
        response: `🚌 **کَشِیرِ منٛز سَفَر تہٕ ٹرانسپورٹُک معلُومات (Transport Info):**\n\n${routeListStr}\n\n` +
          `💡 *روٹ ایڈوائزری: ہوائی اڈہ پؠٹھ گلمرگ یا پہلگام خٲطِر گورنمنٹ فکسڈ ریٹ ٹیکسی لَگَن۔*`,
        language: "ks",
        sources,
        toolsUsed,
        suggestedFollowups: ["گونڈولا ٹکٹ آن لائن کِتھ کَن بُک کَرِیو؟", "سری نگر ایئرپورٹ پؠٹھ ٹیکسی کرایہ"]
      };
    }

    if (lang === "ur") {
      return {
        response: `🚌 **کشمیر میں سفر اور ٹرانسپورٹ کی تفصیلات:**\n\n${routeListStr}\n\n` +
          `📌 **ضروری نوٹ:** گلمرگ گنڈولا کی ٹکٹیں صرف سرکاری ویب سائٹ (gulmarggondola.com) سے آن لائن پہلے سے بک کریں۔`,
        language: "ur",
        sources,
        toolsUsed,
        suggestedFollowups: ["سرینگر ایئرپورٹ سے پہلگام کی بکلنگ", "ڈل جھیل میں شیکارہ کا سرکاری کرایہ"]
      };
    }

    return {
      response: `🚌 **Kashmir Transport, Gondola & Travel Guide:**\n\n${routeListStr}\n\n` +
        `📌 **Official Tips:**\n` +
        `1. **Gulmarg Gondola:** Tickets MUST be booked online in advance at ` +
        `*gulmarggondola.com*. Beware of unauthorized vendors.\n` +
        `2. **Shikara Ride:** Fixed J&K Tourism tariff is **₹770/hour** for the entire boat (up to 4 people).\n` +
        `3. **Winter Travel:** Tangmarg to Gulmarg snow stretch requires 4WD vehicles with tire chains in snow seasons.`,
      language: "en",
      sources,
      toolsUsed,
      suggestedFollowups: [
        "How do I book Gulmarg Gondola Phase 1 & 2 tickets?",
        "What is the cab fare from Srinagar Airport to Pahalgam?",
        "Show me Srinagar Railway Station train timings"
      ]
    };
  }

  // 3. Businesses & Hotels & Restaurants & Bakeries & Handicrafts
  if (lower.includes("hotel") || lower.includes("restaurant") || lower.includes("wazwan") || lower.includes("bakery") || lower.includes("kandur") || lower.includes("pashmina") || lower.includes("cafe") || lower.includes("houseboat") || lower.includes("hospital") || lower.includes("business") || lower.includes("shop") || lower.includes("شاپنگ") || lower.includes("ہوٹل")) {
    toolsUsed.push("Business_Directory_Search_Tool");
    sources.push({ name: "Kashmir Chamber of Commerce & Verified Local Business Registry", category: "Commercial Directory" });

    const bizList = await db.select().from(businesses);
    let matchedBiz = bizList.filter(b => 
      lower.includes(b.category.toLowerCase()) || 
      lower.includes(b.district.toLowerCase()) || 
      lower.includes(b.name.toLowerCase()) ||
      lower.includes(b.location.toLowerCase())
    );

    if (matchedBiz.length === 0) matchedBiz = bizList.slice(0, 4);

    const bizStr = matchedBiz.map(b => 
      `🏨 **${b.name}** [${b.category} - ${b.district}]\n` +
      `• **Location:** ${b.location} (${b.address})\n` +
      `• **Phone:** ${b.phone} | **Rating:** ⭐ ${b.rating}/5 (${b.totalReviews} reviews)\n` +
      `• **Opening Hours:** ${b.openingHours}\n` +
      `• **Offerings:** ${JSON.parse(b.services || "[]").join(", ")}`
    ).join("\n\n");

    if (lang === "ks") {
      return {
        response: `🏪 **کَشِیرِک اہم ہوٹل، باکھر خانے تہٕ دُکان (Verified Businesses):**\n\n${bizStr}`,
        language: "ks",
        sources,
        toolsUsed,
        suggestedFollowups: ["اصلی وازوان کَتھ جائے مِلِ؟", "اصلی پشمینہ شال زاننُک طریقہ"]
      };
    }

    if (lang === "ur") {
      return {
        response: `🏪 **کشمیر کے سرفہرست ہوٹلز، ریستوراں اور کاروباری مراکز:**\n\n${bizStr}`,
        language: "ur",
        sources,
        toolsUsed,
        suggestedFollowups: ["سرینگر میں بہترین ہاؤس بوٹ", "اننت ناگ میں روایتی تندور/کاندُر ب bakery"]
      };
    }

    return {
      response: `🏨 **Verified Local Businesses & Services in Kashmir:**\n\n${bizStr}\n\n` +
        `💡 *All listed businesses are verified with official contact phone numbers and guest reviews.*`,
      language: "en",
      sources,
      toolsUsed,
      suggestedFollowups: [
        "Where can I taste authentic 36-course Kashmiri Wazwan in Srinagar?",
        "Recommend luxury houseboats on Nigeen Lake",
        "How can I register my business on Kashmir AI?"
      ]
    };
  }

  // 4. Places & Tourism Intent Check
  if (lower.includes("place") || lower.includes("visit") || lower.includes("srinagar") || lower.includes("gulmarg") || lower.includes("pahalgam") || lower.includes("sonamarg") || lower.includes("gurez") || lower.includes("doodhpathri") || lower.includes("tulip") || lower.includes("anantnag") || lower.includes("kupwara") || lower.includes("doda") || lower.includes("tourist") || lower.includes("جاے")) {
    toolsUsed.push("Places_Database_Retriever");
    sources.push({ name: "Jammu & Kashmir Tourism Development Corporation (JKTDC)", url: "https://jk-tourism.gov.in", category: "Tourism Authority" });

    const allPlaces = await db.select().from(places);
    let matchedPlaces = allPlaces.filter(p => 
      lower.includes(p.name.toLowerCase()) || 
      lower.includes(p.district.toLowerCase()) || 
      lower.includes(p.category.toLowerCase())
    );

    if (matchedPlaces.length === 0) matchedPlaces = allPlaces.slice(0, 4);

    const placeStr = matchedPlaces.map(p => 
      `🏔️ **${p.name}** [${p.category} | ${p.district} District]\n` +
      `• **Overview:** ${p.description}\n` +
      `• **Best Season to Visit:** ${p.bestTime}\n` +
      `• **Timings:** ${p.openingHours}\n` +
      `• **Nearby Attractions:** ${JSON.parse(p.nearbyAttractions || "[]").join(", ")}`
    ).join("\n\n");

    if (lang === "ks") {
      return {
        response: `🏔️ **کَشِیرِک خوبصورت جائے (Top Places to Explore in Kashmir):**\n\n${placeStr}\n\n` +
          `✨ *تُہیَ ہیِکو یِمن جائن خٲطِر ٹرانسپورٹ تہٕ ہوٹل معلُومات تہِ زانِتھ۔*`,
        language: "ks",
        sources,
        toolsUsed,
        suggestedFollowups: ["گلمرگ وِزٹ کَرنُک صحیح وقت", "سرینگر ڈل جھیل منٛز شکارہ کرایہ"]
      };
    }

    if (lang === "ur") {
      return {
        response: `🏔️ **وادیِ کشمیر کے خوبصورت سیاحتی مقامات:**\n\n${placeStr}`,
        language: "ur",
        sources,
        toolsUsed,
        suggestedFollowups: ["گلمرگ میں اسکینگ اور برف باری", "پہلگام میں بیٹاب وادی کی معلومات"]
      };
    }

    return {
      response: `🏔️ **Top Destination Highlights in Kashmir Valley:**\n\n${placeStr}\n\n` +
        `💡 *Need a custom trip itinerary or budget breakdown? Ask Kashmir AI for day-wise planning!*`,
      language: "en",
      sources,
      toolsUsed,
      suggestedFollowups: [
        "Plan a 4-day itinerary for Srinagar, Gulmarg, and Pahalgam",
        "What are the best hidden places in Kashmir like Gurez or Doodhpathri?",
        "Show these destinations on the Kashmir Interactive Map"
      ]
    };
  }

  // 5. Education & Opportunities Intent Check
  if (lower.includes("education") || lower.includes("university") || lower.includes("college") || lower.includes("nit") || lower.includes("kashmir university") || lower.includes("scholarship") || lower.includes("job") || lower.includes("career") || lower.includes("iust") || lower.includes("skuast")) {
    toolsUsed.push("Education_And_Opportunities_DB");
    sources.push({ name: "Higher Education Department J&K & University Grants Commission", category: "Education Portal" });

    if (lang === "ks") {
      return {
        response: `🎓 **کَشِیرِ منٛز تعلیمی ادارہ تہٕ موقعہ (Education in Kashmir):**\n\n` +
          `1. **کشمیر یونیورسٹی (University of Kashmir, Hazratbal):** ناٹیکل، سائنس، آرٹس تہٕ ریسرچ خٲطِر بااثر یونیورسٹی۔\n` +
          `2. **این آئی ٹی سرینگر (NIT Srinagar, Hazratbal):** انجینئرنگ تہٕ ٹیکنالوجی منٛز قومی اہم ادارہ۔\n` +
          `3. **اسلامک یونیورسٹی آف سائنس اینڈ ٹیکنالوجی (IUST Awantipora):** کمپیوٹر سائنس، ڈیوائسز تہٕ بزنس سنٹر۔\n` +
          `4. **اسکواسٹ کشمیر (SKUAST Shalimar):** زراعت، باغبانی تہٕ کیسر ریسرچ سنٹر۔\n\n` +
          `💼 **موقعہ:** ہینڈیکرافٹ اسکالرشپ، جے اینڈ کے سکل ڈیوپمنٹ مشن تہٕ یوتھ سٹارٹ اپ فنڈ।`,
        language: "ks",
        sources,
        toolsUsed,
        suggestedFollowups: ["کشمیر یونیورسٹی منٛز ایڈمیشن نٹس", "جے اینڈ کے یوتھ سٹارٹ اپ اسکیم"]
      };
    }

    return {
      response: `🎓 **Education Institutions & Career Opportunities in Kashmir:**\n\n` +
        `🏛️ **Top Universities & Colleges:**\n` +
        `1. **University of Kashmir (Hazratbal, Srinagar):** Premier NAAC A+ accredited multi-disciplinary research university.\n` +
        `2. **National Institute of Technology (NIT Srinagar):** Centrally funded institute of national importance for B.Tech/M.Tech/Ph.D.\n` +
        `3. **Islamic University of Science & Technology (IUST Awantipora):** Engineering, Management, Allied Health & Food Technology.\n` +
        `4. **SKUAST Kashmir (Shalimar):** Agricultural Sciences, Forestry, Horticulture & Saffron biotechnology research.\n` +
        `5. **Government Medical College (GMC Srinagar & Anantnag):** Premier medical education & teaching hospitals.\n\n` +
        `💼 **Youth & Entrepreneur Opportunities:**\n` +
        `• **JKEDI Startup Policy:** Seed capital grants and incubation for Kashmir tech & artisan startups.\n` +
        `• **Mission Youth J&K:** Scholarships, Mumkin transport scheme, and Tejaswini women entrepreneur grants.\n` +
        `• **Craft Apprentice Grants:** Directorate of Handicrafts monthly stipend for Pashmina & Kani weaving training.`,
      language: "en",
      sources,
      toolsUsed,
      suggestedFollowups: [
        "What startups and handicraft schemes are available under Mission Youth J&K?",
        "How can I apply for Kashmir University courses?"
      ]
    };
  }

  // 6. Events & Festivals Intent Check
  if (lower.includes("event") || lower.includes("festival") || lower.includes("tulip festival") || lower.includes("carnival") || lower.includes("exhibition") || lower.includes("notice") || lower.includes("تقریب")) {
    toolsUsed.push("Events_Database_Search");
    sources.push({ name: "J&K Department of Culture & Tourism Event Calendar", category: "Official Calendar" });

    const allEvents = await db.select().from(events);
    const eventStr = allEvents.map(e => 
      `🎉 **${e.title}** [${e.category}]\n` +
      `• **Location:** ${e.location} (${e.district})\n` +
      `• **Dates:** ${e.startDate} to ${e.endDate} [Status: ${e.status.toUpperCase()}]\n` +
      `• **Details:** ${e.description}\n` +
      `• **Organizer Contact:** ${e.organizer} (${e.contact || "N/A"})`
    ).join("\n\n");

    return {
      response: `🎉 **Current & Upcoming Events in Kashmir:**\n\n${eventStr}`,
      language: lang,
      sources,
      toolsUsed,
      suggestedFollowups: [
        "When does the Tulip Garden open in Srinagar for 2025?",
        "What winter games take place in Gulmarg?"
      ]
    };
  }

  // 7. General Knowledge / Greetings / Cultural Knowledge
  toolsUsed.push("Kashmir_Knowledge_Base_RAG");
  sources.push({ name: "Kashmir Cultural Heritage Archive & Kashmir AI Verified Knowledge Base", category: "Knowledge Base" });

  const articles = await db.select().from(knowledgeArticles);
  const matchedArt = articles.find(a => lower.includes(a.title.toLowerCase()) || lower.includes(a.category.toLowerCase())) || articles[0];

  if (lang === "ks") {
    return {
      response: `🌸 **بلاے ما لَیو! اسلام علیکم (Greetings from Kashmir AI):**\n\n` +
        `بِہ چُھس **Kashmir AI** — کَشِیرِک دِجیٹَل مَدَدگار۔ تُہِیَ ہیِکو مےٚ پؠٹھ پرِتھ زٲتِہ ہِند سوال زانِتھ:\n\n` +
        `• 🏔️ **جائے تہٕ سیاحت:** سرینگر، گلمرگ، پہلگام، سونمرگ، گریز\n` +
        `• 🌦️ **موسم:** اَزوک درجہ حرارت تہٕ شین پؠنُک امکان\n` +
        `• 🚖 **ٹرانسپورٹ:** گنڈولا ٹکٹ، ایئرپورٹ کیب کرایہ، شکارہ ریٹ\n` +
        `• 🍲 **کھانِ تہٕ وازوان:** روگن جوش، رِشتہ، نون چائے تہٕ کاندُر باکھری\n` +
        `• 🎓 **تعلیم تہٕ نوکری:** کشمیر یونیورسٹی، این آئی ٹی، یوتھ سکیم\n\n` +
        `*تُہِیَ چِھوا تسلی؟ کَیاہ معلُومات پَزِتھ لَگِیو؟*`,
      language: "ks",
      sources,
      toolsUsed,
      suggestedFollowups: [
        "گلمرگ منٛز از موسم کِتھ کَن چُھ؟",
        "اصلی وازوان کَتھ جائے مِلِ؟",
        "سرینگر منٛز خوبصورت جائے"
      ]
    };
  }

  if (lang === "ur") {
    return {
      response: `🌸 **السلام علیکم! میں کشمیر AI ہوں — آپ کا رقمیک اور قابلِ اعتماد سسٹنٹ۔**\n\n` +
        `میں وادیِ کشمیر کی سیاحت، موسم، بہترین ہوٹلز، روایتی وازوان، گنڈولا بکلنگ، ٹرانسپورٹ کے کرائے اور تعلیمی مواقع سے متعلق ہر سوال کا درست اور مصدقہ جواب دے سکتا ہوں۔\n\n` +
        `✨ **شروع کرنے کے لیے آپ مجھ سے پوچھ سکتے ہیں:**\n` +
        `• "گلمرگ میں آج کا موسم کیسا ہے؟"\n` +
        `• "سرینگر ایئرپورٹ سے پہلگام کا ٹیکسی کرایہ کتنا ہے؟"\n` +
        `• "سرینگر کے بہترین وازوان ریستوراں دکھائیں۔"\n` +
        `• "پشمینہ شال کی اصلیت جانچنے کا طریقہ بتائیں۔"`,
      language: "ur",
      sources,
      toolsUsed,
      suggestedFollowups: [
        "گلمرگ کا موسم اور برف باری کا حال",
        "سرینگر میں ہاؤس بوٹ اور ڈل جھیل کی تفصیلات",
        "کشمیر وازوان کے مشہور پکوان"
      ]
    };
  }

  return {
    response: `🌸 **Welcome! I am Kashmir AI — your dedicated digital assistant for the Kashmir Valley.**\n\n` +
      `I am built specifically to provide verified, practical, and culturally respectful information about:\n\n` +
      `• 🏔️ **Tourism & Destinations:** Srinagar, Gulmarg, Pahalgam, Sonamarg, Gurez, Doodhpathri, Aharbal, Bangus.\n` +
      `• 🌦️ **Real-time Weather & Seasons:** Live temperatures, snow advisories, Chilla-i-Kalan survival tips.\n` +
      `• 🚖 **Transport & Gondola:** Official cab tariffs, Gondola ticket booking procedures, Shikara rates.\n` +
      `• 🏨 **Hotels, Restaurants & Local Businesses:** Top stays, 36-course Wazwan spots, artisan bakeries, certified Pashmina outlets.\n` +
      `• 🎓 **Education & Opportunities:** Universities (KU, NIT, IUST), youth startup grants, artisan stipends.\n\n` +
      `💡 **Spotlight Insight — ${matchedArt.title}:**\n` +
      `${matchedArt.summary}\n` +
      `${matchedArt.content.slice(0, 220)}...\n\n` +
      `*How can I assist your trip or query today? Ask me anything in English, Urdu, or Kashmiri!*`,
    language: "en",
    sources,
    toolsUsed,
    suggestedFollowups: [
      "What is the current weather in Gulmarg?",
      "Recommend hotels and houseboats in Srinagar",
      "How to book Gulmarg Gondola tickets online?",
      "Show me local education and job opportunities in Kashmir"
    ]
  };
}
