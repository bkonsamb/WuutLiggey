/**
 * generate-ai.js
 * Uses Groq API to humanize and rewrite raw job descriptions
 * Uses neutral job board tone — NO "we recruit" language
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const JOBS_PATH = join(ROOT, "public", "data", "jobs.json");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `Tu es un rédacteur professionnel spécialisé dans les offres d'emploi en Afrique francophone.

RÈGLES STRICTES :
- Style neutre de site d'emploi (PAS de recruteur)
- N'ÉCRIS JAMAIS "nous recrutons", "rejoignez notre équipe", "notre entreprise"
- N'invente AUCUNE information absente du texte source
- Reformule intelligemment sans copier mot pour mot
- Ton : naturel, humain, crédible, professionnel

FORMAT DE SORTIE (Markdown) :
## Présentation de l'opportunité
[2-3 phrases de contexte neutre sur le poste]

## Responsabilités principales
- [point 1]
- [point 2]
- [point 3]
- [point 4]

## Profil recherché
- [critère 1]
- [critère 2]
- [critère 3]

## Informations pratiques
- **Localisation** : [ville], Sénégal
- **Type de contrat** : [type]
- **Rémunération** : [salaire ou "Non communiqué"]`;

/**
 * Call Groq API to rewrite a job description
 */
async function rewriteJobDescription(rawJob) {
  if (!GROQ_API_KEY) {
    console.warn("⚠️  GROQ_API_KEY not set. Skipping AI rewrite.");
    return null;
  }

  const userPrompt = `Voici les informations brutes d'une offre d'emploi. Reformule-la selon le format demandé.

Titre : ${rawJob.title}
Entreprise : ${rawJob.company}
Localisation : ${rawJob.location}
Type de contrat : ${rawJob.type}
Salaire : ${rawJob.salary}
Catégorie : ${rawJob.category}
Description brute : ${rawJob.description.slice(0, 2000)}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API error: ${response.status} — ${err}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error(`  ❌ AI error for "${rawJob.title}": ${err.message}`);
    return null;
  }
}

/**
 * Generate excerpt from description
 */
function generateExcerpt(description, maxLength = 200) {
  const clean = description
    .replace(/^## .+$/gm, "")
    .replace(/^- /gm, "")
    .replace(/\*\*/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return clean.slice(0, maxLength) + (clean.length > maxLength ? "..." : "");
}

/**
 * Extract tags from title and description
 */
function extractTags(title, description) {
  const skillKeywords = [
    "JavaScript", "React", "Node.js", "Python", "PHP", "Java", "SQL", "Excel",
    "Power BI", "Tableau", "Google Ads", "Meta Ads", "SEO", "Sage", "OHADA",
    "AutoCAD", "MS Project", "BTP", "Finance", "Marketing", "Data", "Banque",
    "Logistique", "RH", "Juridique", "Santé", "Médical", "Enseignement",
  ];
  const text = title + " " + description;
  return skillKeywords.filter((kw) => new RegExp(kw, "i").test(text)).slice(0, 5);
}

/**
 * Main function: rewrite jobs that need AI processing
 */
async function main() {
  console.log("\n🤖 Wuut Liggey — AI Content Generator");
  console.log("======================================\n");

  let jobs;
  try {
    jobs = JSON.parse(readFileSync(JOBS_PATH, "utf-8"));
  } catch (err) {
    console.error("❌ Cannot load jobs.json:", err.message);
    process.exit(1);
  }

  // Find jobs that need AI processing (marked with needsAI or having raw description)
  const jobsToProcess = jobs.filter((j) => j.needsAI === true);

  if (jobsToProcess.length === 0) {
    console.log("ℹ️  No jobs need AI processing.");
    return;
  }

  console.log(`📝 Processing ${jobsToProcess.length} job(s) with AI...\n`);

  let processed = 0;
  for (const job of jobsToProcess) {
    console.log(`  🔄 Rewriting: "${job.title}"`);

    const rewritten = await rewriteJobDescription(job);

    if (rewritten) {
      job.description = rewritten;
      job.excerpt = generateExcerpt(rewritten);
      job.tags = extractTags(job.title, rewritten);
      job.needsAI = false;
      job.aiProcessed = true;
      processed++;
      console.log(`  ✅ Done: "${job.title}"`);
    } else {
      console.log(`  ⏭️  Skipped (no rewrite): "${job.title}"`);
    }

    // Rate limiting: wait 1 second between requests
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Save updated jobs
  writeFileSync(JOBS_PATH, JSON.stringify(jobs, null, 2));
  console.log(`\n✅ AI processing complete. ${processed}/${jobsToProcess.length} jobs rewritten.\n`);
}

main().catch(console.error);
