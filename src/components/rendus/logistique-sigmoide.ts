// Fiche « regression-logistique » : 8 élèves, heures de révision par semaine et réussite (1) ou échec (0).
// P(réussite) = σ(w h + b). Meilleur ajustement : w ≈ 1,28 ; b ≈ −5,77 ; log-loss ≈ 0,313.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';

export const fiche = 'regression-logistique';
export const ELEVES: [number, number][] = [[1, 0], [2, 0], [3, 0], [4, 1], [5, 0], [6, 1], [7, 1], [8, 1]];
const sigma = (z: number) => 1 / (1 + Math.exp(-z));
const px = (h: number) => 30 + (h / 9) * 296;
const py = (p: number) => 190 - p * 160;

export const etats: Record<string, Etat> = { initial: { w: 1, b: -4.5 } };

function gabarit() {
  return `
    <line x1="${px(0)}" y1="${py(0)}" x2="${px(9)}" y2="${py(0)}" class="svg-trait-doux" />
    <line x1="${px(0)}" y1="${py(1)}" x2="${px(9)}" y2="${py(1)}" class="svg-trait-doux" stroke-dasharray="2 3" />
    <line x1="${px(0)}" y1="${py(0.5)}" x2="${px(9)}" y2="${py(0.5)}" class="svg-trait-doux" stroke-dasharray="2 3" />
    <text x="${px(0) - 4}" y="${py(0) + 4}" text-anchor="end" class="svg-doux" font-size="10">0</text>
    <text x="${px(0) - 4}" y="${py(0.5) + 4}" text-anchor="end" class="svg-doux" font-size="10">0,5</text>
    <text x="${px(0) - 4}" y="${py(1) + 4}" text-anchor="end" class="svg-doux" font-size="10">1</text>
    <text x="${px(9)}" y="${py(0) + 14}" text-anchor="end" class="svg-doux" font-size="10">heures de révision par semaine</text>
    <line data-frontiere y1="${py(1) - 6}" y2="${py(0)}" class="svg-trait-sortie" stroke-width="1.5" stroke-dasharray="4 3" />
    <polyline data-courbe class="svg-ligne svg-trait-parametre" stroke-width="2.5" />
    ${ELEVES.map(([h], i) => `<line data-e="${i}" class="svg-trait-perte" stroke-width="2" />`).join('')}
    ${ELEVES.map(([h, r]) => `<circle cx="${px(h)}" cy="${py(r)}" r="5.5" class="svg-entree" ${r ? '' : 'fill-opacity=".35"'} />`).join('')}
    <text x="4" y="16" class="svg-doux" font-size="10">points pleins : réussite ; clairs : échec</text>
    <text x="4" y="232" class="svg-parametre" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-perte" font-size="13" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const c: [number, number][] = [];
  for (let h = 0; h <= 9; h += 0.05) c.push([px(h), py(sigma(e.w * h + e.b))]);
  attrs(q(svg, '[data-courbe]'), { points: points(c) });
  let perte = 0;
  ELEVES.forEach(([h, r], i) => {
    const p = sigma(e.w * h + e.b);
    attrs(q(svg, `[data-e="${i}"]`), { x1: px(h), y1: py(r), x2: px(h), y2: py(p) });
    perte -= Math.log(Math.max(1e-12, r ? p : 1 - p));
  });
  perte /= ELEVES.length;
  const seuil = e.w !== 0 ? -e.b / e.w : NaN;
  const visible = Number.isFinite(seuil) && seuil >= 0 && seuil <= 9;
  attrs(q(svg, '[data-frontiere]'), { x1: visible ? px(seuil) : -10, x2: visible ? px(seuil) : -10 });
  texte(svg, '[data-t1]', `P(réussite) = σ(${fr(e.w, 2)} h ${e.b < 0 ? '−' : '+'} ${fr(Math.abs(e.b), 2)})${visible ? ` ; seuil ${fr(seuil, 2)} h` : ''}`);
  texte(svg, '[data-t2]', `log-loss moyenne : ${fr(perte, 3)}`);
  scene.setAttribute('aria-label', `Courbe sigmoïde de pente ${fr(e.w, 2)} et de biais ${fr(e.b, 2)}. Log-loss moyenne ${fr(perte, 3)}.`);
}
