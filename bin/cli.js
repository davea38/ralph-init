#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "..", "templates");
const TARGET_DIR = process.cwd();

const templateFiles = fs.readdirSync(TEMPLATES_DIR);
const created = [];
const skipped = [];

// Copy template files
for (const file of templateFiles) {
  const dest = path.join(TARGET_DIR, file);
  if (fs.existsSync(dest)) {
    skipped.push(file);
  } else {
    fs.copyFileSync(path.join(TEMPLATES_DIR, file), dest);
    created.push(file);
  }
}

// Create specs/ directory
const specsDir = path.join(TARGET_DIR, "specs");
if (fs.existsSync(specsDir)) {
  skipped.push("specs/");
} else {
  fs.mkdirSync(specsDir);
  created.push("specs/");
}

// Make loop.sh executable
const loopSh = path.join(TARGET_DIR, "loop.sh");
if (fs.existsSync(loopSh)) {
  fs.chmodSync(loopSh, 0o755);
}

// Check if we're in a git repo
let inGitRepo = false;
try {
  let dir = TARGET_DIR;
  while (true) {
    if (fs.existsSync(path.join(dir, ".git"))) {
      inGitRepo = true;
      break;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
} catch {}

// Print results
console.log("");
console.log("  ralph-init");
console.log("");

if (created.length > 0) {
  console.log("  Created:");
  for (const file of created) {
    console.log(`    ${file}`);
  }
}

if (skipped.length > 0) {
  console.log("");
  console.log("  Skipped (already exist):");
  for (const file of skipped) {
    console.log(`    ${file}`);
  }
}

if (!inGitRepo) {
  console.log("");
  console.log("  Warning: Not inside a git repository.");
  console.log("  RALPH works best with git (it commits after each task).");
  console.log("  Run: git init");
}

console.log("");
console.log("  Next steps:");
console.log("    1. Write a spec in specs/ (one markdown file per topic)");
console.log("    2. Run ./loop.sh plan");
console.log("    3. Review IMPLEMENTATION_PLAN.md");
console.log("    4. Run ./loop.sh build");
console.log("");
