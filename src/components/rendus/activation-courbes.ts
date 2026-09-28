// Fiche « fonctions-activation » : sigmoïde, tanh, ReLU et GELU, avec leur dérivée au point z choisi.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';

export const fiche = 'fonctions-activation';

// Fonction de répartition de la loi normale, via une approximation de erf (Abramowitz et Stegun 7.1.26).
function erf(x: number) {
  const s = Math.sign(x), a = Math.abs(x), t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return s * y;
}
const Phi = (x: number) => 0.5 * (1 + erf(x / Math.SQRT2));

export const ACTIVATIONS = [
  { nom: 'sigmoïde', f: (z: number) => 1 / (1 + Math.exp(-z)) },
  { nom: 'tanh', f: (z: number) => Math.tanh(z) },
  { nom: 'ReLU', f: (z: number) => Math.max(0, z) },
  { nom: 'GELU', f: (z: number) => z * Phi(z) },
];
const derivee = (f: (z: number) => number, z: number) => (f(z + 1e-4) - f(z - 1e-4)) / 2e-4;

const px = (z: number) => 170 + z * 32;
const py = (y: number) => 118 - y * 36;

export const etats: Record<string, Etat> = { initial: { fonction: 0, z: 3 } };

function gabarit() {
  return `
    <defs><clipPath id="ac-cadre"><rect x="4" y="12" width="332" height="196" /></clipPath></defs>
    <line x1="4" y1="${py(0)}" x2="336" y2="${py(0)}" class="svg-trait-doux" />
    <line x1="${px(0)}" y1="12" x2="${px(0)}" y2="208" class="svg-trait-doux" />
    ${[-4, 4].map((z) => `<text x="${px(z)}" y="${py(0) + 13}" text-anchor="middle" class="svg-doux" font-size="10">${z < 0 ? '−' : ''}${Math.abs(z)}</text>`).join('')}
    <text x="${px(0) + 4}" y="${py(1) + 4}" class="svg-doux" font-size="10">1</text>
    <g clip-path="url(#ac-cadre)">
      <polyline data-derivee class="svg-ligne svg-trait-doux" stroke-width="1.5" stroke-dasharray="4 3" />
      <polyline data-courbe class="svg-ligne svg-trait-sortie" stroke-width="3" />
      <line data-tangente class="svg-trait-perte" stroke-width="1.5" />
    </g>
    <circle data-point r="5" class="svg-entree" />
    <text x="4" y="24" class="svg-texte" font-size="14" font-weight="600" data-nom></text>
    <text x="4" y="40" class="svg-doux" font-size="10">pointillés : la dérivée</text>
    <text x="4" y="232" class="svg-entree" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-perte" font-size="13" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const a = ACTIVATIONS[Math.max(0, Math.min(3, Math.round(e.fonction)))];
  const c: [number, number][] = [], d: [number, number][] = [];
  for (let z = -5.2; z <= 5.2; z += 0.05) { c.push([px(z), py(a.f(z))]); d.push([px(z), py(derivee(a.f, z))]); }
  attrs(q(svg, '[data-courbe]'), { points: points(c) });
  attrs(q(svg, '[data-derivee]'), { points: points(d) });
  const y = a.f(e.z), p = derivee(a.f, e.z);
  attrs(q(svg, '[data-point]'), { cx: px(e.z), cy: py(y) });
  attrs(q(svg, '[data-tangente]'), { x1: px(e.z - 1.2), y1: py(y - 1.2 * p), x2: px(e.z + 1.2), y2: py(y + 1.2 * p) });
  texte(svg, '[data-nom]', a.nom);
  texte(svg, '[data-t1]', `z = ${fr(e.z, 1)} ; φ(z) = ${fr(y, 3)}`);
  texte(svg, '[data-t2]', `pente φ′(z) = ${fr(p, 3)}`);
  scene.setAttribute('aria-label', `${a.nom} en z = ${fr(e.z, 1)} : valeur ${fr(y, 3)}, pente ${fr(p, 3)}.`);
}
