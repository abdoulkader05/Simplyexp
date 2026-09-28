// Captures de vérification d'une page : 360 px, 1280 px et mouvement réduit.
// Usage : node scripts/captures.mjs <chemin> <dossier-sortie>   (serveur déjà lancé sur :4321)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [chemin = '/', sortie = 'rapports/captures'] = process.argv.slice(2);
const base = process.env.BASE_URL ?? 'http://localhost:4321';
mkdirSync(sortie, { recursive: true });

const cas = [
  { nom: 'mobile-360', viewport: { width: 360, height: 780 }, reducedMotion: 'no-preference' },
  { nom: 'desktop-1280', viewport: { width: 1280, height: 860 }, reducedMotion: 'no-preference' },
  { nom: 'mobile-360-reduit', viewport: { width: 360, height: 780 }, reducedMotion: 'reduce' },
  { nom: 'desktop-1280-sombre', viewport: { width: 1280, height: 860 }, reducedMotion: 'no-preference', colorScheme: 'dark' },
];

const navigateur = await chromium.launch();
let echec = false;
for (const c of cas) {
  const page = await navigateur.newPage({ viewport: c.viewport, reducedMotion: c.reducedMotion, colorScheme: c.colorScheme ?? 'light' });
  const erreurs = [];
  page.on('console', (m) => m.type() === 'error' && erreurs.push(m.text()));
  page.on('pageerror', (e) => erreurs.push(String(e)));
  await page.goto(base + chemin, { waitUntil: 'networkidle' });
  // Défile toute la page pour réveiller les îlots, puis revient en haut.
  const hauteur = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < hauteur; y += 400) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${sortie}/${c.nom}-haut.png` });
  await page.screenshot({ path: `${sortie}/${c.nom}-pleine.png`, fullPage: true });
  // Une capture par étape d'un PasAPas, s'il y en a.
  const etapes = await page.locator('[data-pas-a-pas] .etape').count();
  for (let i = 0; i < etapes; i++) {
    await page.locator('[data-pas-a-pas] .etape').nth(i).evaluate((el) => {
      const r = el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + r.top - window.innerHeight * 0.45);
    });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${sortie}/${c.nom}-etape-${i + 1}.png` });
  }
  // Composants interactifs capturés seuls.
  for (const [sel, nom] of [['[data-formule]', 'formule'], ['[data-simulation]', 'simulation'], ['[data-quiz]', 'quiz'], ['[data-exercice]', 'exercice']]) {
    const n = await page.locator(sel).count();
    for (let i = 0; i < n; i++) {
      const el = page.locator(sel).nth(i);
      await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
      await el.screenshot({ path: `${sortie}/${c.nom}-${nom}-${i + 1}.png` });
    }
  }
  const debord = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`${c.nom} : débordement horizontal ${debord}px, erreurs console ${erreurs.length}`);
  erreurs.forEach((e) => console.log('   ', e));
  if (debord > 0 || erreurs.length) echec = true;
  await page.close();
}
await navigateur.close();
process.exit(echec ? 1 : 0);
