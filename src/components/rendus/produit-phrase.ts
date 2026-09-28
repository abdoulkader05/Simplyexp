// Fiche « regle-produit » : P(« je vais au marché ») = P(je) × P(vais | je) × P(au | je vais) × P(marché | je vais au).
// Probabilités d'exemple : 0,05 ; 0,2 ; 0,3 ; 0,1 → produit 0,000 3 ; somme des logarithmes ≈ −8,11.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'regle-produit';
export const MOTS = [
  { mot: 'je', p: 0.05, cond: 'P(je)' },
  { mot: 'vais', p: 0.2, cond: 'P(vais | je)' },
  { mot: 'au', p: 0.3, cond: 'P(au | je vais)' },
  { mot: 'marché', p: 0.1, cond: 'P(marché | je vais au)' },
];

export const etats: Record<string, Etat> = { initial: { n: 0 }, m1: { n: 1 }, m2: { n: 2 }, m3: { n: 3 }, m4: { n: 4 } };

function gabarit() {
  return MOTS.map((m, i) => {
    const y = 34 + i * 40;
    return `
      <text data-m="${i}" x="4" y="${y + 13}" class="svg-texte" font-size="14" font-weight="600">${m.mot}</text>
      <text data-c="${i}" x="70" y="${y + 13}" class="svg-doux" font-size="11">${m.cond}</text>
      <rect x="210" y="${y}" width="100" height="18" rx="3" fill="none" class="svg-trait" />
      <rect data-b="${i}" x="210" y="${y}" height="18" rx="3" class="svg-sortie" />
      <text data-v="${i}" x="336" y="${y + 13}" text-anchor="end" class="svg-texte" font-size="12" font-weight="600">${fr(m.p, 2)}</text>`;
  }).join('') + `
    <text x="4" y="206" class="svg-texte" font-size="13" data-t0></text>
    <text x="4" y="230" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  let prod = 1, lg = 0;
  MOTS.forEach((m, i) => {
    const vis = Math.max(0, Math.min(1, e.n - i));
    attrs(q(svg, `[data-b="${i}"]`), { width: 100 * m.p * vis });
    for (const k of ['m', 'c', 'v']) q(svg, `[data-${k}="${i}"]`).style.opacity = String(0.25 + 0.75 * vis);
    if (vis > 0.5) { prod *= m.p; lg += Math.log(m.p); }
  });
  const n = Math.round(e.n);
  const phrase = MOTS.slice(0, n).map((m) => m.mot).join(' ');
  texte(svg, '[data-t0]', n ? `phrase : « ${phrase} »` : 'on part d’une phrase vide');
  texte(svg, '[data-t1]', n ? `probabilité = ${MOTS.slice(0, n).map((m) => fr(m.p, 2, 0)).join(' × ')} = ${fr(prod, 4)}` : 'probabilité = 1');
  texte(svg, '[data-t2]', n ? `somme des logarithmes : ${fr(lg, 2)}` : '');
  scene.setAttribute('aria-label', n ? `Phrase ${phrase} : probabilité ${fr(prod, 4)}, somme des logarithmes ${fr(lg, 2)}.` : 'Phrase vide.');
}
