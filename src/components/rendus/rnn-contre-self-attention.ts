// Fiche « self-attention » : schéma statique. En haut, un RNN transmet l'information de proche en
// proche (du mot 1 au mot 5 : 4 étapes) ; en bas, la self-attention relie chaque paire en une étape.
import type { Etat } from '../animations/types';
import { svgDe, q, fleche } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: { k: 0 } };

const MOTS = ['Le', 'chat', 'que', 'tu', 'vois'];
const X = (i: number) => 34 + i * 68;

function mots(y: number) {
  return MOTS.map((m, i) => `<rect x="${X(i) - 26}" y="${y}" width="52" height="26" rx="5" class="svg-entree" fill-opacity="0.18" />
    <text x="${X(i)}" y="${y + 17}" text-anchor="middle" class="svg-texte" font-size="12">${m}</text>`).join('');
}

function gabarit() {
  // Arcs de la self-attention : toutes les paires, au-dessus de la rangée du bas.
  let arcs = '';
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
    const h = 14 + (j - i) * 12;
    const fort = i === 0 && j === 4;
    arcs += `<path d="M${X(i)},170 C${X(i)},${170 - h} ${X(j)},${170 - h} ${X(j)},170" class="svg-ligne ${fort ? 'svg-trait-sortie' : 'svg-trait-parametre'}" stroke-width="${fort ? 2.5 : 1.2}" fill="none" opacity="${fort ? 1 : 0.55}" />`;
  }
  return `
    <text x="4" y="14" class="svg-texte" font-size="12" font-weight="700">RNN : l’information passe de proche en proche</text>
    ${mots(26)}
    <g data-r0></g><g data-r1></g><g data-r2></g><g data-r3></g>
    <rect x="80" y="60" width="180" height="15" rx="3" style="fill: var(--papier-2)" />
    <text x="170" y="71" text-anchor="middle" class="svg-perte" font-size="10.5">de « Le » à « vois » : 4 étapes</text>
    <line x1="0" y1="92" x2="340" y2="92" class="svg-trait" />
    <text x="4" y="110" class="svg-texte" font-size="12" font-weight="700">Self-attention : chaque paire est reliée</text>
    ${arcs}
    ${mots(170)}
    <text x="170" y="220" text-anchor="middle" class="svg-sortie" font-size="10.5" style="fill: var(--encre)">de « Le » à « vois » : 1 étape</text>
    <text x="4" y="244" class="svg-doux" font-size="10.5">5 mots → 10 paires ; et toutes se calculent en même temps</text>`;
}

export function dessiner(scene: HTMLElement) {
  const svg = svgDe(scene, 340, 262, gabarit);
  for (let i = 0; i < 4; i++) fleche(q(svg, `[data-r${i}]`), X(i) + 27, 39, X(i + 1) - 27, 39, 'perte', 2);
  scene.setAttribute('aria-label', 'En haut, un RNN : l’information du premier mot doit traverser quatre étapes pour atteindre le cinquième. En bas, la self-attention relie directement chaque paire de mots : dix paires pour cinq mots, calculées en même temps.');
}
