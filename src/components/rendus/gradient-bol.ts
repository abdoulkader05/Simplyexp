// Fiche « gradient » : f(x ; y) = x² + 2y², lignes de niveau et gradient (2x ; 4y).
// Exemple de la fiche : au point (1 ; 1), ∇f = (2 ; 4).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, fleche, texte, repere, attrs } from '../animations/svg';

export const fiche = 'gradient';
const R = repere(150, 112, 48);
const ECHELLE = 0.2; // la flèche du gradient est dessinée à 20 % de sa longueur
const NIVEAUX = [0.5, 1, 2, 3, 4.5, 6];

export const etats: Record<string, Etat> = { initial: { x: 1, y: 1 } };

function gabarit() {
  const ellipses = NIVEAUX.map((c) =>
    `<ellipse cx="${R.x(0)}" cy="${R.y(0)}" rx="${Math.sqrt(c) * 48}" ry="${Math.sqrt(c / 2) * 48}" fill="none" class="svg-trait-doux" stroke-opacity=".45" />`).join('');
  return `
    <defs><clipPath id="gb-cadre"><rect x="0" y="0" width="340" height="212" /></clipPath></defs>
    <g clip-path="url(#gb-cadre)">${R.axes(150)}${ellipses}
      <line data-tangente class="svg-trait-doux svg-pointille" stroke-width="1.5" />
    </g>
    <g data-g></g>
    <circle data-p r="5" class="svg-entree" />
    <text x="4" y="16" class="svg-doux" font-size="11">lignes de niveau de f(x ; y) = x² + 2y²</text>
    <text x="4" y="232" class="svg-entree" font-size="13" data-tp></text>
    <text x="4" y="252" class="svg-texte" font-size="14" font-weight="600" data-tg></text>
    <text x="336" y="252" text-anchor="end" class="svg-doux" font-size="11">flèche à 20 %</text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const p = [e.x, e.y];
  const g = [2 * p[0], 4 * p[1]];
  const f = p[0] ** 2 + 2 * p[1] ** 2;
  const ng = Math.hypot(g[0], g[1]);
  attrs(q(svg, '[data-p]'), { cx: R.x(p[0]), cy: R.y(p[1]) });
  fleche(q(svg, '[data-g]'), R.x(p[0]), R.y(p[1]), R.x(p[0] + ECHELLE * g[0]), R.y(p[1] + ECHELLE * g[1]), 'sortie', 3.5);
  // Tangente à la ligne de niveau : perpendiculaire au gradient.
  const t = ng > 1e-9 ? [-g[1] / ng, g[0] / ng] : [0, 0];
  attrs(q(svg, '[data-tangente]'), { x1: R.x(p[0] - t[0]), y1: R.y(p[1] - t[1]), x2: R.x(p[0] + t[0]), y2: R.y(p[1] + t[1]) });
  texte(svg, '[data-tp]', `point (${fr(p[0], 1)} ; ${fr(p[1], 1)})   f = ${fr(f)}`);
  texte(svg, '[data-tg]', `∇f = (${fr(g[0], 1)} ; ${fr(g[1], 1)})   longueur ${fr(ng)}`);
  scene.setAttribute('aria-label', `Au point (${fr(p[0], 1)} ; ${fr(p[1], 1)}), f vaut ${fr(f)} et le gradient vaut (${fr(g[0], 1)} ; ${fr(g[1], 1)}), perpendiculaire à la ligne de niveau.`);
}
