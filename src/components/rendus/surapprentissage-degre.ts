// Fiche « surapprentissage » : polynôme de degré d ajusté sur 10 points ; erreurs d'entraînement et de test.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';
import { TRAIN, TEST, vraie, ajuster } from '../animations/polynome';

export const fiche = 'surapprentissage';
const px = (h: number) => 16 + ((h - 6) / 12) * 196;
const py = (y: number) => 200 - (Math.max(-1, Math.min(11, y)) / 11) * 180;
const MODELES = Array.from({ length: 10 }, (_, d) => ajuster(d));
// Petit graphe des erreurs : degré 0 à 9, erreur de 0 à 6 (coupée au-delà).
const ex = (d: number) => 232 + d * 11.5;
const ey = (e: number) => 118 - (Math.min(6, e) / 6) * 96;

export const etats: Record<string, Etat> = { initial: { degre: 3 } };

function gabarit() {
  const vrai: [number, number][] = [];
  for (let h = 6; h <= 18; h += 0.1) vrai.push([px(h), py(vraie(h))]);
  return `
    <defs><clipPath id="sa-cadre"><rect x="10" y="14" width="208" height="192" /></clipPath></defs>
    <line x1="${px(6)}" y1="${py(0)}" x2="${px(18)}" y2="${py(0)}" class="svg-trait-doux" />
    ${[6, 12, 18].map((h) => `<text x="${px(h)}" y="${py(0) + 13}" text-anchor="middle" class="svg-doux" font-size="10">${h} h</text>`).join('')}
    <g clip-path="url(#sa-cadre)">
      <polyline points="${points(vrai)}" class="svg-ligne svg-trait-doux svg-pointille" stroke-width="1.5" />
      <polyline data-modele class="svg-ligne svg-trait-parametre" stroke-width="2.5" />
    </g>
    ${TEST.map(([h, y]) => `<circle cx="${px(h)}" cy="${py(y)}" r="3" fill="none" class="svg-trait-doux" stroke-width="1.2" />`).join('')}
    ${TRAIN.map(([h, y]) => `<circle cx="${px(h)}" cy="${py(y)}" r="4.5" class="svg-entree" />`).join('')}
    <text x="232" y="14" class="svg-doux" font-size="10">erreur selon le degré</text>
    <line x1="${ex(0)}" y1="${ey(0)}" x2="${ex(9)}" y2="${ey(0)}" class="svg-trait-doux" />
    <polyline points="${points(MODELES.map((m, d) => [ex(d), ey(m.train)]))}" class="svg-ligne svg-trait-entree" stroke-width="2" />
    <polyline points="${points(MODELES.map((m, d) => [ex(d), ey(m.test)]))}" class="svg-ligne svg-trait-perte" stroke-width="2" />
    <line data-curseur y1="${ey(6)}" y2="${ey(0)}" class="svg-trait-doux" stroke-dasharray="2 2" />
    <text x="232" y="136" class="svg-entree" font-size="10">entraînement</text>
    <text x="232" y="150" class="svg-perte" font-size="10">test</text>
    <text x="4" y="232" class="svg-parametre" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const d = Math.max(0, Math.min(9, Math.round(e.degre)));
  const m = MODELES[d];
  const courbe: [number, number][] = [];
  for (let h = 6; h <= 18; h += 0.05) courbe.push([px(h), py(m.f(h))]);
  attrs(q(svg, '[data-modele]'), { points: points(courbe) });
  attrs(q(svg, '[data-curseur]'), { x1: ex(d), x2: ex(d) });
  texte(svg, '[data-t1]', `polynôme de degré ${d}`);
  texte(svg, '[data-t2]', `erreur entraînement ${fr(m.train, 2)} ; erreur test ${m.test < 1000 ? fr(m.test, 2) : fr(m.test, 0)}`);
  scene.setAttribute('aria-label', `Polynôme de degré ${d} : erreur d'entraînement ${fr(m.train, 2)}, erreur de test ${fr(m.test, 2)}.`);
}
