// Fiche « normalisation-couches » : un vecteur d'activations x = s × (2 ; 4 ; 6 ; 8) + c,
// puis sa LayerNorm (moyenne 0, variance 1) et sa RMSNorm (moyenne quadratique 1), sans γ ni β.
// Exemple : s = 1, c = 0 : LayerNorm ≈ (−1,342 ; −0,447 ; 0,447 ; 1,342), RMSNorm ≈ (0,365 ; 0,730 ; 1,095 ; 1,461).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'normalisation-couches';
const BASE = [2, 4, 6, 8];
const EPS = 1e-5;

export function layerNorm(x: number[]) {
  const m = x.reduce((a, b) => a + b, 0) / x.length;
  const v = x.reduce((a, b) => a + (b - m) ** 2, 0) / x.length;
  return x.map((u) => (u - m) / Math.sqrt(v + EPS));
}
export function rmsNorm(x: number[]) {
  const r = Math.sqrt(x.reduce((a, b) => a + b * b, 0) / x.length + EPS);
  return x.map((u) => u / r);
}

export const etats: Record<string, Etat> = { initial: { s: 1, c: 0 } };

const LIGNES = [{ y: 58, nom: 'entrée x', cle: 'x', classe: 'svg-entree', echelle: 60 }, { y: 128, nom: 'LayerNorm', cle: 'l', classe: 'svg-sortie', echelle: 2.5 }, { y: 198, nom: 'RMSNorm', cle: 'r', classe: 'svg-sortie', echelle: 2.5 }];

function gabarit() {
  return LIGNES.map((l) => `
    <text x="4" y="${l.y - 34}" class="svg-texte" font-size="12" font-weight="600">${l.nom}</text>
    <line x1="80" y1="${l.y}" x2="336" y2="${l.y}" class="svg-trait-doux" />
    ${BASE.map((_, i) => `<rect data-${l.cle}="${i}" x="${92 + i * 62}" width="38" rx="2" class="${l.classe}" />
      <text data-t${l.cle}="${i}" x="${111 + i * 62}" text-anchor="middle" class="svg-texte" font-size="10"></text>`).join('')}`).join('') + `
    <text x="4" y="232" class="svg-doux" font-size="11" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="12" font-weight="600" data-t2></text>`;
}

function barres(svg: SVGSVGElement, cle: string, y0: number, valeurs: number[], echelle: number) {
  valeurs.forEach((v, i) => {
    const h = Math.max(-26, Math.min(26, (v / echelle) * 26));
    attrs(q(svg, `[data-${cle}="${i}"]`), { y: h >= 0 ? y0 - h : y0, height: Math.max(0.8, Math.abs(h)) });
    const t = q(svg, `[data-t${cle}="${i}"]`);
    attrs(t, { y: h >= 0 ? y0 - h - 3 : y0 - h + 10 });
    t.textContent = fr(v, Math.abs(v) >= 100 ? 0 : 2, 0);
  });
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const x = BASE.map((b) => e.s * b + e.c);
  const echelleX = Math.max(1, ...x.map(Math.abs));
  barres(svg, 'x', LIGNES[0].y, x, echelleX);
  const l = layerNorm(x), r = rmsNorm(x);
  barres(svg, 'l', LIGNES[1].y, l, 2);
  barres(svg, 'r', LIGNES[2].y, r, 2);
  texte(svg, '[data-t1]', `x = ${fr(e.s, 1, 0)} × (2 ; 4 ; 6 ; 8) + ${fr(e.c, 1, 0)}`);
  texte(svg, '[data-t2]', `LayerNorm ne bouge pas ; RMSNorm ${Math.abs(e.c) < 0.05 ? 'non plus' : 'change avec le décalage'}`);
  scene.setAttribute('aria-label', `Entrée ${x.map((v) => fr(v, 1, 0)).join(', ')}. LayerNorm ${l.map((v) => fr(v, 2)).join(', ')}. RMSNorm ${r.map((v) => fr(v, 2)).join(', ')}.`);
}
