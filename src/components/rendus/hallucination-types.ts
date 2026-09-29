// Fiche « hallucinations » : schéma statique. Une source, deux résumés fautifs :
// hallucination intrinsèque (contredit la source) et extrinsèque (invérifiable à partir de la source), d'après Ji et al. 2022.
import type { Etat } from '../animations/types';
import { svgDe, fleche, q } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: {} };

function gabarit() {
  return `<rect x="20" y="6" width="300" height="44" rx="6" class="svg-entree svg-trait-entree" fill-opacity="0.15" stroke-width="1.5" />
    <text x="170" y="22" text-anchor="middle" class="svg-doux" font-size="9.5">source</text>
    <text x="170" y="40" text-anchor="middle" class="svg-texte" font-size="11">« Le marché ouvre à 7 h, du lundi au samedi. »</text>
    <g data-f1></g><g data-f2></g>
    <rect x="4" y="88" width="160" height="96" rx="6" class="svg-perte" fill-opacity="0.12" />
    <text x="84" y="106" text-anchor="middle" class="svg-texte" font-size="11.5" font-weight="700">intrinsèque</text>
    <text x="84" y="124" text-anchor="middle" class="svg-doux" font-size="9.5">contredit la source</text>
    <text x="84" y="150" text-anchor="middle" class="svg-texte" font-size="10.5">« Le marché ouvre</text>
    <text x="84" y="166" text-anchor="middle" class="svg-texte" font-size="10.5">à 8 h. »</text>
    <rect x="176" y="88" width="160" height="96" rx="6" class="svg-sortie" fill-opacity="0.2" />
    <text x="256" y="106" text-anchor="middle" class="svg-texte" font-size="11.5" font-weight="700">extrinsèque</text>
    <text x="256" y="124" text-anchor="middle" class="svg-doux" font-size="9.5">invérifiable par la source</text>
    <text x="256" y="150" text-anchor="middle" class="svg-texte" font-size="10.5">« C’est le plus grand</text>
    <text x="256" y="166" text-anchor="middle" class="svg-texte" font-size="10.5">marché de la ville. »</text>
    <text x="4" y="214" class="svg-texte" font-size="11.5" font-weight="700">Deux façons de s’écarter d’une source</text>
    <text x="4" y="232" class="svg-doux" font-size="10">vraie ou non, la seconde n’est pas fondée sur la source</text>`;
}

export function dessiner(scene: HTMLElement) {
  const svg = svgDe(scene, 340, 262, gabarit);
  fleche(q(svg, '[data-f1]'), 130, 52, 90, 86, 'doux', 1.5);
  fleche(q(svg, '[data-f2]'), 210, 52, 250, 86, 'doux', 1.5);
  scene.setAttribute('aria-label', 'Source : le marché ouvre à 7 h, du lundi au samedi. Hallucination intrinsèque, qui contredit la source : le marché ouvre à 8 h. Hallucination extrinsèque, invérifiable par la source : c’est le plus grand marché de la ville.');
}
