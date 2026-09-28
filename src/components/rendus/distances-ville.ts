// Fiche « normes-distances » : distance à vol d'oiseau (L2) contre trajet par les rues (L1).
// Exemple de la fiche : A = (0 ; 0), B = (3 ; 4) : L2 = 5, L1 = 7.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, attrs, texte, repere, points } from '../animations/svg';

export const fiche = 'normes-distances';
const R = repere(150, 128, 24);

export const etats: Record<string, Etat> = { initial: { bx: 3, by: 4 } };

function gabarit() {
  return `
    ${R.grille(4)}
    <polyline data-l1 class="svg-ligne svg-trait-entree" stroke-width="3" stroke-dasharray="6 4" />
    <line data-l2 class="svg-trait-sortie" stroke-width="4" stroke-linecap="round" />
    <circle cx="${R.x(0)}" cy="${R.y(0)}" r="5" class="svg-encre" />
    <circle data-b r="5" class="svg-encre" />
    <text x="${R.x(0) - 16}" y="${R.y(0) + 16}" class="svg-texte" font-size="13" font-weight="600">A</text>
    <text data-lb class="svg-texte" font-size="13" font-weight="600">B</text>
    <text x="4" y="20" class="svg-doux" font-size="11">Chaque carré du quadrillage fait 1 unité.</text>
    <text x="336" y="236" text-anchor="end" class="svg-texte" font-size="13" font-weight="600" data-t2></text>
    <text x="336" y="254" text-anchor="end" class="svg-entree" font-size="13" font-weight="600" data-t1></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const b = [e.bx, e.by];
  const l2 = Math.hypot(b[0], b[1]);
  const l1 = Math.abs(b[0]) + Math.abs(b[1]);
  attrs(q(svg, '[data-l1]'), { points: points([[R.x(0), R.y(0)], [R.x(b[0]), R.y(0)], [R.x(b[0]), R.y(b[1])]]) });
  attrs(q(svg, '[data-l2]'), { x1: R.x(0), y1: R.y(0), x2: R.x(b[0]), y2: R.y(b[1]) });
  attrs(q(svg, '[data-b]'), { cx: R.x(b[0]), cy: R.y(b[1]) });
  attrs(q(svg, '[data-lb]'), { x: R.x(b[0]) + 8, y: R.y(b[1]) - 8 });
  texte(svg, '[data-t2]', `vol d’oiseau (L2) : ${fr(l2)}`);
  texte(svg, '[data-t1]', `par les rues (L1) : ${fr(l1, 0)}`);
  scene.setAttribute('aria-label', `B = (${b[0]} ; ${b[1]}). Distance L2 ${fr(l2)}, distance L1 ${fr(l1, 0)}.`);
}
