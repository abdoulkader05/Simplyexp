// Fiche « chain-of-thought » : schéma statique du vote entre cinq raisonnements tirés au hasard.
import type { Etat } from '../animations/types';
import { svgDe, q, fleche } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: { k: 0 } };

const CHEMINS = [
  ['18 − 6 = 12, + 12 = 24, / 2 = 12', '12'],
  ['18 + 12 = 30, − 6 = 24, / 2 = 12', '12'],
  ['18 − 6 + 12 = 24… puis − 9 = 15', '15'],
  ['12 + 12 = 24, moitié : 12', '12'],
  ['18 / 2 = 9', '9'],
];

function gabarit() {
  return `
    <text x="4" y="14" class="svg-doux" font-size="10">5 raisonnements tirés avec une température &gt; 0</text>
    ${CHEMINS.map(([c, r], i) => `
      <rect x="0" y="${22 + i * 30}" width="212" height="24" rx="4" class="svg-entree" fill-opacity="0.1" />
      <text x="6" y="${38 + i * 30}" class="svg-texte" font-size="9.5" style="font-family: var(--police-code)">${c}</text>
      <rect x="220" y="${22 + i * 30}" width="32" height="24" rx="4" class="${r === '12' ? 'svg-fond-sortie' : 'svg-perte'}" fill-opacity="${r === '12' ? 1 : 0.15}" />
      <text x="236" y="${38 + i * 30}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="700">${r}</text>`).join('')}
    <g data-f></g>
    <rect x="272" y="84" width="66" height="60" rx="6" class="svg-fond-sortie" />
    <text x="305" y="104" text-anchor="middle" class="svg-doux" font-size="10">vote</text>
    <text x="305" y="124" text-anchor="middle" class="svg-texte" font-size="16" font-weight="700">12</text>
    <text x="305" y="139" text-anchor="middle" class="svg-doux" font-size="9">3 voix sur 5</text>
    <text x="4" y="192" class="svg-texte" font-size="12" font-weight="700">On garde la réponse la plus fréquente</text>
    <text x="4" y="210" class="svg-doux" font-size="10.5">les raisonnements diffèrent ; les erreurs, elles,</text>
    <text x="4" y="225" class="svg-doux" font-size="10.5">se dispersent sur des réponses différentes</text>`;
}

export function dessiner(scene: HTMLElement) {
  const svg = svgDe(scene, 340, 262, gabarit);
  fleche(q(svg, '[data-f]'), 256, 114, 270, 114, 'doux', 1.5);
  scene.setAttribute('aria-label', 'Cinq raisonnements donnent 12, 12, 15, 12 et 9. Le vote garde 12, avec 3 voix sur 5.');
}
