// Fiche « convexite » : la corde reste-t-elle au-dessus de la courbe ?
// Fonction 0 : f(x) = x², corde entre a = −1 et b = 2.
// Fonction 1 : f(x) = x⁴ − 3x² + x, corde entre a = −1,5 et b = 1,5.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';

export const fiche = 'convexite';
const F = [
  { f: (x: number) => x * x, a: -1, b: 2, nom: 'f(x) = x²', ymin: -1, ymax: 5 },
  { f: (x: number) => x ** 4 - 3 * x * x + x, a: -1.5, b: 1.5, nom: 'f(x) = x⁴ − 3x² + x', ymin: -4, ymax: 2.5 },
];
const px = (x: number) => 170 + x * 68;

export const etats: Record<string, Etat> = { initial: { t: 0.5, fonction: 0 } };

function gabarit() {
  return `
    <line data-ax class="svg-trait-doux" />
    <line x1="${px(0)}" y1="14" x2="${px(0)}" y2="206" class="svg-trait-doux" />
    <polyline data-courbe class="svg-ligne svg-trait-entree" stroke-width="2.5" />
    <line data-corde class="svg-trait-doux" stroke-width="2" />
    <line data-ecart stroke-width="3" stroke-linecap="round" />
    <circle data-pa r="4.5" class="svg-encre" /><circle data-pb r="4.5" class="svg-encre" />
    <circle data-pc r="5.5" /><circle data-pf r="5" class="svg-entree" />
    <text x="4" y="16" class="svg-entree" font-size="13" font-weight="600" data-nom></text>
    <text x="4" y="232" class="svg-texte" font-size="13" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="14" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const c = F[Math.round(e.fonction ?? 0)];
  const py = (y: number) => 206 - ((y - c.ymin) / (c.ymax - c.ymin)) * 190;
  const pts: [number, number][] = [];
  for (let x = -2.4; x <= 2.4; x += 0.05) { const y = c.f(x); if (y >= c.ymin - 0.5 && y <= c.ymax + 0.5) pts.push([px(x), py(y)]); }
  attrs(q(svg, '[data-courbe]'), { points: points(pts) });
  attrs(q(svg, '[data-ax]'), { x1: 4, y1: py(0), x2: 336, y2: py(0) });
  const fa = c.f(c.a), fb = c.f(c.b);
  attrs(q(svg, '[data-corde]'), { x1: px(c.a), y1: py(fa), x2: px(c.b), y2: py(fb) });
  attrs(q(svg, '[data-pa]'), { cx: px(c.a), cy: py(fa) });
  attrs(q(svg, '[data-pb]'), { cx: px(c.b), cy: py(fb) });
  // t = 0 donne a, t = 1 donne b.
  const x = (1 - e.t) * c.a + e.t * c.b;
  const corde = (1 - e.t) * fa + e.t * fb, courbe = c.f(x);
  const ok = courbe <= corde + 1e-9;
  attrs(q(svg, '[data-pc]'), { cx: px(x), cy: py(corde), class: ok ? 'svg-sortie' : 'svg-perte' });
  attrs(q(svg, '[data-pf]'), { cx: px(x), cy: py(courbe) });
  attrs(q(svg, '[data-ecart]'), { x1: px(x), y1: py(corde), x2: px(x), y2: py(courbe), class: ok ? 'svg-trait-sortie' : 'svg-trait-perte' });
  texte(svg, '[data-nom]', c.nom);
  texte(svg, '[data-t1]', `x = ${fr(x)} ; courbe ${fr(courbe)} ; corde ${fr(corde)}`);
  texte(svg, '[data-t2]', ok ? 'la corde est au-dessus de la courbe' : 'la courbe passe au-dessus de la corde');
  scene.setAttribute('aria-label', `${c.nom}. En x = ${fr(x)}, la courbe vaut ${fr(courbe)} et la corde ${fr(corde)} : ${ok ? 'la corde est au-dessus' : 'la courbe passe au-dessus, la fonction n’est pas convexe'}.`);
}
