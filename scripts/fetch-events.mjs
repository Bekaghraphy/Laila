import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const OUT_PATH = path.join(process.cwd(), "data", "events.json");

// غيّر المصدر هنا لأي موقع أحداث
const SOURCE_URL = "https://www.europeangymnastics.com/events";

// Helper
function clean(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // مهم: لو الموقع تقيل/بطيء
  page.setDefaultTimeout(60000);

  await page.goto(SOURCE_URL, { waitUntil: "networkidle" });

  // استراتيجية عامة:
  // 1) نجمع كل الروابط اللي شكلها event/... أو فيها "event" في URL
  // 2) ناخد أقرب container كـ "card" ونطلع منه نصوص تساعدنا: title/date/location
  const events = await page.evaluate(() => {
    const abs = (href) => {
      try { return new URL(href, location.href).toString(); }
      catch { return href; }
    };

    const links = Array.from(document.querySelectorAll("a[href]"))
      .map(a => ({ a, href: a.getAttribute("href") || "" }))
      .filter(x => x.href && /\/event(s)?\/|\/event\//i.test(x.href) || /\/event/i.test(x.href))
      .slice(0, 250);

    const seen = new Set();
    const out = [];

    for (const { a, href } of links) {
      const url = abs(href);
      if (seen.has(url)) continue;
      seen.add(url);

      // closest "card" guess
      const card =
        a.closest("article") ||
        a.closest("div[class*='card']") ||
        a.closest("div[class*='teaser']") ||
        a.closest("li") ||
        a.closest("div");

      const text = (card ? card.innerText : a.innerText) || "";
      const title = (a.innerText || "").trim();

      // حاول تقسيم النص لأسطر
      const lines = text.split("\n").map(s => s.trim()).filter(Boolean);

      // heuristic: title = أول سطر “مفيد”
      const bestTitle = title || lines[0] || "Event";

      // heuristic: لقطة تاريخ/مكان من أي سطر فيه أرقام/شهور أو اسم مدينة
      const dateLine = lines.find(l =>
        /\b(20\d{2})\b/.test(l) ||
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(l) ||
        /\b(\d{1,2}\s?[–-]\s?\d{1,2})\b/.test(l)
      ) || "";

      const locLine = lines.find(l =>
        /,\s*[A-Z]{2,}$/i.test(l) || // "City, Country"
        /\b(Estonia|Italy|France|Spain|Germany|Turkey|Greece|Portugal|Bulgaria|Romania|Hungary|Poland|Serbia|Croatia|Czech|Slovakia|Sweden|Norway|Finland|Denmark|Netherlands|Belgium|Switzerland|Austria|Latvia|Lithuania|Slovenia|Ireland|UK|United Kingdom)\b/i.test(l)
      ) || "";

      out.push({
        title: bestTitle,
        url,
        dateText: dateLine,
        location: locLine
      });
    }

    return out;
  });

  await browser.close();

  // تنظيف + إزالة الفاضي
  const normalized = events
    .map(e => ({
      title: clean(e.title),
      url: clean(e.url),
      dateText: clean(e.dateText),
      location: clean(e.location),
      source: "European Gymnastics"
    }))
    .filter(e => e.title && e.url)
    // تقليل التكرارات بالعنوان
    .filter((e, i, arr) => arr.findIndex(x => x.url === e.url) === i)
    .slice(0, 80);

  const payload = {
    generatedAt: new Date().toISOString(),
    events: normalized
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2), "utf-8");

  console.log(`Saved ${normalized.length} events -> ${OUT_PATH}`);
})();
