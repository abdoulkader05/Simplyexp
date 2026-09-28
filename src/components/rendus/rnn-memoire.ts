// Fiche « rnn » : RNN à un seul nombre, h_t = tanh(0,5 · h_{t−1} + x_t), entrées 1, 0, 0, 0.
// h = 0,762 ; 0,363 ; 0,180 ; 0,090 : le souvenir de la première entrée s'efface.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'rnn';
export const X = [1, 0, 0, 0];
export const H = X.reduce<number[]>((acc, x) => [...acc, Math.tanh(0.5 * (acc.at(-1) ?? 0) + x)], []);
const cx = (i: number) => 46 + i * 82;

export const etats: Record<string, Etat> = Object.fromEntries([0, 1, 2, 3, 4].map((k) => [k ? `t${k}` : 'initial', { k }]));

function gabarit() {
  let s = '';
  X.forEach((x, i) => {
    s += `<g data-c="${i}">
      <rect x="${cx(i) - 30}" y="96" width="60" height="42" rx="6" class="svg-trait" fill="none" stroke-width="2" />
      <text x="${cx(i)}" y="112" text-anchor="middle" class="svg-doux" font-size="10">h${'₁₂₃₄'[i]}</text>
      <text x="${cx(i)}" y="130" text-anchor="middle" class="svg-texte" font-size="13" font-weight="700" data-h></text>
      <rect x="${cx(i) - 9}" y="40" width="18" height="48" rx="2" class="svg-trait" fill="none" />
      <rect x="${cx(i) - 9}" y="88" width="18" height="0" rx="2" class="svg-sortie" data-barre />
      <circle cx="${cx(i)}" cy="182" r="14" class="svg-entree" opacity=".18" />
      <text x="${cx(i)}" y="187" text-anchor="middle" class="svg-texte" font-size="12">${x}</text>
      <line x1="${cx(i)}" y1="167" x2="${cx(i)}" y2="140" class="svg-trait-entree" stroke-width="2" />
      <text x="${cx(i)}" y="212" text-anchor="middle" class="svg-doux" font-size="10">x${'₁₂₃₄'[i]}</text>
    </g>`;
    if (i < 3) s += `<line x1="${cx(i) + 30}" y1="117" x2="${cx(i + 1) - 33}" y2="117" class="svg-trait-parametre" stroke-width="2" data-l="${i}" />
      <text x="${(cx(i) + cx(i + 1)) / 2}" y="110" text-anchor="middle" class="svg-doux" font-size="9">×0,5</text>`;
  });
  return s + `<text x="4" y="30" class="svg-doux" font-size="10">mémoire |h| gardée à chaque pas</text>
    <text x="4" y="236" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="254" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(4, Math.round(e.k)));
  X.forEach((_, i) => {
    const g = q(svg, `[data-c="${i}"]`);
    const fait = i < k;
    g.setAttribute('opacity', fait || i === k ? '1' : '0.35');
    q(g, '[data-h]').textContent = fait ? fr(H[i], 3) : '?';
    const haut = fait ? 48 * Math.abs(H[i]) : 0;
    const b = q(g, '[data-barre]');
    b.setAttribute('y', String(88 - haut));
    b.setAttribute('height', String(haut));
  });
  const T = k === 0
    ? ['le même calcul à chaque pas : h = tanh(0,5 · h précédent + x)', 'le premier mot envoie un signal (x = 1), les suivants rien']
    : [`pas ${k} : h${'₁₂₃₄'[k - 1]} = ${fr(H[k - 1], 3)}`,
      k === 1 ? 'tanh(0,5 × 0 + 1) = 0,762' : `tanh(0,5 × ${fr(H[k - 2], 3)} + 0) : le souvenir s’efface`];
  texte(svg, '[data-t1]', T[0]);
  texte(svg, '[data-t2]', T[1]);
  scene.setAttribute('aria-label', `${T[0]}. ${T[1]}.`);
}
