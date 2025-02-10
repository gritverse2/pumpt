const axios = require("axios");
const cheerio = require("cheerio");

async function fetchTrendingWords() {
  try {
    console.log("🔹 Fetching trending words...");
    
    // Facem request la Pump.fun
    const response = await axios.get("https://pump.fun/");
    
    // Debugging: afișăm header-ele și primele 500 de caractere din HTML
    console.log("🔹 Response headers:", response.headers);
    console.log("🔹 First 500 characters of response:", response.data.substring(0, 500));

    const $ = cheerio.load(response.data);
    const words = [];

    $(".overflow-x-auto button").each((index, element) => {
      const word = $(element).text().trim();
      console.log(`🔹 Found word: ${word}`);
      if (word) {
        words.push(word);
      }
    });

    console.log("✅ Extracted words:", words);
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
    const words = await fetchTrendingWords();
    res.status(200).json({ current: words, history: [] });
  } catch (error) {
    console.error("❌ API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
