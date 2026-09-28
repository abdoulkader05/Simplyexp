// Fiche « produit-scalaire » : le signe de u · v dépend du côté où tombe v.
// u = (3 ; 1) fixe ; v = (2 cos θ ; 2 sin θ) tourne avec le curseur.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, fleche, texte, repere, attrs } from '../animations/svg';

export const fiche = 'produit-scalaire';
const U = [3, 1];
const R = repere(150, 132, 30);

export const etats: Record<string, Etat> = { initial: { theta: 60 } };

function gabarit() {
  // Demi-plan où u · v > 0 : du côté de u par rapport à la droite perpendiculaire à u.
  const p = [-U[1], U[0]]; // direction perpendiculaire à u
  const L = 12;
  const coins = [
    [p[0] * L, p[1] * L],
    [p[0] * L + U[0] * L, p[1] * L + U[1] * L],
    [-p[0] * L + U[0] * L, -p[1] * L + U[1] * L],
    [-p[0] * L, -p[1] * L],
  ].map(([a, b]) => `${R.x(a)},${R.y(b)}`).join(' ');
  return `
    <defs><clipPath id="ps-cadre"><rect x="6" y="6" width="288" height="252" rx="4" /></clipPath></defs>
    <g clip-path="url(#ps-cadre)">
      <polygon points="${coins}" class="svg-fond-sortie" opacity=".45" />
      <line x1="${R.x(p[0] * L)}" y1="${R.y(p[1] * L)}" x2="${R.x(-p[0] * L)}" y2="${R.y(-p[1] * L)}" class="svg-trait-doux svg-pointille" />
      ${R.axes(140)}
    </g>
    <g data-u></g><g data-v></g>
    <text class="svg-entree" font-size="14" font-weight="600" x="${R.x(3) + 6}" y="${R.y(1) + 4}">u</text>
    <text class="svg-entree" font-size="14" font-weight="600" data-lv>v</text>
    <text x="12" y="22" class="svg-doux" font-size="11">zone dorée : u · v positif</text>
    <text x="12" y="236" class="svg-entree" font-size="13" data-tv></text>
    <text x="12" y="254" class="svg-texte" font-size="14" font-weight="600" data-tp></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const t = (e.theta * Math.PI) / 180;
  const v = [2 * Math.cos(t), 2 * Math.sin(t)];
  const p = U[0] * v[0] + U[1] * v[1];
  fleche(q(svg, '[data-u]'), R.x(0), R.y(0), R.x(U[0]), R.y(U[1]), 'entree', 3);
  fleche(q(svg, '[data-v]'), R.x(0), R.y(0), R.x(v[0]), R.y(v[1]), 'entree', 3);
  attrs(q(svg, '[data-lv]'), { x: R.x(v[0] * 1.15) - 4, y: R.y(v[1] * 1.15) + 5 });
  const sens = Math.abs(p) < 0.05 ? 'nul : perpendiculaires' : p > 0 ? 'positif : même côté que u' : 'négatif : côté opposé';
  texte(svg, '[data-tv]', `v = (${fr(v[0])} ; ${fr(v[1])})`);
  texte(svg, '[data-tp]', `u · v = ${fr(p)}, ${sens}`);
  scene.setAttribute('aria-label', `u = (3 ; 1), v = (${fr(v[0])} ; ${fr(v[1])}). Produit scalaire ${fr(p)}, ${sens}.`);
}
