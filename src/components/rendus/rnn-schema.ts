// Schéma statique : un RNN replié (une cellule qui boucle) et le même RNN déroulé sur trois pas.
import type { Etat } from '../animations/types';
import { svgDe } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: {} };

const cellule = (x: number, y: number, nom: string) => `
  <rect x="${x - 24}" y="${y - 18}" width="48" height="36" rx="6" class="svg-fond-sortie" />
  <text x="${x}" y="${y + 5}" text-anchor="middle" class="svg-texte" font-size="13" font-weight="700">${nom}</text>`;
const monte = (x: number, y1: number, y2: number, c: string) => `
  <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2 + 6}" class="svg-trait-${c}" stroke-width="2" />
  <polygon points="${x},${y2} ${x - 4},${y2 + 7} ${x + 4},${y2 + 7}" class="svg-${c}" />`;
const droite = (x1: number, x2: number, y: number) => `
  <line x1="${x1}" y1="${y}" x2="${x2 - 6}" y2="${y}" class="svg-trait-parametre" stroke-width="2" />
  <polygon points="${x2},${y} ${x2 - 7},${y - 4} ${x2 - 7},${y + 4}" class="svg-parametre" />`;

function gabarit() {
  const Y = 118;
  let s = `
    <text x="46" y="22" text-anchor="middle" class="svg-doux" font-size="10">replié</text>
    ${cellule(46, Y, 'h')}
    <path d="M 70 ${Y - 8} C 96 ${Y - 40}, 96 ${Y + 40}, 70 ${Y + 8}" fill="none" class="svg-trait-parametre" stroke-width="2" />
    <polygon points="70,${Y + 8} 78,${Y + 4} 77,${Y + 13}" class="svg-parametre" />
    <text x="98" y="${Y + 4}" class="svg-texte" font-size="10">W</text>
    ${monte(46, Y + 58, Y + 18, 'entree')}<text x="46" y="${Y + 72}" text-anchor="middle" class="svg-texte" font-size="11">x</text>
    ${monte(46, Y - 18, Y - 52, 'sortie')}<text x="46" y="${Y - 58}" text-anchor="middle" class="svg-texte" font-size="11">y</text>
    <text x="122" y="${Y + 5}" text-anchor="middle" class="svg-texte" font-size="18">=</text>
    <text x="242" y="22" text-anchor="middle" class="svg-doux" font-size="10">déroulé dans le temps</text>`;
  [0, 1, 2].forEach((i) => {
    const x = 170 + i * 72;
    const n = '₁₂₃'[i];
    s += cellule(x, Y, `h${n}`) + monte(x, Y + 58, Y + 18, 'entree') + monte(x, Y - 18, Y - 52, 'sortie')
      + `<text x="${x}" y="${Y + 72}" text-anchor="middle" class="svg-texte" font-size="11">x${n}</text>`
      + `<text x="${x}" y="${Y - 58}" text-anchor="middle" class="svg-texte" font-size="11">y${n}</text>`;
    if (i < 2) s += droite(x + 24, x + 48, Y) + `<text x="${x + 36}" y="${Y - 6}" text-anchor="middle" class="svg-texte" font-size="10">W</text>`;
  });
  return s + `<text x="4" y="232" class="svg-texte" font-size="12" font-weight="700">une seule cellule, réutilisée à chaque mot</text>
    <text x="4" y="250" class="svg-doux" font-size="11">les mêmes poids W à chaque pas, quelle que soit la longueur</text>`;
}

export function dessiner(scene: HTMLElement, _e: Etat) {
  svgDe(scene, 340, 262, gabarit);
}
