const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.resolve("./public/trending.json");

async function fetchTrendingWords() {
  try {
    console.log("Fetching trending words...");
    const { data } = await axios.get("https://pump.fun/");
    const $ = cheerio.load(data);
    const words = [];

    // Selectează corect butoanele care conțin cuvintele trending
    $(".overflow-x-auto button").each((index, element) => {
      const word = $(element).text().trim();
      if (word) {
        words.push(word);
      }
    });

    if (words.length > 0) {
      const timestamp = new Date().toISOString();
      let history = [];

      if (fs.existsSync(DATA_FILE)) {
        history = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      }

      history.unshift({ time: timestamp, words });
      fs.writeFileSync(DATA_FILE, JSON.stringify(history.slice(0, 100), null, 2));

      console.log("Updated trending words:", words);
      return words;
    } else {
      console.log("No trending words found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching trending words:", error);
    return [];
  }
}

// API Route pentru frontend
module.exports = async function handler(req, res) {
  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    res.status(200).json({ current: data[0]?.words || [], history: data });
  } else {
    res.status(200).json({ current: [], history: [] });
  }
};
