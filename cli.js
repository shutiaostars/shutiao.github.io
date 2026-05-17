#!/usr/bin/env node
// raw-to-stack 一键安装器
// 用法: npx github:shutiaostars/raw-to-stack

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC = __dirname;
const DEST = path.join(process.env.HOME, '.claude', 'skills', 'raw-to-stack');
const FILES = ['SKILL.md', 'cli.js', 'scripts/run.sh', 'scripts/lr_workflow.applescript', 'scripts/robotou_workflow.applescript'];

console.log('  Installing raw-to-stack skill...\n');

for (const f of FILES) {
  const src = path.join(SRC, f);
  const dest = path.join(DEST, f);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  ✓ ${f}`);
}

execSync(`chmod +x "${path.join(DEST, 'scripts', 'run.sh')}"`);
console.log(`\n  ✅ 安装完成: ${DEST}`);
console.log('  💡 在 Claude Code 中即可使用 raw-to-stack skill');
