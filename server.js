const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/trending", async (req, res) => {
  try {
    console.log("🔹 Launching Puppeteer...");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    console.log("🔹 Navigating to Pump.fun...");
    await page.goto("https://pump.fun/", { waitUntil: "domcontentloaded" });

    // Așteptăm să se încarce JavaScript-ul
    await page.waitForTimeout(3000);

    // Extragem cuvintele trending
    const words = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".overflow-x-auto button")).map(
        (btn) => btn.textContent.trim()
      );
    });

    console.log("✅ Extracted words:", words);
    await browser.close();

    res.status(200).json({ current: words });
  } catch (error) {
    console.error("❌ API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
