// Fiche « biais-variance » : 50 jeux de 10 comptages, un polynôme de degré d ajusté sur chacun.
// Biais² = écart entre la courbe moyenne et la vraie tendance ; variance = dispersion des courbes.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';
import { vraie, ajuster, jeu } from '../animations/polynome';

export const fiche = 'biais-variance';
const JEUX = 50, AFFICHES = 20, BRUIT = 0.64;
const px = (h: number) => 16 + ((h - 6) / 12) * 308;
const py = (y: number) => 196 - (Math.max(-1, Math.min(11, y)) / 11) * 176;
const H = Array.from({ length: 49 }, (_, i) => 6 + i * 0.25);

const cache = new Map<number, { courbes: number[][]; moyenne: number[]; b2: number; v: number }>();
function calculer(d: number) {
  if (cache.has(d)) return cache.get(d)!;
  const courbes = Array.from({ length: JEUX }, (_, s) => { const f = ajuster(d, 1e-9, jeu(100 + s)).f; return H.map(f); });
  const moyenne = H.map((_, k) => courbes.reduce((a, c) => a + c[k], 0) / JEUX);
  let b2 = 0, v = 0;
  H.forEach((h, k) => {
    b2 += (moyenne[k] - vraie(h)) ** 2;
    v += courbes.reduce((a, c) => a + (c[k] - moyenne[k]) ** 2, 0) / JEUX;
  });
  const r = { courbes, moyenne, b2: b2 / H.length, v: v / H.length };
  cache.set(d, r);
  return r;
}

export const etats: Record<string, Etat> = { initial: { degre: 3 } };

function gabarit() {
  return `
    <defs><clipPath id="bv-cadre"><rect x="10" y="14" width="320" height="188" /></clipPath></defs>
    <line x1="${px(6)}" y1="${py(0)}" x2="${px(18)}" y2="${py(0)}" class="svg-trait-doux" />
    ${[6, 12, 18].map((h) => `<text x="${px(h)}" y="${py(0) + 13}" text-anchor="middle" class="svg-doux" font-size="10">${h} h</text>`).join('')}
    <g clip-path="url(#bv-cadre)">
      ${Array.from({ length: AFFICHES }, (_, i) => `<polyline data-c="${i}" class="svg-ligne svg-trait-parametre" stroke-width="1" stroke-opacity=".3" />`).join('')}
      <polyline points="${points(H.map((h) => [px(h), py(vraie(h))]))}" class="svg-ligne svg-trait-encre svg-pointille" stroke-width="2" />
      <polyline data-moyenne class="svg-ligne svg-trait-sortie" stroke-width="3" />
    </g>
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const d = Math.max(0, Math.min(9, Math.round(e.degre)));
  const r = calculer(d);
  for (let i = 0; i < AFFICHES; i++) attrs(q(svg, `[data-c="${i}"]`), { points: points(H.map((h, k) => [px(h), py(r.courbes[i][k])])) });
  attrs(q(svg, '[data-moyenne]'), { points: points(H.map((h, k) => [px(h), py(r.moyenne[k])])) });
  const total = r.b2 + r.v + BRUIT;
  texte(svg, '[data-t1]', `degré ${d} : biais² ${fr(r.b2, 2)} ; variance ${fr(r.v, 2)}`);
  texte(svg, '[data-t2]', `erreur attendue ≈ ${fr(r.b2, 2)} + ${fr(r.v, 2)} + bruit 0,64 = ${fr(total, 2)}`);
  scene.setAttribute('aria-label', `Degré ${d} : biais au carré ${fr(r.b2, 2)}, variance ${fr(r.v, 2)}, erreur attendue ${fr(total, 2)}.`);
}
