// Fiche « multi-head » : la ligne du mot « sa », avec Awa = (2 ; 0), chambre = (0 ; 2), sa = (1 ; 1).
// Une tête (d_k = 2, projections identité) : scores tous égaux → poids 1/3 chacun, sortie (1 ; 1).
// Tête 1 (coordonnée 1, d_k = 1) : scores (2 ; 0 ; 1) → poids ≈ (0,67 ; 0,09 ; 0,24), sortie ≈ 1,58.
// Tête 2 (coordonnée 2) : poids ≈ (0,09 ; 0,67 ; 0,24), sortie ≈ 1,58. Concaténation ≈ (1,58 ; 1,58).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'multi-head';

const MOTS = ['Awa', 'chambre', 'sa'];
const LIGNES = [
  { nom: 'une tête', sous: 'd_k = 2', poids: [1 / 3, 1 / 3, 1 / 3], sortie: '(1 ; 1)' },
  { nom: 'tête 1', sous: 'coord. 1', poids: [0.6652, 0.09, 0.2447], sortie: '1,58' },
  { nom: 'tête 2', sous: 'coord. 2', poids: [0.09, 0.6652, 0.2447], sortie: '1,58' },
];
const CX = [104, 170, 236], BW = 54, Y0 = 72, DY = 40;

export const etats: Record<string, Etat> = { initial: { k: 0 }, unetete: { k: 1 }, tete1: { k: 2 }, tete2: { k: 3 }, concat: { k: 4 } };

function gabarit() {
  const entetes = MOTS.map((m, j) => `<text x="${CX[j]}" y="${Y0 - 10}" text-anchor="middle" class="svg-doux" font-size="10">${m}</text>`).join('')
    + `<text x="306" y="${Y0 - 10}" text-anchor="middle" class="svg-doux" font-size="10">sortie</text>`;
  const lignes = LIGNES.map((l, i) => `<g data-l="${i}">
    <text x="4" y="${Y0 + i * DY + 12}" class="svg-texte" font-size="12" font-weight="700">${l.nom}</text>
    <text x="4" y="${Y0 + i * DY + 26}" class="svg-doux" font-size="9.5">${l.sous}</text>
    ${l.poids.map((p, j) => `<rect x="${CX[j] - BW / 2}" y="${Y0 + i * DY}" width="${BW}" height="14" rx="3" fill="none" class="svg-trait" />
      <rect x="${CX[j] - BW / 2}" y="${Y0 + i * DY}" width="${BW * p}" height="14" rx="3" class="svg-sortie" />
      <text x="${CX[j]}" y="${Y0 + i * DY + 27}" text-anchor="middle" class="svg-texte" font-size="10">${fr(p, 2)}</text>`).join('')}
    <text x="306" y="${Y0 + i * DY + 12}" text-anchor="middle" class="svg-parametre" font-size="11" style="font-family: var(--police-code)">${l.sortie}</text>
  </g>`).join('');
  return `
    <text x="4" y="18" class="svg-texte" font-size="12" font-weight="700">La ligne du mot « sa » : où regarde-t-il ?</text>
    <text x="4" y="36" class="svg-doux" font-size="10" style="font-family: var(--police-code)">Awa (2 ; 0) · chambre (0 ; 2) · sa (1 ; 1)</text>
    ${entetes}${lignes}
    <text x="4" y="212" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="232" class="svg-doux" font-size="11" data-t2></text>
    <text x="4" y="250" class="svg-doux" font-size="11" data-t3></text>`;
}

const TEXTES = [
  ['« sa » a besoin de deux informations', 'à qui ? (Awa) et quoi ? (chambre)', 'la 1re coordonnée dit « personne », la 2e « objet »'],
  ['Une seule tête fait la moyenne', 'les trois scores sont égaux : 1/3 chacun', 'la sortie (1 ; 1) n’a rien appris'],
  ['La tête 1 ne regarde que la 1re coordonnée', 'scores (2 ; 0 ; 1) : elle trouve Awa', 'poids 0,67 sur Awa'],
  ['La tête 2 ne regarde que la 2e', 'scores (0 ; 2 ; 1) : elle trouve chambre', 'poids 0,67 sur chambre'],
  ['On concatène les deux têtes', 'sortie ≈ (1,58 ; 1,58), puis × W_O', 'chaque morceau vient d’un regard différent'],
];

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(4, Math.round(e.k)));
  const visibles = [[], [0], [0, 1], [0, 1, 2], [0, 1, 2]][k];
  LIGNES.forEach((_, i) => {
    const vis = (visibles as number[]).includes(i);
    const attenue = (k === 4 && i === 0) || (k >= 2 && k <= 3 && i === 0);
    q(svg, `[data-l="${i}"]`).setAttribute('opacity', vis ? (attenue ? '0.35' : '1') : '0');
  });
  const [t1, t2, t3] = TEXTES[k];
  texte(svg, '[data-t1]', t1);
  texte(svg, '[data-t2]', t2);
  texte(svg, '[data-t3]', t3);
  scene.setAttribute('aria-label', `${t1}. ${t2}. ${t3}.`);
}
