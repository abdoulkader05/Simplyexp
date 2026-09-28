// Fiche « rang-matrice » : l'image du carré unité par M = [c1 c2].
// c1 = (2 ; 1) fixe, c2 = (a ; b) réglable. Colonnes alignées : le carré s'écrase, rang 1.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, fleche, texte, repere, attrs, points } from '../animations/svg';

export const fiche = 'rang-matrice';
const C1 = [2, 1];
const R = repere(150, 128, 26);

export const etats: Record<string, Etat> = { initial: { a: 1, b: 2 } };

function gabarit() {
  return `
    ${R.grille(4)}
    <polygon data-carre points="${points([[R.x(0), R.y(0)], [R.x(1), R.y(0)], [R.x(1), R.y(1)], [R.x(0), R.y(1)]])}" fill="none" class="svg-trait-doux svg-pointille" />
    <polygon data-image class="svg-fond-sortie" opacity=".8" />
    <line data-droite class="svg-trait-sortie" stroke-width="4" stroke-linecap="round" />
    <g data-c1></g><g data-c2></g>
    <text class="svg-entree" font-size="13" font-weight="600" x="${R.x(2) + 5}" y="${R.y(1) + 12}">c₁</text>
    <text class="svg-entree" font-size="13" font-weight="600" data-l2>c₂</text>
    <text x="4" y="20" class="svg-doux" font-size="11">pointillés : carré de départ ; doré : son image</text>
    <text x="4" y="236" class="svg-entree" font-size="13" data-m></text>
    <text x="4" y="256" class="svg-texte" font-size="14" font-weight="600" data-r></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const c2 = [e.a, e.b];
  const aire = Math.abs(C1[0] * c2[1] - C1[1] * c2[0]);
  const rang = aire < 1e-9 ? 1 : 2;
  const s = [C1[0] + c2[0], C1[1] + c2[1]];
  attrs(q(svg, '[data-image]'), { points: points([[R.x(0), R.y(0)], [R.x(C1[0]), R.y(C1[1])], [R.x(s[0]), R.y(s[1])], [R.x(c2[0]), R.y(c2[1])]]) });
  // Rang 1 : le parallélogramme est plat ; on trace le segment qu'il est devenu.
  const pts = [[0, 0], C1, s, c2];
  const ext = pts.reduce((m, p) => (Math.hypot(p[0], p[1]) > Math.hypot(m[0], m[1]) ? p : m), [0, 0]);
  const opp = pts.reduce((m, p) => (p[0] * ext[0] + p[1] * ext[1] < m[0] * ext[0] + m[1] * ext[1] ? p : m), [0, 0]);
  attrs(q(svg, '[data-droite]'), { x1: R.x(opp[0]), y1: R.y(opp[1]), x2: R.x(ext[0]), y2: R.y(ext[1]) });
  q(svg, '[data-droite]').style.opacity = rang === 1 ? '1' : '0';
  fleche(q(svg, '[data-c1]'), R.x(0), R.y(0), R.x(C1[0]), R.y(C1[1]), 'entree', 3);
  fleche(q(svg, '[data-c2]'), R.x(0), R.y(0), R.x(c2[0]), R.y(c2[1]), 'entree', 3);
  attrs(q(svg, '[data-l2]'), { x: R.x(c2[0]) + 5, y: R.y(c2[1]) - 5 });
  texte(svg, '[data-m]', `colonnes : c₁ = (2 ; 1), c₂ = (${fr(e.a, 1, 0)} ; ${fr(e.b, 1, 0)})`);
  texte(svg, '[data-r]', rang === 2 ? `rang 2 : aire de l’image = ${fr(aire, 1, 0)}` : 'rang 1 : colonnes alignées, le carré s’écrase');
  scene.setAttribute('aria-label', `Deuxième colonne (${fr(e.a, 1, 0)} ; ${fr(e.b, 1, 0)}). ${rang === 2 ? `Rang 2, l'image du carré a une aire de ${fr(aire, 1, 0)}.` : 'Rang 1 : les colonnes sont alignées et le carré devient un segment.'}`);
}
