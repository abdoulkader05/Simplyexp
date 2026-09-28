// Fiche « matrices » : lire une ligne, une colonne, un élément, puis transposer.
// A = ventes (en kg ou en tas) de 3 jours × 3 produits, les nombres de la fiche.
import type { Etat } from '../animations/types';
import { svgDe, q, attrs, texte } from '../animations/svg';

export const fiche = 'matrices';
const A = [[4, 2, 6], [3, 5, 1], [2, 2, 8]];
const LIGNES = ['lundi', 'mardi', 'mercr.'];
const COLONNES = ['tomates', 'oignons', 'piment'];
const X0 = 120, Y0 = 62, W = 66, H = 42;

export const etats: Record<string, Etat> = {
  initial: { ligne: 0, colonne: 0, element: 0, t: 0 },
  ligne: { ligne: 1, colonne: 0, element: 0, t: 0 },
  colonne: { ligne: 0, colonne: 1, element: 0, t: 0 },
  element: { ligne: 0.35, colonne: 0.35, element: 1, t: 0 },
  transposee: { ligne: 0, colonne: 0, element: 0, t: 1 },
};

const centre = (i: number, j: number) => [X0 + j * W + W / 2, Y0 + i * H + H / 2];

function gabarit() {
  const cases = A.flatMap((l, i) => l.map((v, j) =>
    `<text text-anchor="middle" class="svg-texte" font-size="17" data-case="${i}-${j}">${v}</text>`)).join('');
  const et = [...LIGNES.map((n, i) => `<text class="svg-doux" font-size="12" text-anchor="middle" data-el="${i}">${n}</text>`),
    ...COLONNES.map((n, j) => `<text class="svg-doux" font-size="12" text-anchor="middle" data-ec="${j}">${n}</text>`)].join('');
  return `
    <rect data-hl-ligne x="${X0}" y="${Y0 + H}" width="${3 * W}" height="${H}" rx="4" class="svg-fond-sortie" />
    <rect data-hl-col x="${X0 + 2 * W}" y="${Y0}" width="${W}" height="${3 * H}" rx="4" class="svg-fond-sortie" />
    <rect data-hl-el x="${X0 + 2 * W + 3}" y="${Y0 + H + 3}" width="${W - 6}" height="${H - 6}" rx="4" fill="none" class="svg-trait-sortie" stroke-width="2.5" />
    <path d="M${X0 - 6},${Y0} h-6 v${3 * H} h6 M${X0 + 3 * W + 6},${Y0} h6 v${3 * H} h-6" fill="none" class="svg-trait-encre" stroke-width="1.5" />
    ${cases}${et}
    <text x="12" y="${Y0 + 3 * H + 44}" class="svg-texte" font-size="14" font-weight="600" data-legende></text>
    <text x="12" y="${Y0 + 3 * H + 64}" class="svg-doux" font-size="12" data-sous></text>
    <text x="12" y="24" class="svg-entree" font-size="15" font-weight="600" data-nom>A</text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const t = e.t ?? 0;
  A.forEach((l, i) => l.forEach((_, j) => {
    const [x1, y1] = centre(i, j), [x2, y2] = centre(j, i);
    attrs(q(svg, `[data-case="${i}-${j}"]`), { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t + 6 });
  }));
  // Étiquettes : les jours passent de la gauche au-dessus, les produits du dessus à gauche.
  LIGNES.forEach((_, i) => {
    const [xa, ya] = [X0 - 50, Y0 + i * H + H / 2 + 4], [xb, yb] = [X0 + i * W + W / 2, Y0 - 10];
    attrs(q(svg, `[data-el="${i}"]`), { x: xa + (xb - xa) * t, y: ya + (yb - ya) * t });
  });
  COLONNES.forEach((_, j) => {
    const [xa, ya] = [X0 + j * W + W / 2, Y0 - 10], [xb, yb] = [X0 - 50, Y0 + j * H + H / 2 + 4];
    attrs(q(svg, `[data-ec="${j}"]`), { x: xa + (xb - xa) * t, y: ya + (yb - ya) * t });
  });
  q(svg, '[data-hl-ligne]').style.opacity = String(e.ligne ?? 0);
  q(svg, '[data-hl-col]').style.opacity = String(e.colonne ?? 0);
  q(svg, '[data-hl-el]').style.opacity = String(e.element ?? 0);
  texte(svg, '[data-nom]', t > 0.5 ? 'Aᵀ (3 × 3)' : 'A (3 × 3)');

  let legende = 'Une ligne par jour, une colonne par produit.', sous = '3 lignes et 3 colonnes : A est de taille 3 × 3.';
  if (t > 0.5) { legende = 'Transposée : lignes et colonnes échangées.'; sous = 'Aᵀ a une ligne par produit : (Aᵀ)₃₂ = a₂₃ = 1.'; }
  else if (e.element > 0.5) { legende = 'Élément a₂₃ = 1 : ligne 2, colonne 3.'; sous = 'Mardi, on a vendu 1 tas de piment.'; }
  else if (e.colonne > 0.5) { legende = 'Colonne 3 : (6 ; 1 ; 8).'; sous = 'Le piment vendu chaque jour.'; }
  else if (e.ligne > 0.5) { legende = 'Ligne 2 : (3 ; 5 ; 1).'; sous = 'Tout ce qu’on a vendu mardi.'; }
  if (e.i !== undefined && e.j !== undefined) {
    // Mode manipulation : les curseurs choisissent la ligne i et la colonne j.
    const i = Math.round(e.i) - 1, j = Math.round(e.j) - 1;
    attrs(q(svg, '[data-hl-el]'), { x: X0 + j * W + 3, y: Y0 + i * H + 3 });
    attrs(q(svg, '[data-hl-ligne]'), { y: Y0 + i * H });
    attrs(q(svg, '[data-hl-col]'), { x: X0 + j * W });
    q(svg, '[data-hl-ligne]').style.opacity = '0.35';
    q(svg, '[data-hl-col]').style.opacity = '0.35';
    q(svg, '[data-hl-el]').style.opacity = '1';
    const ind = ['₁', '₂', '₃'];
    legende = `a${ind[i]}${ind[j]} = ${A[i][j]} : ligne ${i + 1}, colonne ${j + 1}.`;
    sous = `${LIGNES[i] === 'mercr.' ? 'mercredi' : LIGNES[i]}, ${COLONNES[j]}.`;
  }
  texte(svg, '[data-legende]', legende);
  texte(svg, '[data-sous]', sous);
  scene.setAttribute('aria-label', `${legende} ${sous}`);
}
