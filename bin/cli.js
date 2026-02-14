#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// ANSI colors
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  white: "\x1b[37m",
};

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
console.log(`  ${c.bold}${c.cyan}\u{1F504} ralph-init${c.reset}`);
console.log(`  ${c.dim}the re-regurgitated version${c.reset}`);
console.log("");

if (created.length > 0) {
  console.log(`  ${c.green}\u{2714} Created:${c.reset}`);
  for (const file of created) {
    console.log(`    ${c.green}\u{2502}${c.reset} ${file}`);
  }
}

if (skipped.length > 0) {
  console.log("");
  console.log(`  ${c.yellow}\u{25CB} Skipped (already exist):${c.reset}`);
  for (const file of skipped) {
    console.log(`    ${c.yellow}\u{2502}${c.reset} ${c.dim}${file}${c.reset}`);
  }
}

if (!inGitRepo) {
  console.log("");
  console.log(`  ${c.red}\u{26A0} Not inside a git repository.${c.reset}`);
  console.log(`    RALPH commits after each task - run ${c.bold}git init${c.reset} first.`);
}

console.log("");
console.log(`  ${c.bold}${c.magenta}\u{1F680} Three Phases, Two Prompts, One Loop:${c.reset}`);
console.log("");
console.log(`    ${c.cyan}\u{1F4AC} Phase 1${c.reset} ${c.dim}\u{2500}${c.reset} Define requirements with Claude`);
console.log(`              Chat to create spec files in ${c.bold}specs/${c.reset}`);
console.log("");
console.log(`    ${c.cyan}\u{1F4CB} Phase 2${c.reset} ${c.dim}\u{2500}${c.reset} Plan ${c.dim}(gap analysis \u{2192} task list)${c.reset}`);
console.log(`              ${c.bold}./loop.sh plan${c.reset}`);
console.log("");
console.log(`    ${c.cyan}\u{1F528} Phase 3${c.reset} ${c.dim}\u{2500}${c.reset} Build ${c.dim}(one task per loop, fresh context)${c.reset}`);
console.log(`              ${c.bold}./loop.sh build${c.reset}`);
console.log("");
