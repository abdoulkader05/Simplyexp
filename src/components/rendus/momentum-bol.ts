// Fiche « momentum » : 40 pas sur le bol allongé f = x² + 25y², η = 0,035, β réglable.
// β = 0 : descente simple qui zigzague en y et traîne en x.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';
import { lignesDeNiveau, trajetMomentum, f, px, py, PAS } from '../animations/bol';

export const fiche = 'momentum';
const ETA = 0.035;
const REFERENCE = trajetMomentum(ETA, 0);

export const etats: Record<string, Etat> = { initial: { beta: 0.5 } };

function gabarit() {
  return `
    <defs><clipPath id="mb-cadre"><rect x="0" y="8" width="340" height="206" /></clipPath></defs>
    ${lignesDeNiveau()}
    <g clip-path="url(#mb-cadre)">
      <polyline points="${points(REFERENCE.map(([x, y]) => [px(x), py(y)]))}" class="svg-ligne svg-trait-doux" stroke-width="1.5" stroke-dasharray="4 3" />
      <polyline data-chemin class="svg-ligne svg-trait-parametre" stroke-width="2" />
    </g>
    <circle data-fin r="4.5" class="svg-parametre" />
    <text x="4" y="232" class="svg-parametre" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const pts = trajetMomentum(ETA, e.beta);
  attrs(q(svg, '[data-chemin]'), { points: points(pts.map(([x, y]) => [px(x), py(y)])) });
  const [x, y] = pts[PAS];
  attrs(q(svg, '[data-fin]'), { cx: px(Math.max(-4.6, Math.min(1.6, x))), cy: py(Math.max(-1.3, Math.min(1.3, y))) });
  const [x0, y0] = REFERENCE[PAS];
  texte(svg, '[data-t1]', `β = ${fr(e.beta, 2)} : après 40 pas, f = ${fr(f(x, y), 4)}`);
  texte(svg, '[data-t2]', `pointillés, sans momentum : f = ${fr(f(x0, y0), 4)}`);
  scene.setAttribute('aria-label', `Avec β = ${fr(e.beta, 2)}, après 40 pas la fonction vaut ${fr(f(x, y), 4)}, contre ${fr(f(x0, y0), 4)} sans momentum.`);
}
