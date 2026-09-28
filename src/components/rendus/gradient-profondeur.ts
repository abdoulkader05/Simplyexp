// Fiche « gradient-evanescent » : le gradient reçu par la couche k d'un réseau de L couches
// est multiplié par un facteur a à chaque couche traversée : a^(L − k).
// Exemple : a = 0,25 (pente max de la sigmoïde), L = 10 : 0,25⁹ ≈ 3,8 × 10⁻⁶ pour la première couche.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'gradient-evanescent';
const MAX = 40;
// Échelle logarithmique : de 10⁻¹² (bas) à 10⁶ (haut).
const hy = (g: number) => Math.max(0, Math.min(1, (Math.log10(Math.max(g, 1e-12)) + 12) / 18)) * 170;
const Y0 = 196;

export const etats: Record<string, Etat> = { initial: { couches: 10, facteur: 0.25 } };

function gabarit() {
  const grad = [-12, -6, 0, 6].map((p) => `<line x1="34" y1="${Y0 - hy(10 ** p)}" x2="336" y2="${Y0 - hy(10 ** p)}" class="svg-trait-doux" stroke-opacity=".4" />
    <text x="30" y="${Y0 - hy(10 ** p) + 3}" text-anchor="end" class="svg-doux" font-size="9">10${p === 0 ? '⁰' : p < 0 ? '⁻' + String(-p).replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]) : String(p).replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c])}</text>`).join('');
  const barres = Array.from({ length: MAX }, (_, k) => `<rect data-b="${k}" width="6" rx="1" />`).join('');
  return `
    ${grad}
    ${barres}
    <text x="34" y="${Y0 + 13}" class="svg-doux" font-size="10">couche 1 (entrée)</text>
    <text x="336" y="${Y0 + 13}" text-anchor="end" class="svg-doux" font-size="10">dernière couche</text>
    <text x="34" y="16" class="svg-doux" font-size="10">taille du gradient reçu par chaque couche (échelle log)</text>
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-perte" font-size="13" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const L = Math.max(1, Math.min(MAX, Math.round(e.couches)));
  const larg = 300 / L;
  for (let k = 0; k < MAX; k++) {
    const r = q(svg, `[data-b="${k}"]`);
    if (k >= L) { r.setAttribute('height', '0'); continue; }
    const g = e.facteur ** (L - 1 - k);
    const h = hy(g);
    r.setAttribute('x', String(36 + k * larg));
    r.setAttribute('width', String(Math.max(1.5, larg - 1.5)));
    r.setAttribute('y', String(Y0 - h));
    r.setAttribute('height', String(h));
    r.setAttribute('class', g < 1e-3 || g > 1e3 ? 'svg-perte' : 'svg-parametre');
  }
  const g1 = e.facteur ** (L - 1);
  const ecrit = (v: number) => (v >= 1e-3 && v < 1e4 ? fr(v, 4, 0) : v.toExponential(1).replace('.', ',').replace('e', ' × 10^').replace('^+', '^'));
  texte(svg, '[data-t1]', `${L} couches, facteur ${fr(e.facteur, 2)} par couche`);
  texte(svg, '[data-t2]', `gradient de la couche 1 : ${ecrit(g1)} × celui de la dernière`);
  scene.setAttribute('aria-label', `${L} couches et un facteur ${fr(e.facteur, 2)} : la première couche reçoit ${ecrit(g1)} fois le gradient de la dernière.`);
}
