// Fiche « produit-matriciel » : chaque case de C = Q P est le produit scalaire
// d'une ligne de Q par une colonne de P. Nombres de la fiche :
// Q = quantités (Awa, Fatou) × (tomates, oignons, piment), P = prix × (marché A, marché B).
import type { Etat } from '../animations/types';
import { svgDe, q, attrs, texte } from '../animations/svg';

export const fiche = 'produit-matriciel';
const Q = [[2, 1, 3], [1, 2, 0]];
const P = [[500, 450], [400, 450], [100, 150]];
const C = Q.map((l) => P[0].map((_, j) => l.reduce((s, v, k) => s + v * P[k][j], 0)));

const QX = 56, QW = 34, PX = 180, PW = 64, H = 28, PY = 34, QY = 136;

export const etats: Record<string, Etat> = {
  initial: { i: 0, j: 0, hl: 0, c0: 0, c1: 0, c2: 0, c3: 0 },
  c11: { i: 0, j: 0, hl: 1, c0: 1, c1: 0, c2: 0, c3: 0 },
  c12: { i: 0, j: 1, hl: 1, c0: 1, c1: 1, c2: 0, c3: 0 },
  c21: { i: 1, j: 0, hl: 1, c0: 1, c1: 1, c2: 1, c3: 0 },
  c22: { i: 1, j: 1, hl: 1, c0: 1, c1: 1, c2: 1, c3: 1 },
};

// Espace insécable ordinaire : l'espace fine (U+202F) manque dans certaines polices.
const milliers = (n: number) => n.toLocaleString('fr-FR').replace(/ /g, ' ');

function gabarit() {
  const qCases = Q.flatMap((l, i) => l.map((v, j) => `<text x="${QX + j * QW + QW / 2}" y="${QY + i * H + 19}" text-anchor="middle" class="svg-entree" font-size="15">${v}</text>`)).join('');
  const pCases = P.flatMap((l, i) => l.map((v, j) => `<text x="${PX + j * PW + PW / 2}" y="${PY + i * H + 19}" text-anchor="middle" class="svg-entree" font-size="14">${v}</text>`)).join('');
  const cCases = C.flatMap((l, i) => l.map((v, j) => `<text x="${PX + j * PW + PW / 2}" y="${QY + i * H + 19}" text-anchor="middle" class="svg-texte" font-size="14" font-weight="600" data-c="${i * 2 + j}">${milliers(v)}</text>`)).join('');
  return `
    <rect data-hl-l x="${QX - 2}" width="${3 * QW + 4}" height="${H}" rx="4" class="svg-fond-sortie" />
    <rect data-hl-c y="${PY - 2}" width="${PW}" height="${3 * H + 4}" rx="4" class="svg-fond-sortie" />
    <rect data-hl-r width="${PW - 4}" height="${H - 4}" rx="4" fill="none" class="svg-trait-sortie" stroke-width="2.5" />
    ${qCases}${pCases}${cCases}
    <text x="${QX - 6}" y="${QY + 19}" text-anchor="end" class="svg-doux" font-size="11">Awa</text>
    <text x="${QX - 6}" y="${QY + H + 19}" text-anchor="end" class="svg-doux" font-size="11">Fatou</text>
    <text x="${QX + QW / 2}" y="${QY - 8}" text-anchor="middle" class="svg-doux" font-size="10">tom.</text>
    <text x="${QX + 1.5 * QW}" y="${QY - 8}" text-anchor="middle" class="svg-doux" font-size="10">oign.</text>
    <text x="${QX + 2.5 * QW}" y="${QY - 8}" text-anchor="middle" class="svg-doux" font-size="10">pim.</text>
    <text x="${PX + PW / 2}" y="${PY - 10}" text-anchor="middle" class="svg-doux" font-size="11">marché A</text>
    <text x="${PX + 1.5 * PW}" y="${PY - 10}" text-anchor="middle" class="svg-doux" font-size="11">marché B</text>
    <text x="${QX}" y="${QY + 2 * H + 18}" class="svg-entree" font-size="13" font-weight="600">Q (2 × 3)</text>
    <text x="${PX - 12}" y="${PY + 38}" text-anchor="end" class="svg-entree" font-size="13" font-weight="600">P (3 × 2)</text>
    <text x="${PX - 12}" y="${PY + 54}" text-anchor="end" class="svg-doux" font-size="11">prix en F</text>
    <text x="${PX}" y="${QY + 2 * H + 18}" class="svg-texte" font-size="13" font-weight="600">C = QP (2 × 2)</text>
    <line x1="${PX - 8}" y1="${QY - 4}" x2="${PX + 2 * PW}" y2="${QY - 4}" class="svg-trait" />
    <text x="8" y="238" class="svg-texte" font-size="13" font-weight="600" data-calcul></text>
    <text x="8" y="256" class="svg-doux" font-size="12" data-sens></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  // Mode manipulation : les curseurs « ligne » et « colonne » (1 ou 2) choisissent la case.
  if (e.ligne !== undefined) e = { i: e.ligne - 1, j: e.colonne - 1, hl: 1, c0: 1, c1: 1, c2: 1, c3: 1 };
  attrs(q(svg, '[data-hl-l]'), { y: QY + e.i * H });
  attrs(q(svg, '[data-hl-c]'), { x: PX + e.j * PW });
  attrs(q(svg, '[data-hl-r]'), { x: PX + e.j * PW + 2, y: QY + e.i * H + 2 });
  for (const s of ['[data-hl-l]', '[data-hl-c]', '[data-hl-r]']) q(svg, s).style.opacity = String(e.hl);
  [e.c0, e.c1, e.c2, e.c3].forEach((v, k) => (q(svg, `[data-c="${k}"]`).style.opacity = String(v)));
  const i = Math.round(e.i), j = Math.round(e.j);
  const noms = ['Awa', 'Fatou'], marches = ['A', 'B'];
  if (e.hl > 0.5) {
    const termes = Q[i].map((v, k) => `${v}×${P[k][j]}`).join(' + ');
    texte(svg, '[data-calcul]', `c${['₁', '₂'][i]}${['₁', '₂'][j]} = ${termes} = ${milliers(C[i][j])}`);
    texte(svg, '[data-sens]', `Ce que paie ${noms[i]} au marché ${marches[j]}.`);
  } else {
    texte(svg, '[data-calcul]', 'Q × P : ligne de Q, colonne de P.');
    texte(svg, '[data-sens]', 'Chaque case du résultat est un produit scalaire.');
  }
  scene.setAttribute('aria-label', `${q(svg, '[data-calcul]').textContent} ${q(svg, '[data-sens]').textContent}`);
}
