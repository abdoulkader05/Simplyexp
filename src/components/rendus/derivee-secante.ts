// Fiche « derivee » : la sécante entre a et a + h devient la tangente quand h tend vers 0.
// f(x) = x² ; en a = 1, la pente de la tangente vaut 2 ; la sécante vaut 2a + h.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, repere, points } from '../animations/svg';

export const fiche = 'derivee';
const R = repere(70, 196, 42);
const f = (x: number) => x * x;

export const etats: Record<string, Etat> = { initial: { a: 1, h: 1 } };

function gabarit() {
  const c: [number, number][] = [];
  for (let x = -1.5; x <= 2.35; x += 0.03) c.push([R.x(x), R.y(f(x))]);
  return `
    <defs><clipPath id="ds-cadre"><rect x="4" y="4" width="332" height="206" /></clipPath></defs>
    <g clip-path="url(#ds-cadre)">
      ${R.axes(260)}
      <polyline points="${points(c)}" class="svg-ligne svg-trait-entree" stroke-width="2.5" />
      <line data-tangente class="svg-trait-doux" stroke-width="1.5" stroke-dasharray="5 4" />
      <line data-secante class="svg-trait-sortie" stroke-width="2.5" />
    </g>
    <circle data-pa r="5" class="svg-encre" /><circle data-pb r="5" class="svg-sortie" />
    <text x="336" y="20" text-anchor="end" class="svg-doux" font-size="11">f(x) = x² ; pointillés : la tangente</text>
    <text x="4" y="232" class="svg-sortie" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const a = e.a, h = e.h, b = a + h;
  const pente = (f(b) - f(a)) / h, tang = 2 * a;
  const ligne = (s: number) => ({ x1: R.x(a - 3), y1: R.y(f(a) - 3 * s), x2: R.x(a + 3), y2: R.y(f(a) + 3 * s) });
  attrs(q(svg, '[data-secante]'), ligne(pente));
  attrs(q(svg, '[data-tangente]'), ligne(tang));
  attrs(q(svg, '[data-pa]'), { cx: R.x(a), cy: R.y(f(a)) });
  attrs(q(svg, '[data-pb]'), { cx: R.x(b), cy: R.y(f(b)) });
  texte(svg, '[data-t1]', `pente de la sécante (h = ${fr(h, 2)}) : ${fr(pente, 3)}`);
  texte(svg, '[data-t2]', `pente de la tangente en a = ${fr(a, 2)} : f′(a) = 2a = ${fr(tang, 2)}`);
  scene.setAttribute('aria-label', `Sécante entre ${fr(a, 2)} et ${fr(b, 2)} de pente ${fr(pente, 3)} ; la dérivée en ${fr(a, 2)} vaut ${fr(tang, 2)}.`);
}
