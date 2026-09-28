// Fiche « fonction-perte » : régler le tarif w et voir les écarts et la perte.
// Exemple de la fiche : L(100) = 37 500 ; L(150) = 5 625 ; minimum vers w ≈ 136,7.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';
import { TRAJETS, perte } from '../animations/gbaka';

export const fiche = 'fonction-perte';
// Graphe des données : distance 0..9 km, prix 0..1 300 F.
const dx = (x: number) => 34 + (x / 9) * 160;
const dy = (y: number) => 196 - (y / 1300) * 170;
// Graphe de la perte : w de 50 à 250, L de 0 à 360 000.
const lx = (w: number) => 222 + ((w - 50) / 200) * 112;
const ly = (l: number) => 196 - (l / 360000) * 170;

export const etats: Record<string, Etat> = { initial: { w: 100 } };

function gabarit() {
  const courbe: [number, number][] = [];
  for (let w = 50; w <= 250; w += 4) courbe.push([lx(w), ly(perte(w))]);
  const pts = TRAJETS.map(([x, y]) => `<circle cx="${dx(x)}" cy="${dy(y)}" r="4.5" class="svg-entree" />`).join('');
  const residus = TRAJETS.map((_, i) => `<line data-res="${i}" class="svg-trait-perte" stroke-width="2.5" />`).join('');
  return `
    <line x1="${dx(0)}" y1="${dy(0)}" x2="${dx(9)}" y2="${dy(0)}" class="svg-trait-doux" />
    <line x1="${dx(0)}" y1="${dy(0)}" x2="${dx(0)}" y2="${dy(1300)}" class="svg-trait-doux" />
    <text x="${dx(9)}" y="${dy(0) + 14}" text-anchor="end" class="svg-doux" font-size="10">distance (km)</text>
    <text x="${dx(0) + 4}" y="${dy(1300) - 4}" class="svg-doux" font-size="10">prix (F)</text>
    <line data-droite class="svg-trait-parametre" stroke-width="2.5" />
    ${residus}${pts}
    <line x1="${lx(50)}" y1="${ly(0)}" x2="${lx(250)}" y2="${ly(0)}" class="svg-trait-doux" />
    <polyline points="${points(courbe)}" class="svg-ligne svg-trait-perte" stroke-width="2" />
    <circle data-pl r="5" class="svg-perte" />
    <text x="${lx(250)}" y="${ly(0) + 14}" text-anchor="end" class="svg-doux" font-size="10">w</text>
    <text x="${lx(50)}" y="${ly(360000) - 4}" class="svg-doux" font-size="10">perte L(w)</text>
    <text x="4" y="232" class="svg-parametre" font-size="13" font-weight="600" data-tw></text>
    <text x="4" y="252" class="svg-perte" font-size="14" font-weight="600" data-tl></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const w = e.w;
  attrs(q(svg, '[data-droite]'), { x1: dx(0), y1: dy(0), x2: dx(9), y2: dy(Math.min(1300, w * 9)) });
  if (w * 9 > 1300) attrs(q(svg, '[data-droite]'), { x2: dx(1300 / w), y2: dy(1300) });
  TRAJETS.forEach(([x, y], i) => attrs(q(svg, `[data-res="${i}"]`), { x1: dx(x), y1: dy(y), x2: dx(x), y2: dy(Math.min(1300, w * x)) }));
  const l = perte(w);
  attrs(q(svg, '[data-pl]'), { cx: lx(w), cy: ly(l) });
  texte(svg, '[data-tw]', `tarif w = ${fr(w, 0)} F par km`);
  texte(svg, '[data-tl]', `perte L(w) = ${fr(l, 0)}`);
  scene.setAttribute('aria-label', `Avec un tarif de ${fr(w, 0)} F par kilomètre, la perte quadratique moyenne vaut ${fr(l, 0)}.`);
}
