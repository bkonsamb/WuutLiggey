import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import crypto from "crypto";
import slugify from "slugify";

const MAX_PER_DAY = 5;
const TODAY = new Date().toISOString().split("T")[0];

const FILE = "./data/jobs.json";

// 📍 mots clés Sénégal
const SENEGAL_KEYWORDS = [
  "dakar",
  "senegal",
  "sénégal",
  "thies",
  "thiès"
];

// 📂 load data
let jobs = [];
if (fs.existsSync(FILE)) {
  jobs = JSON.parse(fs.readFileSync(FILE));
}

// 🔒 anti-duplication hash
function makeHash(title, link) {
  return crypto.createHash("md5").update(title + link).digest("hex");
}

// 🇸🇳 filtre Sénégal
function isSenegal(text = "") {
  const t = text.toLowerCase();
  return SENEGAL_KEYWORDS.some(k => t.includes(k));
}

// 🕸️ SCRAPING multi sources (IMPORTANT)
async function scrape() {
  let results = [];

  const sources = [
    "https://www.emploi.sn/recherche-jobs",
    "https://www.emploisenegal.com/offres-emploi"
  ];

  for (let url of sources) {
    try {
      const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const $ = cheerio.load(data);

      $("a, .job, .job-item, article").each((_, el) => {
        const title = $(el).text().trim();
        const link = $(el).attr("href");

        if (!title || title.length < 10) return;

        if (link) {
          results.push({
            title,
            link: link.startsWith("http") ? link : url + link
          });
        }
      });

    } catch (e) {
      console.log("❌ scrape failed:", url);
    }
  }

  return results;
}

// 🚀 MAIN
async function run() {
  console.log("🔍 Scraping jobs...");

  const scraped = await scrape();

  console.log("📦 scraped:", scraped.length);

  const existingHashes = new Set(jobs.map(j => j.id));

  const newJobs = [];

  for (let item of scraped) {
    if (newJobs.length >= MAX_PER_DAY) break;

    if (!isSenegal(item.title)) continue;

    const id = makeHash(item.title, item.link);

    if (existingHashes.has(id)) continue;

    newJobs.push({
      id,
      title: item.title,
      slug: slugify(item.title, { lower: true }),
      link: item.link,
      date: TODAY
    });

    existingHashes.add(id);
  }

  const updated = [...newJobs, ...jobs];

  fs.writeFileSync(FILE, JSON.stringify(updated, null, 2));

  console.log("✅ new jobs:", newJobs.length);
}

run();
