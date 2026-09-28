// Fiche « regression-lineaire » : prix = w × distance + b sur les 4 trajets du gbaka.
// Meilleure droite (moindres carrés) : w = 136 F/km, b = 4 F, MSE = 800.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';
import { TRAJETS } from '../animations/gbaka';

export const fiche = 'regression-lineaire';
const dx = (x: number) => 40 + (x / 9) * 285;
const dy = (y: number) => 200 - ((y + 200) / 1500) * 185;

export const etats: Record<string, Etat> = { initial: { w: 100, b: 150 } };

function gabarit() {
  const pts = TRAJETS.map(([x, y]) => `<circle cx="${dx(x)}" cy="${dy(y)}" r="5" class="svg-entree" />`).join('');
  const res = TRAJETS.map((_, i) => `<line data-res="${i}" class="svg-trait-perte" stroke-width="2.5" />`).join('');
  const graduations = [0, 500, 1000].map((v) => `<text x="${dx(0) - 6}" y="${dy(v) + 4}" text-anchor="end" class="svg-doux" font-size="10">${v}</text>`).join('');
  return `
    <line x1="${dx(0)}" y1="${dy(0)}" x2="${dx(9)}" y2="${dy(0)}" class="svg-trait-doux" />
    <line x1="${dx(0)}" y1="${dy(-200)}" x2="${dx(0)}" y2="${dy(1300)}" class="svg-trait-doux" />
    ${graduations}
    <text x="${dx(9)}" y="${dy(0) + 14}" text-anchor="end" class="svg-doux" font-size="10">distance (km)</text>
    <text x="${dx(0) + 4}" y="${dy(1300) + 4}" class="svg-doux" font-size="10">prix (F)</text>
    <line data-droite class="svg-trait-parametre" stroke-width="2.5" />
    ${res}${pts}
    <text x="4" y="232" class="svg-parametre" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-perte" font-size="14" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const f = (x: number) => e.w * x + e.b;
  attrs(q(svg, '[data-droite]'), { x1: dx(0), y1: dy(f(0)), x2: dx(9), y2: dy(f(9)) });
  let s = 0;
  TRAJETS.forEach(([x, y], i) => {
    attrs(q(svg, `[data-res="${i}"]`), { x1: dx(x), y1: dy(y), x2: dx(x), y2: dy(f(x)) });
    s += (f(x) - y) ** 2;
  });
  const mse = s / TRAJETS.length;
  texte(svg, '[data-t1]', `prix = ${fr(e.w, 0)} × distance + ${fr(e.b, 0)}`);
  texte(svg, '[data-t2]', `erreur quadratique moyenne : ${fr(mse, 0)}`);
  scene.setAttribute('aria-label', `Droite prix = ${fr(e.w, 0)} fois la distance plus ${fr(e.b, 0)}. Erreur quadratique moyenne ${fr(mse, 0)}.`);
}
