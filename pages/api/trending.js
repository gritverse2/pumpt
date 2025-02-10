import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";

// Definim fișierul unde vom salva trendurile
const DATA_FILE = path.resolve("./public/trending.json");

// Funcție care face scraping pe Pump.fun
async function fetchTrendingWords() {
  try {
    console.log("Fetching trending words...");
    const { data } = await axios.get("https://pump.fun/");
    const $ = cheerio.load(data);
    const words = [];

    $(".trending-word").each((index, element) => {
      words.push($(element).text().trim());
    });

    if (words.length > 0) {
      const timestamp = new Date().toISOString();
      let history = [];

      // Dacă fișierul există, citim istoricul
      if (fs.existsSync(DATA_FILE)) {
        history = JSON.parse(fs.readFileSync(DATA_FILE));
      }

      // Salvăm ultimele 100 de înregistrări
      history.unshift({ time: timestamp, words });
      fs.writeFileSync(DATA_FILE, JSON.stringify(history.slice(0, 100), null, 2));

      console.log("Updated trending words:", words);
    }
  } catch (error) {
    console.error("Error fetching trending words:", error);
  }
}

// API Route care returnează datele
export default function handler(req, res) {
  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.status(200).json({ current: data[0].words, history: data });
  } else {
    res.status(200).json({ current: [], history: [] });
  }
}
