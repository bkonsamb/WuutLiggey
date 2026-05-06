/**
 * generate-pages.js
 * Generates individual HTML pages for each job offer
 * Creates sitemap.xml automatically
 * SEO optimized output
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const JOBS_PATH = join(ROOT, "public", "data", "jobs.json");
const JOBS_DIR = join(ROOT, "public", "jobs");
const SITEMAP_PATH = join(ROOT, "public", "sitemap.xml");
const ROBOTS_PATH = join(ROOT, "public", "robots.txt");

const BASE_URL = "https://wuut-liggey.github.io";

/**
 * Render Markdown-like content to HTML
 */
function renderDescription(text) {
  return text
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li><span class=\"bullet\">▸</span><span>$1</span></li>")
    .replace(/(<li[\s\S]*?<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hup])(.+)$/gm, (line) => line.trim() ? `<p>${line}</p>` : "");
}

/**
 * Generate individual job HTML page
 */
function generateJobPage(job) {
  const description = renderDescription(job.description);
  const pageUrl = `${BASE_URL}/jobs/${job.id}.html`;
  const publishDate = new Date(job.date).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
  const tagsHtml = job.tags.map((t) => `<span class="tag">${t}</span>`).join("");

  const whatsappMsg = encodeURIComponent(
    `Bonjour, je souhaite postuler à l'offre "${job.title}" chez ${job.company} via Wuut Liggey.`
  );

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${job.title} – ${job.company} | Wuut Liggey Emploi Sénégal</title>
  <meta name="description" content="${job.excerpt.slice(0, 160)}" />
  <meta name="keywords" content="${job.title}, ${job.company}, emploi ${job.location.split(",")[0]}, ${job.category}, offre d'emploi Sénégal" />
  <meta property="og:title" content="${job.title} chez ${job.company}" />
  <meta property="og:description" content="${job.excerpt.slice(0, 200)}" />
  <meta property="og:image" content="${job.image}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="${pageUrl}" />
  <link rel="stylesheet" href="../styles/job-page.css" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": "${job.title}",
    "description": "${job.excerpt.replace(/"/g, '\\"')}",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "${job.company}"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "${job.location.split(",")[0]}",
        "addressCountry": "SN"
      }
    },
    "employmentType": "${job.type === "CDI" ? "FULL_TIME" : job.type === "CDD" ? "TEMPORARY" : "OTHER"}",
    "datePosted": "${job.date}",
    "image": "${job.image}"
  }
  </script>
</head>
<body>
  <!-- Header -->
  <header class="site-header">
    <div class="container">
      <a href="../index.html" class="logo">
        <div class="logo-icon">💼</div>
        <div>
          <span class="logo-name">Wuut Liggey</span>
          <span class="logo-sub">Emploi au Sénégal</span>
        </div>
      </a>
      <a href="../index.html" class="back-btn">← Toutes les offres</a>
    </div>
  </header>

  <!-- Main -->
  <main class="main-content">
    <div class="container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <a href="../index.html">Accueil</a>
        <span>›</span>
        <a href="../index.html">Offres d'emploi</a>
        <span>›</span>
        <span>${job.title}</span>
      </nav>

      <div class="content-grid">
        <!-- Article -->
        <article>
          <!-- Hero -->
          <div class="job-hero">
            <img src="${job.image}" alt="${job.title}" class="hero-img" loading="eager" />
            <div class="hero-overlay">
              <div class="hero-badges">
                <span class="badge badge-type">${job.type}</span>
                <span class="badge badge-cat">${job.category}</span>
              </div>
              <h1 class="hero-title">${job.title}</h1>
            </div>
          </div>

          <!-- Company Bar -->
          <div class="company-bar">
            <div class="company-info">
              <div class="company-avatar">${job.company.charAt(0)}</div>
              <div>
                <p class="company-name">${job.company}</p>
                <p class="company-cat">${job.category}</p>
              </div>
            </div>
            <div class="meta-list">
              <span class="meta-item">📍 ${job.location}</span>
              <span class="meta-item">📅 ${publishDate}</span>
              <span class="meta-item">💰 ${job.salary}</span>
            </div>
          </div>

          <!-- AdSense -->
          <div class="ad-slot">
            <!-- Google AdSense BEGIN -->
            <!-- 
            <ins class="adsbygoogle"
              style="display:block"
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot="XXXXXXXXXX"
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
            -->
            <p class="ad-placeholder">Espace publicitaire — Google AdSense</p>
          </div>

          <!-- Description -->
          <div class="job-description">
            ${description}
          </div>

          <!-- Tags -->
          ${job.tags.length > 0 ? `
          <div class="tags-section">
            <h3>Compétences clés</h3>
            <div class="tags">${tagsHtml}</div>
          </div>` : ""}

          <!-- Share -->
          <div class="share-section">
            <p>Partager cette offre :</p>
            <a href="https://wa.me/?text=${encodeURIComponent(`Offre d'emploi : ${job.title} chez ${job.company} — ${pageUrl}`)}" target="_blank" rel="noopener" class="share-btn share-wa">WhatsApp</a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}" target="_blank" rel="noopener" class="share-btn share-li">LinkedIn</a>
          </div>
        </article>

        <!-- Sidebar -->
        <aside>
          <div class="apply-card">
            <h3>Intéressé(e) ?</h3>
            <p>Postulez directement via WhatsApp</p>
            <a href="https://wa.me/221700000000?text=${whatsappMsg}" target="_blank" rel="noopener" class="apply-btn">
              📱 Postuler via WhatsApp
            </a>
            <a href="mailto:candidatures@wuut-liggey.sn" class="apply-btn-secondary">
              ✉️ Envoyer un email
            </a>
          </div>

          <div class="summary-card">
            <h3>Résumé</h3>
            <dl>
              <dt>Entreprise</dt><dd>${job.company}</dd>
              <dt>Localisation</dt><dd>${job.location}</dd>
              <dt>Contrat</dt><dd>${job.type}</dd>
              <dt>Salaire</dt><dd>${job.salary}</dd>
              <dt>Secteur</dt><dd>${job.category}</dd>
              <dt>Publication</dt><dd>${publishDate}</dd>
            </dl>
          </div>

          <!-- Sidebar AdSense -->
          <div class="ad-slot-sidebar">
            <!-- Google AdSense Sidebar -->
            <p class="ad-placeholder">Espace publicitaire</p>
          </div>
        </aside>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <p>© ${new Date().getFullYear()} Wuut Liggey — <a href="../index.html">Retour aux offres</a></p>
    </div>
  </footer>
</body>
</html>`;
}

/**
 * Generate sitemap.xml
 */
function generateSitemap(jobs) {
  const today = new Date().toISOString().split("T")[0];
  const jobUrls = jobs.map((job) => `
  <url>
    <loc>${BASE_URL}/jobs/${job.id}.html</loc>
    <lastmod>${job.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/index.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${jobUrls}
</urlset>`;
}

/**
 * Generate robots.txt
 */
function generateRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml

# Wuut Liggey — Emploi au Sénégal
# https://wuut-liggey.github.io
`;
}

/**
 * Main function
 */
async function main() {
  console.log("\n📄 Wuut Liggey — Static Page Generator");
  console.log("=======================================\n");

  let jobs;
  try {
    jobs = JSON.parse(readFileSync(JOBS_PATH, "utf-8"));
  } catch (err) {
    console.error("❌ Cannot load jobs.json:", err.message);
    process.exit(1);
  }

  // Create jobs directory
  if (!existsSync(JOBS_DIR)) {
    mkdirSync(JOBS_DIR, { recursive: true });
    console.log("📁 Created /public/jobs directory");
  }

  // Generate individual job pages
  let generated = 0;
  for (const job of jobs) {
    const outputPath = join(JOBS_DIR, `${job.id}.html`);
    const html = generateJobPage(job);
    writeFileSync(outputPath, html, "utf-8");
    generated++;
    console.log(`  📄 Generated: /jobs/${job.id}.html`);
  }

  // Generate sitemap
  const sitemap = generateSitemap(jobs);
  writeFileSync(SITEMAP_PATH, sitemap, "utf-8");
  console.log(`\n🗺️  sitemap.xml updated (${jobs.length} URLs)`);

  // Generate robots.txt
  const robots = generateRobots();
  writeFileSync(ROBOTS_PATH, robots, "utf-8");
  console.log("🤖 robots.txt updated");

  console.log(`\n✅ Generated ${generated} job pages successfully!\n`);
}

main().catch(console.error);
