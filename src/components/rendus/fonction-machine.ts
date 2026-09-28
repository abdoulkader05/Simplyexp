// Fiche « fonctions » : une entrée x, une sortie f(x), et le point (x ; f(x)) sur le graphe.
// Fonction 0 : prix du gbaka f(x) = 136 x + 4 (x en km) ; 1 : aire d'un carré g(x) = x² ;
// 2 : commission c(x) = max(0 ; x − 10) (x en milliers de F vendus).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';

export const fiche = 'fonctions';
const F = [
  { f: (x: number) => 136 * x + 4, nom: 'f(x) = 136 x + 4', xmax: 10, ymax: 1400, unite: 'km', uy: 'F', legende: 'prix du gbaka' },
  { f: (x: number) => x * x, nom: 'g(x) = x²', xmax: 10, ymax: 100, unite: 'm', uy: 'm²', legende: 'aire d’un carré de côté x' },
  { f: (x: number) => Math.max(0, x - 10), nom: 'c(x) = max(0 ; x − 10)', xmax: 30, ymax: 20, unite: 'milliers de F', uy: 'milliers de F', legende: 'commission au-delà de 10 000 F' },
];
const px = (x: number, c: (typeof F)[number]) => 40 + (x / c.xmax) * 286;
const py = (y: number, c: (typeof F)[number]) => 180 - (y / c.ymax) * 150;

export const etats: Record<string, Etat> = { initial: { fonction: 0, x: 3 } };

function gabarit() {
  return `
    <line data-ax x1="40" y1="180" x2="330" y2="180" class="svg-trait-doux" />
    <line x1="40" y1="180" x2="40" y2="24" class="svg-trait-doux" />
    <polyline data-courbe class="svg-ligne svg-trait-sortie" stroke-width="2.5" />
    <line data-vx class="svg-trait-entree svg-pointille" stroke-width="1.5" />
    <line data-vy class="svg-trait-sortie svg-pointille" stroke-width="1.5" />
    <circle data-p r="5.5" class="svg-entree" />
    <text x="44" y="18" class="svg-texte" font-size="13" font-weight="600" data-nom></text>
    <text x="330" y="196" text-anchor="end" class="svg-doux" font-size="10" data-ux></text>
    <text x="4" y="232" class="svg-entree" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-sortie" font-size="13" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const c = F[Math.max(0, Math.min(2, Math.round(e.fonction)))];
  const x = Math.min(e.x, c.xmax), y = c.f(x);
  const pts: [number, number][] = [];
  for (let t = 0; t <= c.xmax + 1e-9; t += c.xmax / 120) pts.push([px(t, c), py(c.f(t), c)]);
  attrs(q(svg, '[data-courbe]'), { points: points(pts) });
  attrs(q(svg, '[data-p]'), { cx: px(x, c), cy: py(y, c) });
  attrs(q(svg, '[data-vx]'), { x1: px(x, c), y1: 180, x2: px(x, c), y2: py(y, c) });
  attrs(q(svg, '[data-vy]'), { x1: 40, y1: py(y, c), x2: px(x, c), y2: py(y, c) });
  texte(svg, '[data-nom]', `${c.nom} : ${c.legende}`);
  texte(svg, '[data-ux]', `x en ${c.unite}`);
  texte(svg, '[data-t1]', `entrée x = ${fr(x, 1, 0)} ${c.unite}`);
  texte(svg, '[data-t2]', `sortie = ${fr(y, 1, 0)} ${c.uy}`);
  scene.setAttribute('aria-label', `${c.nom}. Pour x = ${fr(x, 1, 0)}, la sortie vaut ${fr(y, 1, 0)}.`);
}
