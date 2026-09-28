// Fiche « similarite-cosinus » : le cosinus ne dépend que de l'angle, pas des longueurs.
// a = (4 ; 3) fixe ; b = L (cos θ ; sin θ). Exemple de la fiche : b = (8 ; 6), cos = 1.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, fleche, texte, repere, attrs } from '../animations/svg';

export const fiche = 'similarite-cosinus';
const A = [4, 3];
const R = repere(128, 142, 11);

export const etats: Record<string, Etat> = { initial: { theta: 37, longueur: 10 } };

function gabarit() {
  return `
    ${R.axes(114)}
    <path data-arc class="svg-ligne svg-trait-sortie" stroke-width="2" />
    <g data-a></g><g data-b></g>
    <text class="svg-entree" font-size="14" font-weight="600" x="${R.x(4) + 4}" y="${R.y(3) - 4}">a</text>
    <text class="svg-entree" font-size="14" font-weight="600" data-lb>b</text>
    <text x="336" y="22" text-anchor="end" class="svg-entree" font-size="13" data-tb></text>
    <text x="336" y="42" text-anchor="end" class="svg-doux" font-size="12" data-tn></text>
    <text x="336" y="232" text-anchor="end" class="svg-doux" font-size="12" data-tp></text>
    <rect x="186" y="240" width="152" height="21" rx="3" class="svg-fond-sortie" />
    <text x="332" y="255" text-anchor="end" class="svg-texte" font-size="14" font-weight="600" data-tc></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const t = (e.theta * Math.PI) / 180;
  const b = [e.longueur * Math.cos(t), e.longueur * Math.sin(t)];
  const na = 5, nb = e.longueur;
  const p = A[0] * b[0] + A[1] * b[1];
  const cos = p / (na * nb);
  fleche(q(svg, '[data-a]'), R.x(0), R.y(0), R.x(A[0]), R.y(A[1]), 'entree', 3);
  fleche(q(svg, '[data-b]'), R.x(0), R.y(0), R.x(b[0]), R.y(b[1]), 'entree', 3);
  attrs(q(svg, '[data-lb]'), { x: R.x(b[0]) + (b[0] >= 0 ? 6 : -16), y: R.y(b[1]) + (b[1] >= 0 ? -4 : 14) });
  // Arc de l'angle entre a et b, de rayon 30 px.
  const ta = Math.atan2(A[1], A[0]);
  let d = t - ta;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const pt = (ang: number) => `${R.x(0) + 30 * Math.cos(ang)},${R.y(0) - 30 * Math.sin(ang)}`;
  attrs(q(svg, '[data-arc]'), { d: `M${pt(ta)} A30,30 0 0 ${d > 0 ? 0 : 1} ${pt(ta + d)}` });
  const angle = Math.abs((d * 180) / Math.PI);
  texte(svg, '[data-tb]', `b = (${fr(b[0], 1)} ; ${fr(b[1], 1)})`);
  texte(svg, '[data-tn]', `‖a‖ = 5 ; ‖b‖ = ${fr(nb, 1)} ; angle ${fr(angle, 0)}°`);
  texte(svg, '[data-tp]', `a · b = ${fr(p, 1)}`);
  texte(svg, '[data-tc]', `cos(a, b) = ${fr(cos)}`);
  scene.setAttribute('aria-label', `b = (${fr(b[0], 1)} ; ${fr(b[1], 1)}), angle ${fr(angle, 0)} degrés. Produit scalaire ${fr(p, 1)}, similarité cosinus ${fr(cos)}.`);
}
