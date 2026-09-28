// Fiche « maximum-vraisemblance » : 10 clients, 7 paient par mobile money.
// Log-vraisemblance ℓ(p) = 7 ln p + 3 ln(1 − p), maximale en p = 0,7 (ℓ ≈ −6,11) ; en p = 0,5 : ℓ ≈ −6,93.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';

export const fiche = 'maximum-vraisemblance';
const K = 7, N = 10;
const ll = (p: number) => K * Math.log(p) + (N - K) * Math.log(1 - p);
const px = (p: number) => 30 + p * 296;
const Y = (l: number) => 30 + ((-6 - l) / 14) * 170; // ℓ = −6 en haut, −20 en bas

export const etats: Record<string, Etat> = { initial: { p: 0.5 } };

function gabarit() {
  const c: [number, number][] = [];
  for (let p = 0.02; p <= 0.98; p += 0.01) c.push([px(p), Y(Math.max(-20, ll(p)))]);
  return `
    <line x1="${px(0)}" y1="200" x2="${px(1)}" y2="200" class="svg-trait-doux" />
    ${[0, 0.25, 0.5, 0.75, 1].map((p) => `<text x="${px(p)}" y="214" text-anchor="middle" class="svg-doux" font-size="10">${fr(p, 2, 0)}</text>`).join('')}
    ${[-6, -10, -14, -18].map((l) => `<text x="26" y="${Y(l) + 3}" text-anchor="end" class="svg-doux" font-size="9">${fr(l, 0)}</text>`).join('')}
    <line x1="${px(0.7)}" y1="200" x2="${px(0.7)}" y2="${Y(ll(0.7))}" class="svg-trait-sortie" stroke-dasharray="4 3" />
    <polyline points="${points(c)}" class="svg-ligne svg-trait-entree" stroke-width="2.5" />
    <line data-tangente class="svg-trait-perte" stroke-width="1.5" />
    <circle data-p r="5.5" class="svg-parametre" />
    <text x="30" y="16" class="svg-doux" font-size="10">log-vraisemblance ℓ(p) pour 7 paiements mobiles sur 10</text>
    <text x="4" y="236" class="svg-parametre" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="254" class="svg-texte" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const p = e.p, l = ll(p), d = K / p - (N - K) / (1 - p);
  attrs(q(svg, '[data-p]'), { cx: px(p), cy: Y(l) });
  const dp = 0.08;
  attrs(q(svg, '[data-tangente]'), { x1: px(p - dp), y1: Y(l - dp * d), x2: px(p + dp), y2: Y(l + dp * d) });
  texte(svg, '[data-t1]', `p = ${fr(p, 2)} ; ℓ(p) = ${fr(l, 2)} ; vraisemblance = ${fr(Math.exp(l) * 1000, 3)} × 10⁻³`);
  texte(svg, '[data-t2]', `pente ℓ′(p) = 7/p − 3/(1 − p) = ${fr(d, 2)}`);
  scene.setAttribute('aria-label', `Pour p = ${fr(p, 2)}, la log-vraisemblance vaut ${fr(l, 2)} et sa pente ${fr(d, 2)}. Le maximum est en p = 0,7.`);
}
