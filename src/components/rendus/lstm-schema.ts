// Schéma statique : une cellule LSTM, avec la ligne de mémoire c en haut et les quatre calculs de portes en bas.
import type { Etat } from '../animations/types';
import { svgDe } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: {} };

const op = (x: number, y: number, s: string) => `
  <circle cx="${x}" cy="${y}" r="10" class="svg-fond-sortie" />
  <text x="${x}" y="${y + 5}" text-anchor="middle" class="svg-texte" font-size="14" font-weight="700">${s}</text>`;
const boite = (x: number, y: number, s: string, nom: string, c = 'parametre') => `
  <rect x="${x - 20}" y="${y - 13}" width="40" height="26" rx="4" class="svg-${c}" opacity=".9" />
  <text x="${x}" y="${y + 5}" text-anchor="middle" class="svg-texte" font-size="12" font-weight="700" fill-opacity="1" style="fill: var(--papier)">${s}</text>
  <rect x="${x - 25}" y="${y + 19}" width="50" height="12" style="fill: var(--papier-2)" />
  <text x="${x}" y="${y + 28}" text-anchor="middle" class="svg-doux" font-size="9">${nom}</text>`;
const trait = (d: string, c = 'encre', w = 1.8) => `<path d="${d}" fill="none" class="svg-trait-${c} svg-ligne" stroke-width="${w}" />`;

function gabarit() {
  const Y = 44, G = 160;
  return `
    <rect x="30" y="22" width="286" height="172" rx="10" fill="none" class="svg-trait" stroke-width="1.5" />
    ${trait(`M 6 ${Y} L 334 ${Y}`, 'sortie', 3.5)}
    <text x="6" y="${Y - 8}" class="svg-texte" font-size="11">c ancien</text>
    <text x="334" y="${Y - 8}" text-anchor="end" class="svg-texte" font-size="11">c nouveau</text>
    ${trait(`M 6 206 L 250 206`)}
    <text x="6" y="222" class="svg-texte" font-size="10">h précédent, x</text>
    ${trait(`M 90 206 L 90 ${G + 13}`)}${trait(`M 142 206 L 142 ${G + 13}`)}${trait(`M 194 206 L 194 ${G + 13}`)}${trait(`M 250 206 L 250 ${G + 13}`)}
    ${trait(`M 90 ${G - 13} L 90 ${Y + 10}`)}
    ${trait(`M 142 ${G - 13} L 168 ${108 + 10}`)}${trait(`M 194 ${G - 13} L 168 ${108 + 10}`)}
    ${trait(`M 168 ${108 - 10} L 168 ${Y + 10}`)}
    ${trait(`M 280 ${Y} L 280 ${80 - 10}`)}
    ${trait(`M 280 ${80 + 10} L 280 ${120 - 10}`)}
    ${trait(`M 250 ${G - 13} L 272 ${120 + 7}`)}
    ${trait(`M 290 120 L 334 120`, 'entree', 2.5)}
    <text x="334" y="112" text-anchor="end" class="svg-texte" font-size="11">h nouveau</text>
    ${op(90, Y, '×')}${op(168, Y, '+')}${op(168, 108, '×')}${op(280, 120, '×')}
    <rect x="262" y="70" width="36" height="20" rx="4" class="svg-fond-sortie" />
    <text x="280" y="84" text-anchor="middle" class="svg-texte" font-size="10">tanh</text>
    ${boite(90, G, 'σ', 'oubli f')}${boite(142, G, 'σ', 'entrée i')}${boite(194, G, 'tanh', 'candidat c̃', 'entree')}${boite(250, G, 'σ', 'sortie o')}
    <text x="4" y="242" class="svg-texte" font-size="12" font-weight="700">en haut, la mémoire c ne subit que × et + : elle se conserve</text>
    <text x="4" y="258" class="svg-doux" font-size="10.5">trois portes σ (entre 0 et 1) dosent ce qu’on oublie, écrit et montre</text>`;
}

export function dessiner(scene: HTMLElement, _e: Etat) {
  svgDe(scene, 340, 262, gabarit);
}
