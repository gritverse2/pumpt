const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.resolve("./public/trending.json");

async function fetchTrendingWords() {
  try {
    console.log("🔹 Fetching trending words...");
    const { data } = await axios.get("https://pump.fun/");
    const $ = cheerio.load(data);
    const words = [];

    // Verificăm dacă structura este corectă
    console.log("🔹 Checking for elements...");
    console.log($.html().substring(0, 500)); // Afișează o parte din HTML-ul paginii pentru debug

    $(".overflow-x-auto button").each((index, element) => {
      const word = $(element).text().trim();
      if (word) {
        words.push(word);
      }
    });

    console.log("🔹 Extracted words:", words);

    if (words.length > 0) {
      const timestamp = new Date().toISOString();
      let history = [];

      if (fs.existsSync(DATA_FILE)) {
        history = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      }

      history.unshift({ time: timestamp, words });
      fs.writeFileSync(DATA_FILE, JSON.stringify(history.slice(0, 100), null, 2));

      console.log("✅ Updated trending words:", words);
      return words;
    } else {
      console.log("⚠️ No trending words found.");
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching trending words:", error);
    return [];
  }
}

// API Route pentru frontend
module.exports = async function handler(req, res) {
  try {
    console.log("🔹 Serving API request...");

    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return res.status(200).json({ current: data[0]?.words || [], history: data });
    } else {
      console.log("⚠️ Trending data file not found.");
      return res.status(200).json({ current: [], history: [] });
    }
  } catch (error) {
    console.error("❌ API error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
