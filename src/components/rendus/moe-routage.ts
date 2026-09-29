// Fiche « mixture-of-experts » : un token routé vers 2 experts sur 4 (porte top-2).
// Scores de la porte : 2 ; 1 ; 0,5 ; −0,5. On garde les deux premiers ; softmax : 0,731 et 0,269.
// Sorties des experts retenus : 10 et 4 ; sortie y = 0,731 × 10 + 0,269 × 4 ≈ 8,39.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, fleche } from '../animations/svg';

export const fiche = 'mixture-of-experts';

const SCORES = [2, 1, 0.5, -0.5];
const POIDS = [0.731, 0.269, 0, 0];
const SORTIES = [10, 4];
const ETAPES = [
  { t1: 'Un token arrive devant 4 experts', t2: 'chaque expert est un petit réseau feed-forward' },
  { t1: 'La porte donne un score à chaque expert', t2: 'un simple produit du token par une matrice' },
  { t1: 'On ne garde que les 2 meilleurs', t2: 'les experts 3 et 4 ne calculent rien pour ce token' },
  { t1: 'Softmax sur les 2 scores : 0,731 et 0,269', t2: 'y = 0,731 × 10 + 0,269 × 4 ≈ 8,39' },
];

export const etats: Record<string, Etat> = Object.fromEntries(
  ETAPES.map((_, k) => [['initial', 'scores', 'topk', 'sortie'][k], { k }]),
);

const XE = (i: number) => 14 + i * 82;
const YE = 132;

function gabarit() {
  return `
    <rect x="130" y="16" width="80" height="30" rx="6" class="svg-entree" fill-opacity="0.3" />
    <text x="170" y="36" text-anchor="middle" class="svg-texte" font-size="12" font-weight="700">token x</text>
    <rect x="110" y="62" width="120" height="26" rx="6" class="svg-parametre" fill-opacity="0.2" />
    <text x="170" y="79" text-anchor="middle" class="svg-texte" font-size="11">porte (routeur)</text>
    <g data-fleches></g>
    ${[0, 1, 2, 3].map((i) => `
      <rect x="${XE(i)}" y="${YE}" width="70" height="36" rx="6" class="svg-entree" data-e="${i}" />
      <text x="${XE(i) + 35}" y="${YE + 22}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="600">expert ${i + 1}</text>
      <rect x="${XE(i) + 8}" y="${YE - 22}" width="54" height="15" rx="3" style="fill: var(--papier-2)" />
      <text x="${XE(i) + 35}" y="${YE - 11}" text-anchor="middle" class="svg-texte" font-size="10.5" style="font-family: var(--police-code)" data-s="${i}"></text>
      <text x="${XE(i) + 35}" y="${YE + 54}" text-anchor="middle" class="svg-doux" font-size="10.5" data-o="${i}"></text>`).join('')}
    <text x="4" y="226" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="246" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const g = q(svg, '[data-fleches]');
  g.innerHTML = '';
  [0, 1, 2, 3].forEach((i) => {
    const garde = k < 2 || i < 2;
    q(svg, `[data-e="${i}"]`).setAttribute('fill-opacity', k >= 2 && i < 2 ? '0.4' : garde ? '0.15' : '0.05');
    texte(svg, `[data-s="${i}"]`, k === 0 ? '' : k === 3 ? (i < 2 ? `p = ${fr(POIDS[i], 3)}` : '—') : `s = ${fr(SCORES[i], 1)}`);
    texte(svg, `[data-o="${i}"]`, k === 3 ? (i < 2 ? `sortie ${SORTIES[i]}` : 'éteint') : k === 2 && i >= 2 ? 'éteint' : '');
    const sous = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.appendChild(sous);
    if (k >= 1 && garde) fleche(sous, 170 + (i - 1.5) * 16, 90, XE(i) + 35, YE - 24, k >= 2 ? 'sortie' : 'doux', k >= 2 ? 2.5 : 1.5);
  });
  texte(svg, '[data-t1]', ETAPES[k].t1);
  texte(svg, '[data-t2]', ETAPES[k].t2);
  scene.setAttribute('aria-label', `${ETAPES[k].t1}. ${ETAPES[k].t2}.`);
}
