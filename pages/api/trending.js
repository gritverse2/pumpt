const puppeteer = require("puppeteer");

async function fetchTrendingWords() {
  console.log("🔹 Launching Puppeteer...");
  
  // Deschidem un browser headless
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  console.log("🔹 Navigating to Pump.fun...");
  await page.goto("https://pump.fun/", { waitUntil: "domcontentloaded" });

  // Așteptăm 3 secunde pentru ca JavaScript-ul să se încarce
  await page.waitForTimeout(3000);

  // Extragem cuvintele trending
  const words = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".overflow-x-auto button")).map(btn => btn.textContent.trim());
  });

  console.log("✅ Extracted words:", words);

  await browser.close();
  return words;
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
