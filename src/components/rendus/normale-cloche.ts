// Fiche « loi-normale » : densité de la loi normale N(μ ; σ²), aire entre μ − kσ et μ + kσ.
// Exemple : tailles d'élèves, μ = 165 cm, σ = 8 cm ; entre 157 et 173 cm : environ 68,3 %.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';

export const fiche = 'loi-normale';
const XMIN = 130, XMAX = 200;
const px = (x: number) => 20 + ((x - XMIN) / (XMAX - XMIN)) * 300;
const py = (d: number) => 186 - d * 2400;
const densite = (x: number, m: number, s: number) => Math.exp(-(((x - m) / s) ** 2) / 2) / (s * Math.sqrt(2 * Math.PI));

function erf(x: number) {
  const s = Math.sign(x), a = Math.abs(x), t = 1 / (1 + 0.3275911 * a);
  return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a));
}

export const etats: Record<string, Etat> = { initial: { mu: 165, sigma: 8, k: 1 } };

function gabarit() {
  return `
    <defs><clipPath id="nc-cadre"><rect x="20" y="10" width="300" height="176" /></clipPath></defs>
    <line x1="20" y1="186" x2="320" y2="186" class="svg-trait-doux" />
    ${[140, 150, 160, 170, 180, 190].map((v) => `<text x="${px(v)}" y="200" text-anchor="middle" class="svg-doux" font-size="10">${v}</text>`).join('')}
    <g clip-path="url(#nc-cadre)">
      <polygon data-aire class="svg-fond-sortie" />
      <polyline data-courbe class="svg-ligne svg-trait-entree" stroke-width="2.5" />
      <line data-mu class="svg-trait-encre" stroke-dasharray="3 3" />
    </g>
    <text x="320" y="214" text-anchor="end" class="svg-doux" font-size="10">taille (cm)</text>
    <text x="4" y="236" class="svg-texte" font-size="12" data-t1></text>
    <text x="4" y="254" class="svg-texte" font-size="13" font-weight="700" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const mu = e.mu ?? 165, sigma = e.sigma, k = e.k;
  const c: [number, number][] = [];
  for (let x = XMIN; x <= XMAX; x += 0.25) c.push([px(x), py(densite(x, mu, sigma))]);
  attrs(q(svg, '[data-courbe]'), { points: points(c) });
  const a = mu - k * sigma, b = mu + k * sigma;
  const aire: [number, number][] = [[px(a), 186]];
  for (let x = a; x <= b; x += 0.25) aire.push([px(x), py(densite(x, mu, sigma))]);
  aire.push([px(b), 186]);
  attrs(q(svg, '[data-aire]'), { points: points(aire) });
  attrs(q(svg, '[data-mu]'), { x1: px(mu), y1: 186, x2: px(mu), y2: 14 });
  const proba = erf(k / Math.SQRT2);
  texte(svg, '[data-t1]', `μ = ${fr(mu, 0)} cm ; σ = ${fr(sigma, 1, 0)} cm ; intervalle ${fr(a, 1, 0)} à ${fr(b, 1, 0)} cm`);
  texte(svg, '[data-t2]', `P(μ − ${fr(k, 1, 0)}σ ≤ X ≤ μ + ${fr(k, 1, 0)}σ) ≈ ${fr(proba * 100, 1)} %`);
  scene.setAttribute('aria-label', `Loi normale de moyenne ${fr(mu, 0)} et d'écart type ${fr(sigma, 1, 0)}. Probabilité d'être entre ${fr(a, 1, 0)} et ${fr(b, 1, 0)} : ${fr(proba * 100, 1)} %.`);
}
