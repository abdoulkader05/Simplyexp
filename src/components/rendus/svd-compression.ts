// Fiche « svd » : une image 8 × 8 reconstruite avec k morceaux de rang 1.
// Décomposition calculée avec numpy.linalg.svd (4 décimales) ; l'image est de rang 4.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'svd';
const M = [
  [0, 0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 0, 0, 1, 1, 0], [0, 1, 1, 0, 0, 1, 1, 0], [0, 1, 1, 0, 0, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0],
];
const S = [5.5147, 2.3018, 1.2699, 0.823];
const U = [
  [-0.1141, 0.5289, -0.1137, 0.3858], [-0.2841, 0.4057, -0.4157, -0.7628], [-0.4354, 0.1294, -0.2022, 0.3412],
  [-0.4661, 0.2078, 0.842, -0.1747], [-0.3213, -0.3996, -0.0885, -0.0446], [-0.3213, -0.3996, -0.0885, -0.0446],
  [-0.3213, -0.3996, -0.0885, -0.0446], [-0.4354, 0.1294, -0.2022, 0.3412],
];
const VT = [
  [-0.0845, -0.4173, -0.4688, -0.3147, -0.3147, -0.4688, -0.4173, -0.0845],
  [0.0903, -0.3181, -0.1418, 0.6088, 0.6088, -0.1418, -0.3181, 0.0903],
  [0.6631, 0.1356, -0.1918, -0.0722, -0.0722, -0.1918, 0.1356, 0.6631],
  [-0.2123, 0.4543, -0.4726, 0.1587, 0.1587, -0.4726, 0.4543, -0.2123],
];
const C = 13, G1 = 14, G2 = 186, Y = 40;

export const etats: Record<string, Etat> = { initial: { k: 1 } };

function grille(x0: number, attr: string) {
  let s = '';
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++)
    s += `<rect x="${x0 + j * C * 1.08}" y="${Y + i * C * 1.08}" width="${C}" height="${C}" rx="2" class="svg-encre" ${attr}="${i}-${j}" />`;
  return s;
}

function gabarit() {
  return `
    <text x="${G1}" y="26" class="svg-doux" font-size="11">image de départ (64 nombres)</text>
    <text x="${G2}" y="26" class="svg-doux" font-size="11" data-titre></text>
    ${grille(G1, 'data-m')}${grille(G2, 'data-r')}
    <text x="${G1}" y="${Y + 8 * C * 1.08 + 26}" class="svg-texte" font-size="13" data-sig></text>
    <text x="${G1}" y="${Y + 8 * C * 1.08 + 46}" class="svg-texte" font-size="13" data-sto></text>
    <rect x="${G1 - 4}" y="${Y + 8 * C * 1.08 + 52}" width="200" height="21" rx="3" class="svg-fond-sortie" />
    <text x="${G1}" y="${Y + 8 * C * 1.08 + 67}" class="svg-texte" font-size="14" font-weight="600" data-err></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.round(e.k);
  const r = Math.min(k, 4);
  let ecart = 0, total = 0;
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    let v = 0;
    for (let t = 0; t < r; t++) v += S[t] * U[i][t] * VT[t][j];
    ecart += (M[i][j] - v) ** 2;
    total += M[i][j] ** 2;
    q(svg, `[data-m="${i}-${j}"]`).style.opacity = String(0.06 + 0.94 * M[i][j]);
    q(svg, `[data-r="${i}-${j}"]`).style.opacity = String(0.06 + 0.94 * Math.max(0, Math.min(1, v)));
  }
  const err = Math.sqrt(ecart / total) * 100;
  texte(svg, '[data-titre]', `avec k = ${k} morceau${k > 1 ? 'x' : ''} de rang 1`);
  texte(svg, '[data-sig]', `valeurs singulières : 5,51 · 2,30 · 1,27 · 0,82 · 0 · 0 · 0 · 0`.replace(/ · /g, ' ; '));
  texte(svg, '[data-sto]', `à stocker : ${k} × (8 + 8 + 1) = ${k * 17} nombres`);
  texte(svg, '[data-err]', `erreur relative : ${fr(err, 1, 1)} %`);
  scene.setAttribute('aria-label', `Reconstruction avec ${k} valeurs singulières : erreur relative ${fr(err, 1, 1)} %, ${k * 17} nombres à stocker.`);
}
