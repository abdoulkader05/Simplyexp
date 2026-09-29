// Contrôle rapide de toutes les pages du build : débordement horizontal à 360 px et erreurs console.
// Usage : node scripts/controle_pages.mjs   (serveur de prévisualisation sur BASE_URL, par défaut :4321)
import { chromium } from '@playwright/test';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const base = process.env.BASE_URL ?? 'http://localhost:4321';
const pages = [];
(function parcourir(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) parcourir(p);
    else if (f === 'index.html') pages.push('/' + relative('dist', d).split(sep).join('/') + (d === 'dist' ? '' : '/'));
  }
})('dist');

const navigateur = await chromium.launch();
const page = await navigateur.newPage({ viewport: { width: 360, height: 780 } });
let erreurs = [];
page.on('console', (m) => m.type() === 'error' && erreurs.push(m.text()));
page.on('pageerror', (e) => erreurs.push(String(e)));
let echecs = 0;
for (const chemin of pages.map((p) => p.replace('//', '/'))) {
  erreurs = [];
  await page.goto(base + chemin, { waitUntil: 'networkidle' });
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(40); }
  const debord = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (debord > 0 || erreurs.length) { echecs++; console.log(`✗ ${chemin} : débordement ${debord}px, ${erreurs.length} erreur(s) ${erreurs.slice(0, 2).join(' | ')}`); }
}
console.log(`${pages.length} pages contrôlées, ${echecs} en échec`);
await navigateur.close();
process.exit(echecs ? 1 : 0);
