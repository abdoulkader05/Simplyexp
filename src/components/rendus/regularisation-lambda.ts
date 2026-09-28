// Fiche « regularisation » : polynôme de degré 9 sur les 10 comptages, avec une pénalité L2 λ‖w‖².
// λ presque nul : surapprentissage (erreur test ≈ 48) ; λ = 0,001 : erreur test ≈ 1,79 ; λ = 1 : trop raide.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';
import { TRAIN, TEST, vraie, ajuster } from '../animations/polynome';

export const fiche = 'regularisation';
const px = (h: number) => 16 + ((h - 6) / 12) * 196;
const py = (y: number) => 196 - (Math.max(-1, Math.min(11, y)) / 11) * 176;
// Barres des |coefficients| w₁ … w₉ en échelle logarithmique, de 0,01 à 1 000.
const bh = (v: number) => Math.max(0, Math.min(1, (Math.log10(Math.max(v, 0.01)) + 2) / 5)) * 150;

export const etats: Record<string, Etat> = { initial: { log: -3 } };

function gabarit() {
  const vrai: [number, number][] = [];
  for (let h = 6; h <= 18; h += 0.1) vrai.push([px(h), py(vraie(h))]);
  return `
    <defs><clipPath id="rg-cadre"><rect x="10" y="10" width="208" height="192" /></clipPath></defs>
    <line x1="${px(6)}" y1="${py(0)}" x2="${px(18)}" y2="${py(0)}" class="svg-trait-doux" />
    <g clip-path="url(#rg-cadre)">
      <polyline points="${points(vrai)}" class="svg-ligne svg-trait-doux svg-pointille" stroke-width="1.5" />
      <polyline data-modele class="svg-ligne svg-trait-parametre" stroke-width="2.5" />
    </g>
    ${TEST.map(([h, y]) => `<circle cx="${px(h)}" cy="${py(y)}" r="3" fill="none" class="svg-trait-doux" stroke-width="1.2" />`).join('')}
    ${TRAIN.map(([h, y]) => `<circle cx="${px(h)}" cy="${py(y)}" r="4.5" class="svg-entree" />`).join('')}
    <text x="230" y="14" class="svg-doux" font-size="10">|w₁| … |w₉|</text>
    <line x1="230" y1="196" x2="334" y2="196" class="svg-trait-doux" />
    ${[0.01, 1, 100].map((v) => `<text x="336" y="${196 - bh(v) + 3}" text-anchor="end" class="svg-doux" font-size="8">${fr(v, 2, 0)}</text>`).join('')}
    ${Array.from({ length: 9 }, (_, k) => `<rect data-w="${k}" x="${228 + k * 9}" width="6" rx="1" class="svg-parametre" />`).join('')}
    <text x="4" y="232" class="svg-parametre" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const lambda = 10 ** e.log;
  const m = ajuster(9, lambda);
  const courbe: [number, number][] = [];
  for (let h = 6; h <= 18; h += 0.05) courbe.push([px(h), py(m.f(h))]);
  attrs(q(svg, '[data-modele]'), { points: points(courbe) });
  m.coef.slice(1).forEach((c, k) => { const hgt = bh(Math.abs(c)); attrs(q(svg, `[data-w="${k}"]`), { y: 196 - hgt, height: hgt }); });
  const exposant = fr(e.log, 1, 0).replace(/[−,\d]/g, (ch) => ({ '−': '⁻', ',': '·' } as Record<string, string>)[ch] ?? '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(ch)]);
  const lam = lambda < 1e-5 ? `10${exposant}` : fr(lambda, 4, 0);
  const somme = m.coef.slice(1).reduce((s, c) => s + c * c, 0);
  texte(svg, '[data-t1]', `λ = ${lam} ; ‖w‖² = ${somme < 1e4 ? fr(somme, 1) : fr(somme, 0)}`);
  texte(svg, '[data-t2]', `erreur entraînement ${fr(m.train, 2)} ; erreur test ${fr(m.test, 2)}`);
  scene.setAttribute('aria-label', `Pénalité lambda ${lam} : erreur d'entraînement ${fr(m.train, 2)}, erreur de test ${fr(m.test, 2)}.`);
}
