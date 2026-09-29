// Fiche « qkv » : reprise de l'exemple de la fiche attention (Awa paie Koffi), avec trois projections.
// q = s W_Q = (1 ; 2) ; clés k = h W_K ; valeurs v = h W_V ; scores (−2 ; 4 ; 2) ; ÷ √2 ;
// poids ≈ (0,011 ; 0,795 ; 0,193) ; sortie ≈ (0,61 ; 1,95).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'qkv';

const MOTS = ['Awa', 'paie', 'Koffi'];
const K = ['(0 ; −1)', '(2 ; 1)', '(0 ; 1)'];
const V = ['(1 ; −2)', '(1 ; 2)', '(−1 ; 2)'];
const SCORES = [-2, 4, 2];
const ECHELLE = SCORES.map((s) => s / Math.SQRT2);
const EXP = ECHELLE.map(Math.exp);
const POIDS = EXP.map((e) => e / EXP.reduce((a, b) => a + b, 0));

// Colonnes du tableau : mot, clé, valeur, score, score ÷ √2, poids.
const COL = [4, 58, 122, 190, 238, 292];
const TITRES = ['mot', 'clé k', 'valeur v', 'q · k', '÷ √2', 'poids'];
const Y0 = 78, DY = 30;

export const etats: Record<string, Etat> = {
  initial: { k: 0 }, projections: { k: 1 }, scores: { k: 2 }, echelle: { k: 3 }, poids: { k: 4 }, sortie: { k: 5 },
};

function gabarit() {
  const titres = TITRES.map((t, i) => `<text x="${COL[i]}" y="${Y0 - 14}" class="svg-doux" font-size="10" data-titre="${i}">${t}</text>`).join('');
  const lignes = MOTS.map((m, j) => `
    <rect x="0" y="${Y0 + j * DY - 4}" width="340" height="24" rx="4" class="svg-entree" fill-opacity="0.08" data-ligne="${j}" />
    <text x="${COL[0]}" y="${Y0 + j * DY + 12}" class="svg-texte" font-size="12" font-weight="600">${m}</text>
    <text x="${COL[1]}" y="${Y0 + j * DY + 12}" class="svg-entree" font-size="11" style="font-family: var(--police-code)" data-c="1-${j}">${K[j]}</text>
    <text x="${COL[2]}" y="${Y0 + j * DY + 12}" class="svg-parametre" font-size="11" style="font-family: var(--police-code)" data-c="2-${j}">${V[j]}</text>
    <text x="${COL[3]}" y="${Y0 + j * DY + 12}" class="svg-texte" font-size="12" data-c="3-${j}">${fr(SCORES[j], 0)}</text>
    <text x="${COL[4]}" y="${Y0 + j * DY + 12}" class="svg-texte" font-size="12" data-c="4-${j}">${fr(ECHELLE[j], 2)}</text>
    <rect x="${COL[5]}" y="${Y0 + j * DY + 2}" width="${Math.max(1, 20 * POIDS[j])}" height="12" rx="2" class="svg-sortie" data-c="5-${j}" />
    <text x="${COL[5] + 23}" y="${Y0 + j * DY + 12}" class="svg-texte" font-size="10" data-cp="${j}">${fr(POIDS[j], 2)}</text>`).join('');
  return `
    <text x="4" y="18" class="svg-texte" font-size="13" font-weight="700">requête q = (1 ; 2)</text>
    <text x="4" y="36" class="svg-doux" font-size="10" data-sous></text>
    ${titres}${lignes}
    <text x="4" y="200" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="220" class="svg-doux" font-size="11" data-t2></text>
    <text x="4" y="240" class="svg-doux" font-size="11" data-t3></text>`;
}

const TEXTES = [
  ['Trois rôles pour chaque mot', 'on part des mêmes h et s que dans la fiche attention', ''],
  ['Trois projections', 'q = s W_Q ; chaque h donne une clé h W_K', 'et une valeur h W_V : deux vecteurs différents'],
  ['On compare la requête aux clés', 'score = q · k, un produit scalaire par mot', 'les valeurs ne servent pas encore'],
  ['On divise par √d_k = √2', 'les écarts entre scores se tassent un peu', ''],
  ['Le softmax donne les poids', 'somme des poids : 1', '« paie » l’emporte, « Koffi » garde 0,19'],
  ['On mélange les valeurs', 'sortie = 0,011 v₁ + 0,795 v₂ + 0,193 v₃', '≈ (0,61 ; 1,95)'],
];

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(5, Math.round(e.k)));
  // Colonne visible à partir de l'étape : clé et valeur (1), score (2), échelle (3), poids (4).
  const visibleDes = [0, 1, 1, 2, 3, 4];
  for (let c = 1; c <= 5; c++) {
    const vis = k >= visibleDes[c];
    q(svg, `[data-titre="${c}"]`).setAttribute('opacity', vis ? '1' : '0');
    for (let j = 0; j < 3; j++) {
      q(svg, `[data-c="${c}-${j}"]`).setAttribute('opacity', vis ? (k === 5 && c !== 2 && c !== 5 ? '0.35' : '1') : '0');
    }
  }
  for (let j = 0; j < 3; j++) q(svg, `[data-cp="${j}"]`).setAttribute('opacity', k >= 4 ? '1' : '0');
  for (let j = 0; j < 3; j++) q(svg, `[data-ligne="${j}"]`).setAttribute('fill-opacity', k >= 4 && j === 1 ? '0.22' : '0.08');
  texte(svg, '[data-sous]', k >= 1 ? 'q = s W_Q, avec s = (1 ; 1), l’état du décodeur' : 's = (1 ; 1), l’état du décodeur');
  const [t1, t2, t3] = TEXTES[k];
  texte(svg, '[data-t1]', t1);
  texte(svg, '[data-t2]', t2);
  texte(svg, '[data-t3]', t3);
  scene.setAttribute('aria-label', `${t1}. ${t2} ${t3}`);
}
