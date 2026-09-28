// Fiche « valeurs-propres » : on fait tourner v, on regarde Av.
// A = [[2, 1], [1, 2]] : Av est aligné avec v pour 45° (λ = 3) et 135° (λ = 1).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, fleche, texte, repere, attrs, points } from '../animations/svg';

export const fiche = 'valeurs-propres';
const A = [[2, 1], [1, 2]];
const R = repere(140, 126, 36);
const mul = (v: number[]) => [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]];

export const etats: Record<string, Etat> = { initial: { theta: 20 } };

function gabarit() {
  const cercle: [number, number][] = [], ellipse: [number, number][] = [];
  for (let k = 0; k <= 72; k++) {
    const t = (k / 72) * 2 * Math.PI, v = [Math.cos(t), Math.sin(t)], w = mul(v);
    cercle.push([R.x(v[0]), R.y(v[1])]);
    ellipse.push([R.x(w[0]), R.y(w[1])]);
  }
  return `
    ${R.axes(118)}
    <polyline points="${points(cercle)}" class="svg-ligne svg-trait-doux svg-pointille" />
    <polyline points="${points(ellipse)}" class="svg-ligne svg-trait-sortie" stroke-opacity=".5" />
    <line data-guide class="svg-trait-doux" stroke-dasharray="2 4" />
    <g data-av></g><g data-v></g>
    <text class="svg-entree" font-size="14" font-weight="600" data-lv>v</text>
    <text class="svg-texte" font-size="14" font-weight="600" data-lav>Av</text>
    <text x="336" y="20" text-anchor="end" class="svg-doux" font-size="11">A = (2 1 ; 1 2)</text>
    <text x="4" y="236" class="svg-texte" font-size="13" data-t1></text>
    <text x="4" y="256" class="svg-texte" font-size="14" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const t = (e.theta * Math.PI) / 180;
  const v = [Math.cos(t), Math.sin(t)];
  const w = mul(v);
  const nw = Math.hypot(w[0], w[1]);
  const cos = (v[0] * w[0] + v[1] * w[1]) / nw;
  const aligne = Math.abs(cos) > 0.9995;
  fleche(q(svg, '[data-v]'), R.x(0), R.y(0), R.x(v[0]), R.y(v[1]), 'entree', 3.5);
  fleche(q(svg, '[data-av]'), R.x(0), R.y(0), R.x(w[0]), R.y(w[1]), 'sortie', 4);
  attrs(q(svg, '[data-guide]'), { x1: R.x(-3.3 * v[0]), y1: R.y(-3.3 * v[1]), x2: R.x(3.3 * v[0]), y2: R.y(3.3 * v[1]) });
  attrs(q(svg, '[data-lv]'), { x: R.x(v[0] * 1.25) - 5, y: R.y(v[1] * 1.25) + 5 });
  attrs(q(svg, '[data-lav]'), { x: R.x(w[0]) + (w[0] >= 0 ? 6 : -24), y: R.y(w[1]) + (w[1] >= 0 ? -6 : 16) });
  const angle = (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
  texte(svg, '[data-t1]', `v = (${fr(v[0])} ; ${fr(v[1])})   Av = (${fr(w[0])} ; ${fr(w[1])})`);
  texte(svg, '[data-t2]', aligne ? `vecteur propre : Av = ${fr(nw * Math.sign(cos), 0)} v` : `angle entre v et Av : ${fr(angle, 0)}°`);
  scene.setAttribute('aria-label', aligne
    ? `v à ${Math.round(e.theta)} degrés est un vecteur propre : Av = ${fr(nw * Math.sign(cos), 0)} v.`
    : `v à ${Math.round(e.theta)} degrés : Av fait un angle de ${fr(angle, 0)} degrés avec v.`);
}
