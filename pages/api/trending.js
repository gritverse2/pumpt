import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";

export default async function handler(req, res) {
  try {
    console.log("🔹 Launching Puppeteer...");

    const browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: true
    });

    const page = await browser.newPage();

    console.log("🔹 Navigating to Pump.fun...");
    await page.goto("https://pump.fun/", { waitUntil: "domcontentloaded" });

    // Așteptăm să se încarce
    await page.waitForTimeout(3000);

    // Extragem cuvintele trending
    const words = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".overflow-x-auto button")).map(btn => btn.textContent.trim());
    });

    console.log("✅ Extracted words:", words);

    await browser.close();

    res.status(200).json({ current: words, history: [] });
  } catch (error) {
    console.error("❌ API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
