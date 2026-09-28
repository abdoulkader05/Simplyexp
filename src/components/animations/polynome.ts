// Données simulées et ajustement polynomial pour les fiches « surapprentissage » et « regularisation ».
// Fréquentation d'un marché (en centaines de personnes) selon l'heure, de 6 h à 18 h.
import { generateur, gaussien } from './alea';

export const vraie = (h: number) => 2 + 6 * Math.exp(-(((h - 10) / 2.2) ** 2)) + 3 * Math.exp(-(((h - 16) / 1.6) ** 2));
const alea = generateur(11);
// Heures réparties sur toute la journée (une par tranche), pour ne pas extrapoler.
const tirer = (n: number) => Array.from({ length: n }, (_, i) => {
  const h = 6 + (12 * (i + 0.2 + 0.6 * alea())) / n;
  return [h, vraie(h) + gaussien(alea) * 0.8] as [number, number];
});
export const TRAIN = tirer(10);
/** Un nouveau jeu d'entraînement de 10 comptages, tiré avec sa propre graine. */
export function jeu(graine: number, n = 10): [number, number][] {
  const a = generateur(graine);
  return Array.from({ length: n }, (_, i) => {
    const h = 6 + (12 * (i + 0.2 + 0.6 * a())) / n;
    return [h, vraie(h) + gaussien(a) * 0.8];
  });
}
export const TEST = tirer(40);

const u = (h: number) => (h - 12) / 6; // on ramène les heures dans [−1 ; 1] pour la stabilité

/** Ajuste un polynôme de degré d par moindres carrés, avec une pénalité L2 lambda sur les coefficients. */
export function ajuster(d: number, lambda = 1e-9, points = TRAIN) {
  const n = d + 1;
  const A = Array.from({ length: n }, () => new Array(n).fill(0));
  const B = new Array(n).fill(0);
  for (const [h, y] of points) {
    const p = Array.from({ length: n }, (_, k) => u(h) ** k);
    for (let i = 0; i < n; i++) {
      B[i] += p[i] * y;
      for (let j = 0; j < n; j++) A[i][j] += p[i] * p[j];
    }
  }
  for (let i = 1; i < n; i++) A[i][i] += lambda * points.length; // le terme constant n'est pas pénalisé
  // Élimination de Gauss avec pivot partiel.
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]];
    [B[c], B[piv]] = [B[piv], B[c]];
    for (let r = c + 1; r < n; r++) {
      const f = A[r][c] / A[c][c];
      for (let k = c; k < n; k++) A[r][k] -= f * A[c][k];
      B[r] -= f * B[c];
    }
  }
  const coef = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = B[i];
    for (let k = i + 1; k < n; k++) s -= A[i][k] * coef[k];
    coef[i] = s / A[i][i];
  }
  const f = (h: number) => coef.reduce((s, c, k) => s + c * u(h) ** k, 0);
  const mse = (pts: [number, number][]) => pts.reduce((s, [h, y]) => s + (f(h) - y) ** 2, 0) / pts.length;
  return { f, coef, train: mse(TRAIN), test: mse(TEST) };
}
