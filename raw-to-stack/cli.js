#!/usr/bin/env node
// raw-to-stack 一键安装器
// 用法: npx https://raw.githubusercontent.com/shutiaostars/shutiaostars.github.io/main/raw-to-stack/cli.js

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE = 'https://raw.githubusercontent.com/shutiaostars/shutiaostars.github.io/main/raw-to-stack';
const FILES = [
  'SKILL.md',
  'scripts/run.sh',
  'scripts/lr_workflow.applescript',
  'scripts/robotou_workflow.applescript',
];
const DEST = path.join(process.env.HOME, '.claude', 'skills', 'raw-to-stack');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

(async () => {
  console.log('  Installing raw-to-stack skill...\n');
  for (const f of FILES) {
    const url = `${BASE}/${f}`;
    const dest = path.join(DEST, f);
    process.stdout.write(`  ↓ ${f} ... `);
    await download(url, dest);
    console.log('✓');
  }
  execSync(`chmod +x "${path.join(DEST, 'scripts', 'run.sh')}"`);
  console.log(`\n  ✅ 安装完成: ${DEST}`);
  console.log('  💡 在 Claude Code 中即可使用 raw-to-stack skill\n');
})().catch((err) => {
  console.error('  ❌ 安装失败:', err.message);
  process.exit(1);
});
