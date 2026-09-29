// Fiche « quantification » : quantification absmax sur 8 bits (Dettmers et al. 2022).
// x = (0,5 ; −1,2 ; 2,54 ; 0,03), échelle 127/2,54 = 50, q = (25 ; −60 ; 127 ; 2), retour (0,5 ; −1,2 ; 2,54 ; 0,04).
// Avec une valeur aberrante 60 à la place de 2,54 : échelle 2,117, les petites valeurs sont écrasées.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'quantification';
const NORMAL = [0.5, -1.2, 2.54, 0.03];
const ABERRANT = [0.5, -1.2, 60, 0.03];

const quantifier = (x: number[]) => {
  const m = Math.max(...x.map(Math.abs));
  const s = 127 / m;
  const qs = x.map((v) => Math.round(s * v));
  return { m, s, qs, retour: qs.map((v) => v / s) };
};

const ETAPES = [
  { x: NORMAL, cols: 1, t1: 'Quatre poids en virgule flottante', t2: 'chacun occupe 16 bits en mémoire' },
  { x: NORMAL, cols: 1, t1: 'Échelle : 127 / max|x| = 127 / 2,54 = 50', t2: 'le plus grand poids ira exactement sur 127' },
  { x: NORMAL, cols: 2, t1: 'On multiplie par 50 et on arrondit', t2: 'des entiers entre −127 et 127 : 8 bits chacun' },
  { x: NORMAL, cols: 3, t1: 'Au calcul, on divise par 50', t2: 'erreur maximale ici : 0,01' },
  { x: ABERRANT, cols: 3, t1: 'Avec une valeur aberrante, 60', t2: 'échelle 2,12 : 0,03 devient 0, −1,2 devient −1,42' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'echelle', 'arrondi', 'retour', 'aberrant'][i], { k: i }]));

function gabarit() {
  return `<line x1="20" y1="70" x2="320" y2="70" class="svg-trait-doux" stroke-width="1.5" />
    <text x="4" y="92" class="svg-doux" font-size="9.5" data-gauche></text>
    <text x="170" y="92" text-anchor="middle" class="svg-doux" font-size="9.5">0</text>
    <text x="336" y="92" text-anchor="end" class="svg-doux" font-size="9.5" data-droite></text>
    <line x1="170" y1="64" x2="170" y2="76" class="svg-trait-doux" />
    <g data-points></g>
    <g data-table></g>
    <text x="4" y="16" class="svg-doux" font-size="10">la droite des valeurs, de −max à +max</text>
    <text x="4" y="228" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="247" class="svg-doux" font-size="10.5" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  const r = quantifier(et.x);
  texte(svg, '[data-gauche]', k >= 1 ? `−${fr(r.m, 2)} → −127` : `−${fr(r.m, 2)}`);
  texte(svg, '[data-droite]', k >= 1 ? `${fr(r.m, 2)} → 127` : fr(r.m, 2));
  const X = (v: number) => 170 + (150 * v) / r.m;
  q(svg, '[data-points]').innerHTML = et.x.map((v, i) => {
    const xr = X(k >= 2 ? r.retour[i] : v);
    return `<circle cx="${xr.toFixed(1)}" cy="70" r="5" class="${k >= 3 && Math.abs(r.retour[i] - v) > 0.02 ? 'svg-perte' : 'svg-sortie'}" />
      <text x="${xr.toFixed(1)}" y="${58 - i * 10}" text-anchor="middle" class="svg-texte" font-size="9.5">${String.fromCharCode(97 + i)}</text>`;
  }).join('');
  const entetes = ['poids', 'x', 'q = arrondi(x × s)', 'retour q / s'];
  const xs = [4, 60, 150, 270];
  let t = entetes.slice(0, et.cols + 1).map((h, j) => `<text x="${xs[j]}" y="116" class="svg-doux" font-size="9.5">${h}</text>`).join('');
  et.x.forEach((v, i) => {
    const y = 136 + i * 19;
    const cell = [String.fromCharCode(97 + i), fr(v, 2), String(r.qs[i]), fr(r.retour[i], 3)];
    t += cell.slice(0, et.cols + 1).map((c, j) => {
      const faux = j === 3 && Math.abs(r.retour[i] - v) > 0.02;
      return `<text x="${xs[j]}" y="${y}" class="${faux ? 'svg-perte' : 'svg-texte'}" font-size="11" style="font-family: var(--police-code)">${c}</text>`;
    }).join('');
  });
  q(svg, '[data-table]').innerHTML = t;
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
