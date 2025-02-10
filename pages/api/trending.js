import axios from "axios";
import cheerio from "cheerio";

let trendingData = []; // Variabilă globală pentru a salva datele temporar

async function fetchTrendingWords() {
  try {
    console.log("🔹 Fetching trending words...");
    const { data } = await axios.get("https://pump.fun/");
    const $ = cheerio.load(data);
    const words = [];

    $(".overflow-x-auto button").each((index, element) => {
      const word = $(element).text().trim();
      if (word) {
        words.push(word);
      }
    });

    console.log("✅ Extracted words:", words);

    if (words.length > 0) {
      const timestamp = new Date().toISOString();
      trendingData.unshift({ time: timestamp, words });
      trendingData = trendingData.slice(0, 100); // Salvăm ultimele 100 de înregistrări
    }

    return words;
  } catch (error) {
    console.error("❌ Error fetching trending words:", error);
    return [];
  }
}

// API Route pentru frontend
export default async function handler(req, res) {
  try {
    console.log("🔹 Serving API request...");
    if (trendingData.length === 0) {
      await fetchTrendingWords(); // Dacă nu există date, le luăm acum
    }
    res.status(200).json({ current: trendingData[0]?.words || [], history: trendingData });
  } catch (error) {
    console.error("❌ API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
