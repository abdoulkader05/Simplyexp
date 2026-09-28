// Fiche « softmax » : scores de trois langues pour un SMS, transformés en probabilités.
// Scores (français, wolof, dioula) = (2 ; 1 ; 0) ; T = 1 : (0,665 ; 0,245 ; 0,090).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'softmax';
const LANGUES = ['français', 'wolof', 'dioula'];

export function softmax(z: number[], T = 1) {
  const m = Math.max(...z);
  const e = z.map((v) => Math.exp((v - m) / T));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}

export const etats: Record<string, Etat> = { initial: { T: 1, wolof: 1 } };

function gabarit() {
  const lignes = LANGUES.map((l, i) => {
    const y = 60 + i * 52;
    return `
      <text x="4" y="${y + 5}" class="svg-texte" font-size="13">${l}</text>
      <rect x="160" y="${y - 10}" width="170" height="18" rx="3" fill="none" class="svg-trait" />
      <rect data-p="${i}" x="160" y="${y - 10}" height="18" rx="3" class="svg-sortie" />
      <text data-tp="${i}" x="326" y="${y + 4}" text-anchor="end" class="svg-texte" font-size="12" font-weight="600"></text>
      <text data-tz="${i}" x="78" y="${y + 5}" class="svg-entree" font-size="13"></text>`;
  }).join('');
  return `
    <text x="78" y="26" class="svg-doux" font-size="10">score z</text>
    <text x="160" y="26" class="svg-doux" font-size="10">probabilité</text>
    ${lignes}
    <text x="4" y="232" class="svg-parametre" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const z = [2, e.wolof ?? 1, 0];
  const p = softmax(z, e.T);
  p.forEach((v, i) => {
    attrs(q(svg, `[data-p="${i}"]`), { width: Math.max(0.5, 170 * v) });
    texte(svg, `[data-tp="${i}"]`, fr(v, 3));
    texte(svg, `[data-tz="${i}"]`, `z = ${fr(z[i], 1, 0)}`);
  });
  texte(svg, '[data-t1]', `température T = ${fr(e.T, 2)}`);
  texte(svg, '[data-t2]', `somme des probabilités : ${fr(p.reduce((a, b) => a + b, 0), 3)}`);
  scene.setAttribute('aria-label', `Température ${fr(e.T, 2)}. Probabilités : français ${fr(p[0], 3)}, wolof ${fr(p[1], 3)}, dioula ${fr(p[2], 3)}.`);
}
