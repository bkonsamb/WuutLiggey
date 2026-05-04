/**
 * fetch-rss.js
 * Fetches job offers from RSS feeds (Senegal / Francophone Africa)
 * Limits to MAX 5 new jobs per day
 * Filters duplicates
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const JOBS_PATH = join(ROOT, "public", "data", "jobs.json");
const LOG_PATH = join(ROOT, "scripts", ".fetch-log.json");

const MAX_PER_DAY = 5;

// RSS Feed sources (Sénégal / Afrique francophone)
const RSS_FEEDS = [
  {
    url: "https://www.senjob.com/rss",
    source: "SenJob",
  },
  {
    url: "https://www.emploisenegal.com/feed/rss",
    source: "EmploiSenegal",
  },
  {
    url: "https://www.kerinel.com/rss",
    source: "Kerinel",
  },
  {
    url: "https://www.jobnet.sn/feed",
    source: "JobNet",
  },
  {
    url: "https://www.africawork.com/sn/rss",
    source: "AfricaWork",
  },
];

/**
 * Parse RSS XML to extract job entries
 */
function parseRSSItems(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemXML = match[1];
    const get = (tag) => {
      const m = itemXML.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>|<${tag}[^>]*>([^<]*)<\/${tag}>`));
      return m ? (m[1] || m[2] || "").trim() : "";
    };

    const title = get("title");
    const link = get("link");
    const description = get("description");
    const pubDate = get("pubDate");
    const category = get("category");

    if (title && link) {
      items.push({ title, link, description, pubDate, category });
    }
  }

  return items;
}

/**
 * Slugify a string to use as job ID
 */
function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/**
 * Clean HTML from description
 */
function stripHTML(html) {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

/**
 * Detect category from title/description
 */
function detectCategory(title, description) {
  const text = (title + " " + description).toLowerCase();
  if (/développeur|programmeur|informatique|software|data|it |tech|web|mobile|réseau|sysadmin/.test(text)) return "Informatique & Tech";
  if (/comptable|finance|audit|trésor|banque|fiscalit|financier/.test(text)) return "Finance & Comptabilité";
  if (/marketing|communication|digital|publicité|brand|media/.test(text)) return "Marketing & Communication";
  if (/btp|génie civil|chantier|construction|architecte|ingénieur travaux/.test(text)) return "BTP & Génie Civil";
  if (/médecin|infirmier|santé|hôpital|pharmacien|clinique/.test(text)) return "Santé & Médical";
  if (/commercial|vente|vendeur|sales|client/.test(text)) return "Vente & Commerce";
  if (/juriste|droit|avocat|juridique|légal/.test(text)) return "Juridique & Droit";
  if (/logistique|transport|chauffeur|supply chain|magasinier/.test(text)) return "Logistique & Transport";
  if (/enseignant|professeur|formateur|éducation|école|pédagog/.test(text)) return "Éducation & Formation";
  if (/rh|ressources humaines|drh|recruteur|paie/.test(text)) return "Ressources Humaines";
  if (/agriculture|agronome|élevage|pêche|environnement/.test(text)) return "Agriculture & Environnement";
  return "Autres";
}

/**
 * Select relevant Unsplash image based on category
 */
function getImageForCategory(category) {
  const images = {
    "Informatique & Tech": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    "Finance & Comptabilité": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    "Marketing & Communication": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "BTP & Génie Civil": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    "Santé & Médical": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    "Vente & Commerce": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    "Juridique & Droit": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    "Logistique & Transport": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    "Éducation & Formation": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    "Ressources Humaines": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
    "Agriculture & Environnement": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    "Autres": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  };
  return images[category] || images["Autres"];
}

/**
 * Fetch a single RSS feed with timeout
 */
async function fetchFeed(feedConfig) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(feedConfig.url, {
      signal: controller.signal,
      headers: { "User-Agent": "WuutLiggey-Bot/1.0 (emploi.sn)" },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = parseRSSItems(xml);
    console.log(`  ✅ ${feedConfig.source}: ${items.length} items fetched`);
    return items.map((item) => ({ ...item, source: feedConfig.source }));
  } catch (err) {
    clearTimeout(timeout);
    console.warn(`  ⚠️  ${feedConfig.source}: Failed (${err.message})`);
    return [];
  }
}

/**
 * Load fetch log to track daily limits
 */
function loadFetchLog() {
  if (!existsSync(LOG_PATH)) return { date: "", count: 0, published: [] };
  try {
    return JSON.parse(readFileSync(LOG_PATH, "utf-8"));
  } catch {
    return { date: "", count: 0, published: [] };
  }
}

/**
 * Save fetch log
 */
function saveFetchLog(log) {
  writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

/**
 * Load existing jobs
 */
function loadJobs() {
  if (!existsSync(JOBS_PATH)) return [];
  try {
    return JSON.parse(readFileSync(JOBS_PATH, "utf-8"));
  } catch {
    return [];
  }
}

/**
 * Main fetch function
 */
async function main() {
  console.log("\n🔍 Wuut Liggey — RSS Fetch Script");
  console.log("==================================\n");

  const today = new Date().toISOString().split("T")[0];
  const log = loadFetchLog();

  // Reset daily counter if new day
  if (log.date !== today) {
    log.date = today;
    log.count = 0;
  }

  if (log.count >= MAX_PER_DAY) {
    console.log(`✋ Daily limit reached (${MAX_PER_DAY} jobs/day). Skipping.`);
    return;
  }

  const remaining = MAX_PER_DAY - log.count;
  console.log(`📅 Date: ${today}`);
  console.log(`📊 Can publish: ${remaining} more jobs today\n`);

  // Load existing jobs to detect duplicates
  const existingJobs = loadJobs();
  const existingIds = new Set(existingJobs.map((j) => j.id));
  const existingLinks = new Set(log.published || []);

  // Fetch all RSS feeds
  console.log("📡 Fetching RSS feeds...");
  const allItems = [];
  for (const feed of RSS_FEEDS) {
    const items = await fetchFeed(feed);
    allItems.push(...items);
  }

  console.log(`\n📋 Total items collected: ${allItems.length}`);

  // Filter & deduplicate
  const newItems = allItems.filter((item) => !existingLinks.has(item.link));
  console.log(`🆕 New items (not yet published): ${newItems.length}`);

  if (newItems.length === 0) {
    console.log("ℹ️  No new items to process.");
    return;
  }

  // Process up to `remaining` items
  const toProcess = newItems.slice(0, remaining);
  const newJobs = [];

  for (const item of toProcess) {
    const cleanDesc = stripHTML(item.description || "");
    const category = detectCategory(item.title, cleanDesc);
    const baseSlug = slugify(item.title);
    const id = `${baseSlug}-${today}`;

    // Skip if ID already exists
    if (existingIds.has(id)) continue;

    const job = {
      id,
      title: item.title,
      company: "Recruteur",
      location: "Sénégal",
      type: "Non précisé",
      category,
      salary: "Non communiqué",
      date: today,
      image: getImageForCategory(category),
      excerpt: cleanDesc.slice(0, 200) + (cleanDesc.length > 200 ? "..." : ""),
      description: `## Présentation de l'opportunité\n\n${cleanDesc}\n\n## Informations pratiques\n\n- **Source**: ${item.source}\n- **Lien original**: ${item.link}`,
      tags: [category.split(" & ")[0]],
      sourceUrl: item.link,
      source: item.source,
    };

    newJobs.push(job);
    existingLinks.add(item.link);
    existingIds.add(id);

    console.log(`  ✨ New job: [${category}] ${item.title}`);
  }

  if (newJobs.length === 0) {
    console.log("ℹ️  No valid new jobs to add after deduplication.");
    return;
  }

  // Merge and sort by date
  const updatedJobs = [...newJobs, ...existingJobs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Save updated jobs
  writeFileSync(JOBS_PATH, JSON.stringify(updatedJobs, null, 2));

  // Update log
  log.count += newJobs.length;
  log.published = Array.from(existingLinks);
  saveFetchLog(log);

  console.log(`\n✅ Added ${newJobs.length} new job(s). Total: ${updatedJobs.length}`);
  console.log(`📊 Daily count: ${log.count}/${MAX_PER_DAY}\n`);
}

main().catch(console.error);
