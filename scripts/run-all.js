/**
 * run-all.js
 * Master script that runs all automation steps in sequence
 * Usage: node scripts/run-all.js
 */

import { execSync } from "child_process";

const steps = [
  {
    name: "📡 Fetch RSS Feeds",
    cmd: "node scripts/fetch-rss.js",
  },
  {
    name: "🤖 AI Content Generation",
    cmd: "node scripts/generate-ai.js",
  },
  {
    name: "📄 Generate Static Pages",
    cmd: "node scripts/generate-pages.js",
  },
];

console.log("\n🚀 Wuut Liggey — Full Automation Pipeline");
console.log("==========================================");
console.log(`⏰ Started at: ${new Date().toLocaleString("fr-FR")}\n`);

for (const step of steps) {
  console.log(`\n${step.name}`);
  console.log("-".repeat(40));
  try {
    execSync(step.cmd, { stdio: "inherit" });
    console.log(`✅ ${step.name} completed`);
  } catch (err) {
    console.error(`❌ ${step.name} failed:`, err.message);
    process.exit(1);
  }
}

console.log("\n🎉 All steps completed successfully!");
console.log(`⏰ Finished at: ${new Date().toLocaleString("fr-FR")}\n`);
