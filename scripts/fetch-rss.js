import Parser from "rss-parser";
import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import slugify from "slugify";

const parser = new Parser();

const MAX_PER_DAY = 5;
const TODAY = new Date().toISOString().split("T")[0];

// 🔒 mots clés Sénégal
const SENEGAL_KEYWORDS = [
  "dakar",
  "senegal",
  "sénégal",
  "thies",
  "thiès"
];

// 📂 charger anciens jobs
let existingJobs = [];
if (fs.existsSync("./data/jobs.json")) {
  existingJobs = JSON.parse(fs.readFileSync("./data/jobs.json"));
}

// 📊 compter aujourd’hui
const todayCount = existingJobs.filter(j => j.date === TODAY).length;
const remaining = MAX_PER_DAY - todayCount;

console.log(`📅 ${TODAY} | Remaining slots: ${remaining}`);

if (remaining <= 0) {
  console.log("🚫 Limite atteinte aujourd’hui");
  process.exit();
}

// 🔍 filtre Sénégal
function isSenegal(text) {
  if (!text) return false;
  const t = text.toLowerCase();
  return SENEGAL_KEYWORDS.some(k => t.includes(k));
}

// 🔁 anti-duplication
function isDuplicate(title) {
  return existingJobs.some(j => j.title === title);
}

// 🧠 SCRAPING (fallback)
async function scrapeJobs() {
  const jobs = [];
  try {
    const { data } = await axios.get("https://www.emploi.sn/recherche-jobs");
    const $ = cheerio.load(data);

    $(".job-item").each((i, el) => {
      const title = $(el).find("h2").text().trim();
      const link = $(el).find("a").attr("href");

      if (title && link) {
        jobs.push({
          title,
          link: "https://www.emploi.sn" + link,
          description: title
        });
      }
    });

    console.log(`🕸️ Scraped: ${jobs.length}`);
  } catch (err) {
    console.log("❌ Scraping failed");
  }

  return jobs;
}

// 📡 RSS sources
const RSS_FEEDS = [
  "https://www.emploi.sn/rss.xml"
];

async function fetchRSS() {
  let all = [];

  for (let url of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.map(item => ({
        title: item.title,
        link: item.link,
        description: item.contentSnippet || item.content
      }));

      console.log(`📡 RSS OK: ${items.length}`);
      all.push(...items);
    } catch (err) {
      console.log(`⚠️ RSS failed: ${url}`);
    }
  }

  return all;
}

// 🚀 MAIN
async function run() {
  let items = await fetchRSS();

  // fallback scraping si vide
  if (items.length === 0) {
    console.log("⚠️ RSS vide → scraping fallback");
    items = await scrapeJobs();
  }

  console.log(`📋 Total collected: ${items.length}`);

  const newJobs = [];

  for (let item of items) {
    if (newJobs.length >= remaining) break;

    if (!isSenegal(item.title + item.description)) continue;
    if (isDuplicate(item.title)) continue;

    newJobs.push({
      title: item.title,
      slug: slugify(item.title, { lower: true }),
      description: item.description,
      link: item.link,
      date: TODAY
    });
  }

  console.log(`🆕 New valid jobs: ${newJobs.length}`);

  const updated = [...newJobs, ...existingJobs];

  fs.writeFileSync("./data/jobs.json", JSON.stringify(updated, null, 2));

  console.log("✅ jobs.json updated");
}

run();
