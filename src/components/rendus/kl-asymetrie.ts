// Fiche « divergence-kl » : D(p ‖ q) et D(q ‖ p) ne sont pas égales.
// p = (0,5 ; 0,3 ; 0,2) fixe ; q = ((1 − c)/2 ; (1 − c)/2 ; c) où c = q(champ) est réglable.
// Exemple : c = 0,02 : D(p ‖ q) ≈ 0,323, D(q ‖ p) ≈ 0,185.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'divergence-kl';
const P = [0.5, 0.3, 0.2];
const MOTS = ['marché', 'travail', 'champ'];
export const kl = (a: number[], b: number[]) => a.reduce((s, x, i) => s + (x > 0 ? x * Math.log(x / b[i]) : 0), 0);

export const etats: Record<string, Etat> = { initial: { c: 0.02 } };

function gabarit() {
  return MOTS.map((m, i) => {
    const x = 30 + i * 100;
    return `
      <rect x="${x}" y="${170 - P[i] * 250}" width="34" height="${P[i] * 250}" rx="3" class="svg-entree" />
      <rect data-q="${i}" x="${x + 38}" width="34" rx="3" class="svg-parametre" />
      <text x="${x + 17}" y="${164 - P[i] * 250}" text-anchor="middle" class="svg-texte" font-size="10">${fr(P[i], 2)}</text>
      <text data-v="${i}" x="${x + 55}" text-anchor="middle" class="svg-texte" font-size="10"></text>
      <text x="${x + 36}" y="186" text-anchor="middle" class="svg-doux" font-size="11">${m}</text>`;
  }).join('') + `
    <line x1="20" y1="170" x2="330" y2="170" class="svg-trait-doux" />
    <text x="20" y="16" class="svg-entree" font-size="11" font-weight="600">bleu : p (données)</text>
    <text x="160" y="16" class="svg-parametre" font-size="11" font-weight="600">vert : q (modèle)</text>
    <text x="4" y="216" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="236" class="svg-texte" font-size="13" font-weight="700" data-t2></text>
    <text x="4" y="256" class="svg-doux" font-size="11" data-t3></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const c = e.c, Q = [(1 - c) / 2, (1 - c) / 2, c];
  Q.forEach((v, i) => {
    const h = v * 250;
    attrs(q(svg, `[data-q="${i}"]`), { y: 170 - h, height: h });
    const t = q(svg, `[data-v="${i}"]`);
    attrs(t, { y: 164 - h });
    t.textContent = fr(v, 2);
  });
  const a = kl(P, Q), b = kl(Q, P);
  texte(svg, '[data-t1]', `D(p ‖ q) = ${fr(a, 3)} nat`);
  texte(svg, '[data-t2]', `D(q ‖ p) = ${fr(b, 3)} nat`);
  texte(svg, '[data-t3]', a > b ? 'q néglige un mot que p utilise : D(p ‖ q) punit fort' : 'les deux sens donnent des valeurs différentes');
  scene.setAttribute('aria-label', `q(champ) = ${fr(c, 2)}. Divergence de p vers q ${fr(a, 3)}, de q vers p ${fr(b, 3)}.`);
}
