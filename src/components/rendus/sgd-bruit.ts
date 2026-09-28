// Fiche « sgd-minibatch » : 200 trajets simulés (prix ≈ 140 F/km + bruit), modèle prix = w × distance.
// On compare 40 pas de descente avec des lots de taille m à la descente sur toutes les données.
// Tirages pseudo-aléatoires à graine fixe : l'animation est la même à chaque visite.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';

export const fiche = 'sgd-minibatch';
const ETA = 0.004, PAS = 40, N = 200;

function generateur(graine: number) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const alea = generateur(2026);
const X: number[] = [], Y: number[] = [];
for (let i = 0; i < N; i++) {
  const x = 1 + Math.round(alea() * 18) / 2; // de 1 à 10 km, par demi-kilomètre
  const bruit = Math.sqrt(-2 * Math.log(alea() + 1e-12)) * Math.cos(2 * Math.PI * alea()) * 80;
  X.push(x); Y.push(Math.round((140 * x + bruit) / 25) * 25);
}
const gradient = (w: number, lot: number[]) => (2 / lot.length) * lot.reduce((s, i) => s + X[i] * (w * X[i] - Y[i]), 0);
const tous = [...Array(N).keys()];

function trajectoire(m: number) {
  const tire = generateur(7 + m);
  const w = [0];
  for (let t = 0; t < PAS; t++) {
    const lot = m >= N ? tous : Array.from({ length: m }, () => Math.floor(tire() * N));
    w.push(w[t] - ETA * gradient(w[t], lot));
  }
  return w;
}
const REFERENCE = trajectoire(N);

const px = (t: number) => 34 + (t / PAS) * 296;
const py = (w: number) => 200 - (w / 180) * 180;

export const etats: Record<string, Etat> = { initial: { taille: 1 } };

function gabarit() {
  return `
    <line x1="${px(0)}" y1="${py(0)}" x2="${px(PAS)}" y2="${py(0)}" class="svg-trait-doux" />
    <line x1="${px(0)}" y1="${py(0)}" x2="${px(0)}" y2="${py(180)}" class="svg-trait-doux" />
    ${[50, 100, 150].map((v) => `<text x="${px(0) - 4}" y="${py(v) + 4}" text-anchor="end" class="svg-doux" font-size="10">${v}</text>`).join('')}
    <text x="${px(PAS)}" y="${py(0) + 14}" text-anchor="end" class="svg-doux" font-size="10">nombre de pas</text>
    <text x="${px(0) + 4}" y="${py(180) + 4}" class="svg-doux" font-size="10">tarif w</text>
    <polyline points="${points(REFERENCE.map((w, t) => [px(t), py(w)]))}" class="svg-ligne svg-trait-doux" stroke-width="2" stroke-dasharray="5 4" />
    <polyline data-sgd class="svg-ligne svg-trait-parametre" stroke-width="2" />
    <text x="4" y="232" class="svg-parametre" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const m = Math.max(1, Math.min(N, Math.round(e.taille)));
  const w = trajectoire(m);
  attrs(q(svg, '[data-sgd]'), { points: points(w.map((v, t) => [px(t), py(Math.max(0, Math.min(180, v)))])) });
  const fin = w.slice(20);
  const etendue = Math.max(...fin) - Math.min(...fin);
  texte(svg, '[data-t1]', `lot de m = ${m} trajet${m > 1 ? 's' : ''} : w₄₀ = ${fr(w[PAS], 1)}`);
  texte(svg, '[data-t2]', `pointillés : les ${N} trajets ; agitation en fin : ${fr(etendue, 1)} F`);
  scene.setAttribute('aria-label', `Descente avec des lots de ${m} trajets : après 40 pas, w vaut ${fr(w[PAS], 1)}. Sur les 20 derniers pas, w varie de ${fr(etendue, 1)}.`);
}
