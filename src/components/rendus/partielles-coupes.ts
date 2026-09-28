// Fiche « derivees-partielles » : f(x ; y) = x² + 2y², vue par deux coupes.
// Coupe à y fixé : la pente est ∂f/∂x = 2x ; coupe à x fixé : ∂f/∂y = 4y. En (1 ; 1) : 2 et 4.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';

export const fiche = 'derivees-partielles';
const f = (x: number, y: number) => x * x + 2 * y * y;
// Deux panneaux : gauche (variable x), droite (variable y) ; abscisse −2..2, ordonnée 0..10.
const P = [{ x0: 10, cle: 'x' }, { x0: 176, cle: 'y' }];
const px = (v: number, k: number) => P[k].x0 + ((v + 2) / 4) * 154;
const py = (z: number) => 196 - (Math.min(z, 12) / 12) * 170;

export const etats: Record<string, Etat> = { initial: { x: 1, y: 1 } };

function gabarit() {
  return P.map((p, k) => `
    <line x1="${p.x0}" y1="196" x2="${p.x0 + 154}" y2="196" class="svg-trait-doux" />
    <line x1="${px(0, k)}" y1="196" x2="${px(0, k)}" y2="24" class="svg-trait-doux" stroke-opacity=".5" />
    <polyline data-c="${k}" class="svg-ligne svg-trait-${k ? 'parametre' : 'entree'}" stroke-width="2.5" />
    <line data-t="${k}" class="svg-trait-sortie" stroke-width="2" />
    <circle data-p="${k}" r="5" class="svg-sortie" />
    <text x="${p.x0 + 4}" y="18" class="svg-texte" font-size="11" font-weight="600" data-titre="${k}"></text>
    <text x="${p.x0 + 150}" y="210" text-anchor="end" class="svg-doux" font-size="10">${p.cle}</text>`).join('') + `
    <text x="4" y="236" class="svg-entree" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="254" class="svg-parametre" font-size="13" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const coupes = [(v: number) => f(v, e.y), (v: number) => f(e.x, v)];
  const pentes = [2 * e.x, 4 * e.y], pos = [e.x, e.y];
  coupes.forEach((g, k) => {
    const pts: [number, number][] = [];
    for (let v = -2; v <= 2.001; v += 0.04) pts.push([px(v, k), py(g(v))]);
    attrs(q(svg, `[data-c="${k}"]`), { points: points(pts) });
    const v = pos[k], z = g(v), s = pentes[k];
    attrs(q(svg, `[data-p="${k}"]`), { cx: px(v, k), cy: py(z) });
    attrs(q(svg, `[data-t="${k}"]`), { x1: px(v - 0.6, k), y1: py(z - 0.6 * s), x2: px(v + 0.6, k), y2: py(z + 0.6 * s) });
  });
  texte(svg, '[data-titre="0"]', `y fixé à ${fr(e.y, 1)} : on bouge x`);
  texte(svg, '[data-titre="1"]', `x fixé à ${fr(e.x, 1)} : on bouge y`);
  texte(svg, '[data-t1]', `∂f/∂x = 2x = ${fr(pentes[0], 1)}`);
  texte(svg, '[data-t2]', `∂f/∂y = 4y = ${fr(pentes[1], 1)} ; f = ${fr(f(e.x, e.y), 2)}`);
  scene.setAttribute('aria-label', `Au point (${fr(e.x, 1)} ; ${fr(e.y, 1)}), la dérivée partielle en x vaut ${fr(pentes[0], 1)} et celle en y vaut ${fr(pentes[1], 1)}.`);
}
