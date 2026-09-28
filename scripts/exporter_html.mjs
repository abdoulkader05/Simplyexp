// Exporte une page en un seul fichier HTML statique (CSS et polices intégrés, sans JS).
// Les animations sont figées dans leur version « mouvement réduit » : une image par étape.
// Usage : node scripts/exporter_html.mjs <chemin> <fichier-sortie>   (serveur lancé, BASE_URL)
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const [chemin, sortie] = process.argv.slice(2);
const base = process.env.BASE_URL ?? 'http://localhost:4321';
const navigateur = await chromium.launch();
const page = await navigateur.newPage({ viewport: { width: 400, height: 900 }, reducedMotion: 'reduce' });
await page.goto(base + chemin, { waitUntil: 'networkidle' });
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 300) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(50); }
await page.waitForTimeout(800);

// Feuilles de style : on les récupère et on intègre les polices en data: URI.
const liens = await page.evaluate(() => [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href));
let css = '';
for (const href of liens) {
  let texte = await (await page.request.get(href)).text();
  const urls = [...new Set([...texte.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/["']/g, '')))];
  for (const u of urls) {
    if (u.startsWith('data:')) continue;
    const abs = new URL(u, href).href;
    const rep = await page.request.get(abs);
    if (!rep.ok()) continue;
    const type = abs.endsWith('.woff2') ? 'font/woff2' : abs.endsWith('.woff') ? 'font/woff' : abs.endsWith('.ttf') ? 'font/ttf' : 'application/octet-stream';
    // Seules les polices woff2 sont gardées, pour limiter le poids.
    const donnees = type === 'font/woff2' ? `data:${type};base64,${(await rep.body()).toString('base64')}` : 'about:blank';
    texte = texte.split(u).join(donnees);
  }
  css += texte + '\n';
}

const html = await page.evaluate((styles) => {
  document.documentElement.classList.remove('js'); // version sans JS : dépliables ouverts
  document.querySelectorAll('script, link[rel="stylesheet"], link[rel="modulepreload"]').forEach((n) => n.remove());
  document.querySelectorAll('.pap-cadre, [data-quiz] .quiz-retour').forEach((n) => n.removeAttribute('hidden'));
  const style = document.createElement('style');
  style.textContent = styles;
  document.head.append(style);
  return '<!doctype html>\n' + document.documentElement.outerHTML;
}, css);
writeFileSync(sortie, html);
console.log(`${sortie} : ${(html.length / 1024).toFixed(0)} Ko`);
await navigateur.close();
