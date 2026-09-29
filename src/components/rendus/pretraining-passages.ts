// Fiche « pretraining » : schéma statique. Pour chaque source de GPT-3 (tableau 2.2 de Brown et al. 2020) :
// tokens disponibles et nombre de passages = poids × 300 milliards / tokens disponibles.
import type { Etat } from '../animations/types';
import { svgDe } from '../animations/svg';
import { fr } from '../animations/format';

export const etats: Record<string, Etat> = { initial: {} };
const SOURCES = [
  ['Common Crawl', 410, 0.6], ['WebText2', 19, 0.22], ['Books1', 12, 0.08], ['Books2', 55, 0.08], ['Wikipédia', 3, 0.03],
] as const;

function gabarit() {
  const lignes = SOURCES.map(([n, t, w], i) => {
    const y = 44 + i * 32;
    const passages = (w * 300) / t;
    return `<text x="4" y="${y + 13}" class="svg-texte" font-size="11">${n}</text>
      <text x="126" y="${y + 13}" text-anchor="end" class="svg-doux" font-size="10.5">${t} Md</text>
      <rect x="136" y="${y}" width="${Math.min(160, 46 * passages)}" height="18" rx="3" class="${passages >= 1 ? 'svg-sortie' : 'svg-entree'}" fill-opacity="${passages >= 1 ? 1 : 0.5}" />
      <text x="336" y="${y + 13}" text-anchor="end" class="svg-texte" font-size="11" font-weight="700">${fr(passages, passages < 1 ? 2 : 1)}×</text>`;
  }).join('');
  return `<text x="4" y="16" class="svg-texte" font-size="12" font-weight="700">Combien de fois chaque source est lue</text>
    <text x="126" y="34" text-anchor="end" class="svg-doux" font-size="9.5">tokens</text>
    <text x="136" y="34" class="svg-doux" font-size="9.5">passages sur 300 Md de tokens vus</text>
    <line x1="182" y1="40" x2="182" y2="206" class="svg-trait-doux svg-pointille" stroke-width="1" />
    <text x="186" y="216" class="svg-doux" font-size="9">1 passage</text>
    ${lignes}
    <text x="4" y="240" class="svg-doux" font-size="10.5">Wikipédia : 3 passages ; le web filtré : moins d’un demi</text>`;
}

export function dessiner(scene: HTMLElement) {
  svgDe(scene, 340, 262, gabarit);
  scene.setAttribute('aria-label', 'Passages par source pendant le pré-entraînement de GPT-3 : Common Crawl 0,44 fois, WebText2 3,5 fois, Books1 2 fois, Books2 0,44 fois, Wikipédia 3 fois.');
}
