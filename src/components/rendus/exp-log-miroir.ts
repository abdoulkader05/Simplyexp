// Fiche « exp-log » : exp et ln sont symétriques par rapport à la droite y = x.
// Le point (a ; eᵃ) sur exp a pour miroir (eᵃ ; a) sur ln.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, repere, points } from '../animations/svg';

export const fiche = 'exp-log';
const R = repere(120, 150, 32);

export const etats: Record<string, Etat> = { initial: { a: 1 } };

function gabarit() {
  const ex: [number, number][] = [], ln: [number, number][] = [];
  for (let x = -3.5; x <= 1.9; x += 0.05) ex.push([R.x(x), R.y(Math.exp(x))]);
  for (let x = 0.03; x <= 6.5; x += 0.03) ln.push([R.x(x), R.y(Math.log(x))]);
  return `
    <defs><clipPath id="el-cadre"><rect x="4" y="4" width="332" height="206" /></clipPath></defs>
    <g clip-path="url(#el-cadre)">
      ${R.axes(200)}
      <line x1="${R.x(-3.5)}" y1="${R.y(-3.5)}" x2="${R.x(6.5)}" y2="${R.y(6.5)}" class="svg-trait-doux svg-pointille" />
      <polyline points="${points(ex)}" class="svg-ligne svg-trait-sortie" stroke-width="2.5" />
      <polyline points="${points(ln)}" class="svg-ligne svg-trait-entree" stroke-width="2.5" />
      <line data-lien class="svg-trait-doux" stroke-dasharray="2 3" />
    </g>
    <circle data-pe r="5" class="svg-sortie" /><circle data-pl r="5" class="svg-entree" />
    <text x="${R.x(1.3)}" y="${R.y(4.4)}" class="svg-sortie" font-size="13" font-weight="600">eˣ</text>
    <text x="${R.x(5.2)}" y="${R.y(1.3)}" class="svg-entree" font-size="13" font-weight="600">ln x</text>
    <text x="${R.x(4.6)}" y="${R.y(4.1)}" class="svg-doux" font-size="10">y = x</text>
    <text x="4" y="232" class="svg-sortie" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-entree" font-size="13" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const a = e.a, b = Math.exp(a);
  attrs(q(svg, '[data-pe]'), { cx: R.x(a), cy: R.y(b) });
  attrs(q(svg, '[data-pl]'), { cx: R.x(b), cy: R.y(a) });
  attrs(q(svg, '[data-lien]'), { x1: R.x(a), y1: R.y(b), x2: R.x(b), y2: R.y(a) });
  texte(svg, '[data-t1]', `exp(${fr(a, 2, 1)}) = ${fr(b, 3)}`);
  texte(svg, '[data-t2]', `ln(${fr(b, 3)}) = ${fr(a, 2, 1)}`);
  scene.setAttribute('aria-label', `L'exponentielle de ${fr(a, 2, 1)} vaut ${fr(b, 3)}, et le logarithme de ${fr(b, 3)} vaut ${fr(a, 2, 1)}.`);
}
