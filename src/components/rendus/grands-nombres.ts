// Fiche « loi-grands-nombres » : moyenne des n premiers lancers d'un dé (tirages à graine fixe).
// Espérance 3,5 ; écart type d'un lancer ≈ 1,71 ; enveloppe 3,5 ± 2 × 1,71 / √n.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { generateur } from '../animations/alea';
import { svgDe, q, texte, attrs, points } from '../animations/svg';

export const fiche = 'loi-grands-nombres';
const NMAX = 2000, SIGMA = Math.sqrt(35 / 12);
const alea = generateur(3);
const LANCERS = Array.from({ length: NMAX }, () => 1 + Math.floor(alea() * 6));
const MOYENNES: number[] = [];
LANCERS.reduce((s, x, i) => { const t = s + x; MOYENNES.push(t / (i + 1)); return t; }, 0);

const px = (n: number) => 30 + (Math.log10(n) / Math.log10(NMAX)) * 300;
const py = (m: number) => 110 - (m - 3.5) * 50;

export const etats: Record<string, Etat> = { initial: { n: 10 } };

function gabarit() {
  const haut: [number, number][] = [], bas: [number, number][] = [];
  for (let n = 1; n <= NMAX; n = Math.ceil(n * 1.1)) {
    const d = (2 * SIGMA) / Math.sqrt(n);
    haut.push([px(n), py(Math.min(6, 3.5 + d))]);
    bas.push([px(n), py(Math.max(1, 3.5 - d))]);
  }
  return `
    <defs><clipPath id="gn-cadre"><rect x="30" y="0" width="302" height="212" /></clipPath></defs>
    <g clip-path="url(#gn-cadre)">
      <polygon points="${points([...haut, ...bas.reverse()])}" class="svg-fond-sortie" opacity=".7" />
      <line x1="30" y1="${py(3.5)}" x2="330" y2="${py(3.5)}" class="svg-trait-encre" stroke-dasharray="4 3" />
      <polyline data-chemin class="svg-ligne svg-trait-entree" stroke-width="2" />
    </g>
    <circle data-p r="4.5" class="svg-entree" />
    ${[1, 10, 100, 1000].map((n) => `<text x="${px(n)}" y="224" text-anchor="middle" class="svg-doux" font-size="10">${n}</text>`).join('')}
    ${[1, 2, 3, 4, 5, 6].map((m) => `<text x="24" y="${py(m) + 3}" text-anchor="end" class="svg-doux" font-size="9">${m}</text>`).join('')}
    <text x="330" y="14" text-anchor="end" class="svg-doux" font-size="10">doré : 3,5 ± 2 écarts types de la moyenne</text>
    <text x="4" y="242" class="svg-entree" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="258" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const n = Math.max(1, Math.min(NMAX, Math.round(e.n)));
  const pts: [number, number][] = [];
  for (let i = 1; i <= n; i = i < 50 ? i + 1 : Math.ceil(i * 1.02)) pts.push([px(i), py(MOYENNES[i - 1])]);
  pts.push([px(n), py(MOYENNES[n - 1])]);
  attrs(q(svg, '[data-chemin]'), { points: points(pts) });
  attrs(q(svg, '[data-p]'), { cx: px(n), cy: py(MOYENNES[n - 1]) });
  texte(svg, '[data-t1]', `après ${n} lancer${n > 1 ? 's' : ''} : moyenne ${fr(MOYENNES[n - 1], 3)}`);
  texte(svg, '[data-t2]', `écart type de la moyenne : 1,71 / √${n} ≈ ${fr(SIGMA / Math.sqrt(n), 3)} (échelle log en bas)`);
  scene.setAttribute('aria-label', `Après ${n} lancers de dé, la moyenne vaut ${fr(MOYENNES[n - 1], 3)}, pour une espérance de 3,5.`);
}
