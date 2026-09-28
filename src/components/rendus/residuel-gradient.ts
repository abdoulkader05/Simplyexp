// Fiche « connexions-residuelles » : gradient reçu par chaque couche, sans et avec connexion résiduelle.
// Sans : chaque couche multiplie le gradient par la pente b de sa branche. Avec : par 1 + b.
// Exemple : b = 0,1 et 30 couches : 0,1²⁹ = 10⁻²⁹ sans, 1,1²⁹ ≈ 15,9 avec ; b = −0,02 : 0,98²⁹ ≈ 0,56.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'connexions-residuelles';
const MAX = 40;
const hy = (g: number) => Math.max(0, Math.min(1, (Math.log10(Math.max(g, 1e-12)) + 12) / 15)) * 80;

export const etats: Record<string, Etat> = { initial: { couches: 30, pente: 0.1 } };

function panneau(y0: number, titre: string, cle: string) {
  return `
    <text x="34" y="${y0 - 84}" class="svg-texte" font-size="11" font-weight="600">${titre}</text>
    <line x1="34" y1="${y0 - hy(1)}" x2="336" y2="${y0 - hy(1)}" class="svg-trait-doux" stroke-dasharray="3 3" />
    <text x="30" y="${y0 - hy(1) + 3}" text-anchor="end" class="svg-doux" font-size="9">1</text>
    <line x1="34" y1="${y0}" x2="336" y2="${y0}" class="svg-trait-doux" />
    ${Array.from({ length: MAX }, (_, k) => `<rect data-${cle}="${k}" rx="1" />`).join('')}`;
}

function gabarit() {
  return `
    ${panneau(104, 'sans connexion résiduelle : h ← F(h)', 'a')}
    ${panneau(206, 'avec connexion résiduelle : h ← h + F(h)', 'r')}
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

const ecrit = (v: number) => (v >= 1e-3 && v < 1e4 ? fr(v, 3, 0) : v.toExponential(0).replace('e', ' × 10^').replace('^+', '^').replace('-', '−'));

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const L = Math.max(2, Math.min(MAX, Math.round(e.couches)));
  const larg = 300 / L;
  for (const [cle, y0, f] of [['a', 104, Math.abs(e.pente)], ['r', 206, Math.abs(1 + e.pente)]] as [string, number, number][]) {
    for (let k = 0; k < MAX; k++) {
      const r = q(svg, `[data-${cle}="${k}"]`);
      if (k >= L) { r.setAttribute('height', '0'); continue; }
      const g = f ** (L - 1 - k), h = hy(g);
      r.setAttribute('x', String(36 + k * larg));
      r.setAttribute('width', String(Math.max(1.5, larg - 1.5)));
      r.setAttribute('y', String(y0 - h));
      r.setAttribute('height', String(Math.max(0.5, h)));
      r.setAttribute('class', g < 1e-3 || g > 1e3 ? 'svg-perte' : 'svg-parametre');
    }
  }
  const sans = Math.abs(e.pente) ** (L - 1), avec = Math.abs(1 + e.pente) ** (L - 1);
  texte(svg, '[data-t1]', `${L} couches, pente de la branche b = ${fr(e.pente, 2)}`);
  texte(svg, '[data-t2]', `couche 1 : ${ecrit(sans)} sans, ${ecrit(avec)} avec`);
  scene.setAttribute('aria-label', `${L} couches, pente ${fr(e.pente, 2)} : la première couche reçoit ${ecrit(sans)} fois le gradient sans connexion résiduelle, et ${ecrit(avec)} fois avec.`);
}
