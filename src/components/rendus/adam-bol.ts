// Fiche « adam » : 40 pas d'Adam (β₁ = 0,9, β₂ = 0,999, ε = 10⁻⁸) sur le bol f = x² + 25y²,
// comparés à la descente simple (η = 0,035, pointillés). Le pas α d'Adam est réglable.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';
import { lignesDeNiveau, trajetAdam, trajetMomentum, f, px, py, PAS } from '../animations/bol';

export const fiche = 'adam';
const SIMPLE = trajetMomentum(0.035, 0);

export const etats: Record<string, Etat> = { initial: { alpha: 0.3 } };

function gabarit() {
  return `
    <defs><clipPath id="ab-cadre"><rect x="0" y="8" width="340" height="206" /></clipPath></defs>
    ${lignesDeNiveau()}
    <g clip-path="url(#ab-cadre)">
      <polyline points="${points(SIMPLE.map(([x, y]) => [px(x), py(y)]))}" class="svg-ligne svg-trait-doux" stroke-width="1.5" stroke-dasharray="4 3" />
      <polyline data-chemin class="svg-ligne svg-trait-parametre" stroke-width="2" />
      <g data-points></g>
    </g>
    <text x="4" y="232" class="svg-parametre" font-size="12" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const pts = trajetAdam(e.alpha);
  attrs(q(svg, '[data-chemin]'), { points: points(pts.map(([x, y]) => [px(x), py(y)])) });
  q(svg, '[data-points]').innerHTML = pts.slice(0, 6).map(([x, y]) => `<circle cx="${px(x)}" cy="${py(y)}" r="3" class="svg-parametre" />`).join('');
  const [x, y] = pts[PAS], [x1, y1] = pts[1];
  const [xs, ys] = SIMPLE[PAS];
  texte(svg, '[data-t1]', `Adam α = ${fr(e.alpha, 2)} : 1er pas (${fr(x1 + 4, 2)} ; ${fr(y1 - 1, 2)}), f₄₀ = ${fr(f(x, y), 3)}`);
  texte(svg, '[data-t2]', `pointillés, sans Adam : 1er pas (0,28 ; −1,75), f₄₀ = ${fr(f(xs, ys), 3)}`);
  scene.setAttribute('aria-label', `Adam avec α = ${fr(e.alpha, 2)} : premier pas de ${fr(x1 + 4, 2)} en x et ${fr(y1 - 1, 2)} en y ; après 40 pas f vaut ${fr(f(x, y), 3)}, contre ${fr(f(xs, ys), 3)} pour la descente simple.`);
}
