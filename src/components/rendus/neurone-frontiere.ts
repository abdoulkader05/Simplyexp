// Fiche « neurone-artificiel » : un neurone à deux entrées décide « gbaka » ou « à pied ».
// x₁ = distance (km), x₂ = intensité de la pluie (0 à 1) ; z = w₁ x₁ + w₂ x₂ + b, b = −2.
// Exemple de la fiche : w = (0,8 ; 1,5) : 1 km sans pluie → z = −1,2 ; 1 km sous la pluie → z = 0,3.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'neurone-artificiel';
const B = -2;
const px = (x1: number) => 30 + (x1 / 5) * 296;
const py = (x2: number) => 190 - x2 * 170;
const sigma = (z: number) => 1 / (1 + Math.exp(-z));
const NX = 25, NY = 10;
const EXEMPLES: [number, number, string][] = [[1, 0, 'A'], [1, 1, 'B'], [3, 0, 'C']];

export const etats: Record<string, Etat> = { initial: { w1: 0.8, w2: 1.5 } };

function gabarit() {
  let cases = '';
  for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++)
    cases += `<rect data-c="${i}-${j}" x="${px((i * 5) / NX)}" y="${py(((j + 1) * 1) / NY)}" width="${296 / NX + 0.5}" height="${170 / NY + 0.5}" class="svg-fond-sortie" />`;
  return `
    ${cases}
    <line x1="${px(0)}" y1="${py(0)}" x2="${px(5)}" y2="${py(0)}" class="svg-trait-doux" />
    <line x1="${px(0)}" y1="${py(0)}" x2="${px(0)}" y2="${py(1)}" class="svg-trait-doux" />
    <text x="${px(5)}" y="${py(0) + 14}" text-anchor="end" class="svg-doux" font-size="10">distance (km)</text>
    <text x="${px(0) - 4}" y="${py(1) + 4}" text-anchor="end" class="svg-doux" font-size="10">pluie</text>
    <text x="${px(0) - 4}" y="${py(0) + 4}" text-anchor="end" class="svg-doux" font-size="10">0</text>
    <defs><clipPath id="nf-cadre"><rect x="${px(0)}" y="${py(1)}" width="296" height="170" /></clipPath></defs>
    <line data-frontiere class="svg-trait-encre" stroke-width="2" clip-path="url(#nf-cadre)" />
    ${EXEMPLES.map(([a, b, n]) => `<circle cx="${px(a)}" cy="${py(b)}" r="5" class="svg-entree" /><text x="${px(a) + 7}" y="${py(b) + (b ? 14 : -6)}" class="svg-entree" font-size="12" font-weight="600">${n}</text>`).join('')}
    <text x="4" y="16" class="svg-doux" font-size="10">doré : P(prendre le gbaka) ; trait : frontière z = 0</text>
    <text x="4" y="232" class="svg-parametre" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const z = (x1: number, x2: number) => e.w1 * x1 + e.w2 * x2 + B;
  for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++)
    q(svg, `[data-c="${i}-${j}"]`).style.opacity = String(sigma(z(((i + 0.5) * 5) / NX, (j + 0.5) / NY)));
  // Frontière w₁ x₁ + w₂ x₂ + b = 0, tracée entre x₂ = 0 et x₂ = 1 quand c'est possible.
  const pts: [number, number][] = [];
  if (Math.abs(e.w1) > 1e-6) for (const x2 of [0, 1]) pts.push([(-B - e.w2 * x2) / e.w1, x2]);
  const ok = pts.length === 2;
  attrs(q(svg, '[data-frontiere]'), ok ? { x1: px(pts[0][0]), y1: py(0), x2: px(pts[1][0]), y2: py(1) } : { x1: 0, y1: 0, x2: 0, y2: 0 });
  const zs = EXEMPLES.map(([a, b]) => z(a, b));
  texte(svg, '[data-t1]', `z = ${fr(e.w1, 1)} x₁ + ${fr(e.w2, 1)} x₂ − 2`);
  texte(svg, '[data-t2]', EXEMPLES.map(([, , n], k) => `${n} : z = ${fr(zs[k], 1)}`).join(' ; '));
  scene.setAttribute('aria-label', `Neurone de poids ${fr(e.w1, 1)} et ${fr(e.w2, 1)}, biais −2. Scores : ${EXEMPLES.map(([, , n], k) => `${n} ${fr(zs[k], 1)}`).join(', ')}.`);
}
