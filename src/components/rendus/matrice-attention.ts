// Fiche « cout-quadratique » : la matrice des scores d'attention, n × n, pour n = 4, 8, 16.
// Doubler la longueur multiplie le nombre de scores par 4 : 16, 64, 256.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'cout-quadratique';

const X0 = 14, Y0 = 34, COTE = 150;
const ETAPES = [
  { n: 4, t1: '4 tokens : 4 × 4 = 16 scores', t2: 'chaque token regarde tous les autres, lui compris' },
  { n: 8, t1: '8 tokens : 8 × 8 = 64 scores', t2: 'deux fois plus de texte, quatre fois plus de scores' },
  { n: 16, t1: '16 tokens : 16 × 16 = 256 scores', t2: 'encore × 2 en longueur, encore × 4 en scores' },
  { n: 16, t1: 'la longueur double, le coût quadruple', t2: 'c’est la signature d’un coût en n²' },
];

export const etats: Record<string, Etat> = Object.fromEntries(
  ETAPES.map((et, k) => [['initial', 'n8', 'n16', 'bilan'][k], { n: et.n, k }]),
);

// Intensité pseudo-aléatoire mais fixe pour chaque case (pas de hasard à chaque dessin).
const intensite = (i: number, j: number) => 0.15 + 0.75 * Math.abs(Math.sin(i * 12.9898 + j * 78.233) * 0.5 + (i === j ? 0.5 : 0));

function gabarit() {
  return `
    <text x="${X0}" y="${Y0 - 10}" class="svg-doux" font-size="10">requêtes (lignes) × clés (colonnes)</text>
    <g data-grille></g>
    <rect x="${X0}" y="${Y0}" width="${COTE}" height="${COTE}" fill="none" class="svg-trait-encre" stroke-width="1.5" />
    <g data-barres></g>
    <text x="4" y="224" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="244" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const n = ETAPES[k].n;
  const c = COTE / n;
  let cases = '';
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      cases += `<rect x="${(X0 + j * c).toFixed(2)}" y="${(Y0 + i * c).toFixed(2)}" width="${(c - 1).toFixed(2)}" height="${(c - 1).toFixed(2)}" class="svg-entree" fill-opacity="${intensite(i, j).toFixed(2)}" />`;
    }
  }
  q(svg, '[data-grille]').innerHTML = cases;
  // Barres : longueur du texte (n) et nombre de scores (n²), pour les trois tailles vues.
  const tailles = [4, 8, 16].filter((t) => t <= n);
  const X = 190, L = 120;
  q(svg, '[data-barres]').innerHTML = `
    <text x="${X}" y="${Y0 - 10}" class="svg-doux" font-size="10">longueur n et scores n²</text>` +
    tailles.map((t, r) => {
      const y = Y0 + 8 + r * 50;
      return `
        <text x="${X}" y="${y}" class="svg-texte" font-size="11" font-weight="600">n = ${t}</text>
        <rect x="${X}" y="${y + 6}" width="${(L * t) / 16}" height="9" rx="2" class="svg-parametre" />
        <text x="${X + (L * t) / 16 + 4}" y="${y + 14}" class="svg-doux" font-size="10">${t}</text>
        <rect x="${X}" y="${y + 19}" width="${(L * t * t) / 256}" height="9" rx="2" class="svg-sortie" />
        <text x="${X + (L * t * t) / 256 + 4}" y="${y + 27}" class="svg-doux" font-size="10">${t * t}</text>`;
    }).join('');
  texte(svg, '[data-t1]', ETAPES[k].t1);
  texte(svg, '[data-t2]', ETAPES[k].t2);
  scene.setAttribute('aria-label', `${ETAPES[k].t1}. ${ETAPES[k].t2}.`);
}
