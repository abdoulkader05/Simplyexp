// Fiche « mlp » : le réseau qui calcule XOR (Deep Learning, section 6.1).
// h = ReLU(W x + c) avec W = [[1, 1], [1, 1]], c = (0 ; −1) ; y = w · h + b avec w = (1 ; −2), b = 0.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'mlp';
const X: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
const XOR = [0, 1, 1, 0];
const lin = X.map(([a, b]) => [a + b, a + b - 1]);
const relu = lin.map(([u, v]) => [Math.max(0, u), Math.max(0, v)]);
const Y = relu.map(([u, v]) => u - 2 * v);

const px = (u: number) => 70 + u * 80;
const py = (v: number) => 150 - v * 80;

// t va de 0 (entrées) à 1 (W x + c) puis 2 (ReLU) ; s (0 ou 1) affiche la sortie.
export const etats: Record<string, Etat> = {
  initial: { t: 0, s: 0 }, lineaire: { t: 1, s: 0 }, relu: { t: 2, s: 0 }, sortie: { t: 2, s: 1 },
};

function gabarit() {
  return `
    <line x1="${px(-0.5)}" y1="${py(0)}" x2="${px(2.5)}" y2="${py(0)}" class="svg-trait-doux" />
    <line x1="${px(0)}" y1="${py(-1.3)}" x2="${px(0)}" y2="${py(1.6)}" class="svg-trait-doux" />
    <text data-axe1 x="${px(2.5)}" y="${py(0) + 14}" text-anchor="end" class="svg-doux" font-size="10"></text>
    <text data-axe2 x="${px(0) + 4}" y="${py(1.6) + 8}" class="svg-doux" font-size="10"></text>
    <line data-sep class="svg-trait-sortie" stroke-width="2" stroke-dasharray="5 4" />
    ${X.map((_, i) => `<circle data-p="${i}" r="7" class="${XOR[i] ? 'svg-sortie' : 'svg-entree'}" />
      <text data-l="${i}" class="svg-texte" font-size="11"></text>`).join('')}
    <text x="4" y="16" class="svg-doux" font-size="10">doré : XOR = 1 ; bleu : XOR = 0</text>
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const pos = X.map((x, i) => {
    const a = e.t <= 1 ? x : lin[i], b = e.t <= 1 ? lin[i] : relu[i], k = e.t <= 1 ? e.t : e.t - 1;
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  });
  pos.forEach(([u, v], i) => {
    attrs(q(svg, `[data-p="${i}"]`), { cx: px(u), cy: py(v) });
    const l = q(svg, `[data-l="${i}"]`);
    attrs(l, { x: px(u) + 10, y: py(v) - 8 + (i === 2 ? 20 : 0) });
    l.textContent = e.s > 0.5 ? `y = ${fr(Y[i], 0)}` : `(${X[i][0]} ; ${X[i][1]})`;
  });
  const cachee = e.t > 1.5;
  texte(svg, '[data-axe1]', cachee ? 'h₁' : e.t > 0.5 ? 'u₁' : 'x₁');
  texte(svg, '[data-axe2]', cachee ? 'h₂' : e.t > 0.5 ? 'u₂' : 'x₂');
  // Dans l'espace caché, la droite h₁ − 2h₂ = 0,5 sépare les deux classes.
  q(svg, '[data-sep]').style.opacity = String(Math.max(0, e.t - 1.5) * 2);
  attrs(q(svg, '[data-sep]'), { x1: px(0.5), y1: py(0), x2: px(2.5), y2: py(1) });
  const titres = ['Les quatre entrées : aucune droite ne sépare les points dorés des bleus.',
    'Après W x + c : (0 ; 1) et (1 ; 0) tombent au même endroit.',
    'Après ReLU : (0 ; −1) remonte en (0 ; 0). Une droite sépare les classes.',
    'Sortie y = h₁ − 2 h₂ : exactement XOR.'];
  const n = e.s > 0.5 ? 3 : e.t > 1.5 ? 2 : e.t > 0.5 ? 1 : 0;
  texte(svg, '[data-t1]', ['entrées x', 'couche linéaire', 'activation ReLU', 'sortie'][n]);
  texte(svg, '[data-t2]', titres[n]);
  scene.setAttribute('aria-label', titres[n]);
}
