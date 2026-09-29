// Fiche « lois-echelle » : à calcul fixé (C ≈ 5,9 × 10²³, celui de Chinchilla), perte prédite en fonction de N
// avec la loi ajustée de Hoffmann et al. 2022 : L = 1,69 + 406,4/N^0,34 + 410,7/D^0,28, D = C/(6N).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'lois-echelle';
const [E, A, B, AL, BE] = [1.69, 406.4, 410.7, 0.34, 0.28];
const C = 6 * 70e9 * 1.4e12;
const perte = (N: number) => E + A / N ** AL + B / (C / (6 * N)) ** BE;
const X0 = 44, X1 = 330, Y0 = 190, Y1 = 36, LMIN = 9.7, LMAX = 12, PMIN = 1.92, PMAX = 2.08;
const px = (lN: number) => X0 + ((lN - LMIN) / (LMAX - LMIN)) * (X1 - X0);
const py = (L: number) => Y0 - ((L - PMIN) / (PMAX - PMIN)) * (Y0 - Y1);

const POINTS = [
  { nom: 'Gopher', N: 280e9, etiquette: '280 Md de paramètres' },
  { nom: 'Chinchilla', N: 70e9, etiquette: '70 Md' },
];
const ETAPES = [
  { courbe: false, pts: 0, t1: 'Budget de calcul fixé', t2: 'C ≈ 5,9 × 10²³ : plus de paramètres = moins de tokens' },
  { courbe: true, pts: 0, t1: 'La perte prédite forme une cuvette', t2: 'trop petit : peu de capacité ; trop gros : peu lu' },
  { courbe: true, pts: 1, t1: 'Un géant sous-entraîné', t2: 'à ce budget : 280 Md de paramètres, ~350 Md de tokens' },
  { courbe: true, pts: 2, t1: 'Quatre fois plus petit, quatre fois plus lu', t2: '70 Md de paramètres, 1 400 Md de tokens : mieux' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'cuvette', 'gopher', 'chinchilla'][i], { k: i }]));

function gabarit() {
  let d = '';
  for (let i = 0; i <= 60; i++) {
    const lN = LMIN + ((LMAX - LMIN) * i) / 60;
    d += `${i ? 'L' : 'M'}${px(lN).toFixed(1)},${py(perte(10 ** lN)).toFixed(1)} `;
  }
  const graduations = [10, 11, 12].map((l) => `<line x1="${px(l)}" y1="${Y0}" x2="${px(l)}" y2="${Y0 + 4}" class="svg-trait-doux" />
    <text x="${px(l)}" y="${Y0 + 16}" text-anchor="middle" class="svg-doux" font-size="9.5">${['10 Md', '100 Md', '1 000 Md'][l - 10]}</text>`).join('');
  const gy = [1.95, 2.0, 2.05].map((L) => `<text x="${X0 - 4}" y="${py(L) + 3}" text-anchor="end" class="svg-doux" font-size="9.5">${fr(L, 2)}</text>`).join('');
  return `<text x="4" y="16" class="svg-doux" font-size="10">perte prédite</text>
    <line x1="${X0}" y1="${Y1 - 6}" x2="${X0}" y2="${Y0}" class="svg-trait-doux" /><line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" class="svg-trait-doux" />
    ${graduations}${gy}
    <text x="${X1}" y="${Y0 - 6}" text-anchor="end" class="svg-doux" font-size="9.5">paramètres N</text>
    <path d="${d}" class="svg-ligne svg-trait-parametre" stroke-width="2.5" data-courbe />
    <g data-pts></g>
    <text x="4" y="230" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="249" class="svg-doux" font-size="10.5" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  q(svg, '[data-courbe]').setAttribute('opacity', et.courbe ? '1' : '0');
  q(svg, '[data-pts]').innerHTML = POINTS.slice(0, et.pts).map((p, i) => {
    const x = px(Math.log10(p.N)), y = py(perte(p.N));
    const actif = i === et.pts - 1;
    return `<circle cx="${x}" cy="${y}" r="5.5" class="${actif ? 'svg-sortie' : 'svg-entree'}" />
      <text x="${x}" y="${y - 12}" text-anchor="middle" class="svg-texte" font-size="10.5" font-weight="${actif ? 700 : 400}">${p.nom} ${fr(perte(p.N), 3)}</text>`;
  }).join('');
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
