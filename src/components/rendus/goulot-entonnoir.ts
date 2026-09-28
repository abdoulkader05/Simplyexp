// Fiche « goulot-contexte » : n tokens versés dans un vecteur de 8 cases (RNN linéaire, w = 0,9).
// Poids du premier token dans c : 0,9^(n−1) = 0,656 (n = 5) ; 0,387 (10) ; 0,135 (20) ; 0,016 (40).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'goulot-contexte';
const TAILLES = [5, 10, 20, 40, 20];
const CASES = 8;

export const etats: Record<string, Etat> = { initial: { k: 0 }, n10: { k: 1 }, n20: { k: 2 }, n40: { k: 3 }, attention: { k: 4 } };

function gabarit() {
  return `<text x="4" y="14" class="svg-doux" font-size="10" data-titre></text>
    <g data-tokens></g><g data-liens></g>
    <g data-vecteur></g>
    <text x="4" y="232" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="251" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(4, Math.round(e.k)));
  const n = TAILLES[k], attention = k === 4;
  const pas = 320 / n, cote = Math.min(22, pas - 2);
  const x0 = (i: number) => 10 + i * pas + (pas - cote) / 2;
  q(svg, '[data-tokens]').innerHTML = Array.from({ length: n }, (_, i) => {
    const poids = attention ? 1 : 0.9 ** (n - 1 - i);
    return `<rect x="${x0(i)}" y="30" width="${cote}" height="${cote}" rx="2" class="svg-entree" opacity="${(0.12 + 0.88 * poids).toFixed(2)}" />`;
  }).join('');
  const VX = 170 - (CASES * 18) / 2, VY = 150;
  let liens = '';
  if (attention) {
    for (let i = 0; i < n; i++) liens += `<line x1="${x0(i) + cote / 2}" y1="${32 + cote}" x2="170" y2="${VY - 4}" class="svg-trait-parametre" stroke-width="1" opacity=".55" />`;
  } else {
    liens = `<path d="M 10 ${40 + cote} L ${VX - 4} ${VY - 6} M 330 ${40 + cote} L ${VX + CASES * 18 + 4} ${VY - 6}" class="svg-trait-doux" fill="none" stroke-width="1.5" />`;
  }
  q(svg, '[data-liens]').innerHTML = liens;
  q(svg, '[data-vecteur]').innerHTML = attention
    ? `<rect x="130" y="${VY - 4}" width="80" height="30" rx="5" class="svg-parametre" opacity=".25" />
       <text x="170" y="${VY + 15}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="700">décodeur</text>`
    : Array.from({ length: CASES }, (_, j) => `<rect x="${VX + j * 18}" y="${VY}" width="16" height="22" rx="2" class="svg-sortie" />`).join('')
      + `<text x="170" y="${VY + 40}" text-anchor="middle" class="svg-doux" font-size="10">vecteur de contexte : toujours ${CASES} nombres</text>`;
  texte(svg, '[data-titre]', attention ? `${n} tokens, et leurs ${n} états gardés` : `${n} tokens (plus foncé = plus présent dans c)`);
  const T = attention
    ? ['l’idée suivante : garder tous les états de l’encodeur', 'le décodeur consulte les 20 états, voir la fiche attention']
    : [`${n} tokens → ${CASES} nombres, soit ${fr(CASES / n, 2)} nombre par token`, `poids du premier token dans c : 0,9^${n - 1} ≈ ${fr(0.9 ** (n - 1), 3)}`];
  texte(svg, '[data-t1]', T[0]);
  texte(svg, '[data-t2]', T[1]);
  scene.setAttribute('aria-label', `${T[0]}. ${T[1]}.`);
}
