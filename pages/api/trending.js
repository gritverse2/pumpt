import axios from "axios";
const cheerio = require("cheerio");
import fs from "fs";
import path from "path";

const DATA_FILE = path.resolve("./public/trending.json");

export default async function handler(req, res) {
  try {
    console.log("Fetching trending words...");
    const { data } = await axios.get("https://pump.fun/");
    const $ = cheerio.load(data);
    const words = [];

    // Găsim toate butoanele care conțin cuvintele trending
    $(".overflow-x-auto button").each((index, element) => {
      words.push($(element).text().trim());
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
      return res.status(200).json({ success: true, words });
    } else {
      return res.status(200).json({ success: false, message: "No trending words found." });
    }
  } catch (error) {
    console.error("Error fetching trending words:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
