// Fiche « lora » : schéma statique du passage avant. x traverse W₀ (gelée) et, en parallèle, A puis B ;
// les deux sorties s'additionnent.
import type { Etat } from '../animations/types';
import { svgDe, q, fleche } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: { k: 0 } };

function gabarit() {
  return `
    <rect x="4" y="100" width="44" height="32" rx="6" class="svg-entree" fill-opacity="0.2" />
    <text x="26" y="121" text-anchor="middle" class="svg-texte" font-size="13" font-weight="700">x</text>
    <rect x="96" y="30" width="120" height="52" rx="6" class="svg-entree" fill-opacity="0.2" />
    <text x="156" y="52" text-anchor="middle" class="svg-texte" font-size="12" font-weight="700">W₀ (d × k)</text>
    <text x="156" y="70" text-anchor="middle" class="svg-doux" font-size="10">gelée</text>
    <rect x="96" y="148" width="50" height="40" rx="6" class="svg-sortie" fill-opacity="0.9" />
    <text x="121" y="167" text-anchor="middle" class="svg-texte" font-size="12" font-weight="700">A</text>
    <text x="121" y="181" text-anchor="middle" class="svg-texte" font-size="9">r × k</text>
    <rect x="166" y="148" width="50" height="40" rx="6" class="svg-sortie" fill-opacity="0.9" />
    <text x="191" y="167" text-anchor="middle" class="svg-texte" font-size="12" font-weight="700">B</text>
    <text x="191" y="181" text-anchor="middle" class="svg-texte" font-size="9">d × r</text>
    <text x="156" y="206" text-anchor="middle" class="svg-doux" font-size="10">entraînées, r petit</text>
    <circle cx="262" cy="116" r="14" class="svg-fond-sortie" />
    <text x="262" y="121" text-anchor="middle" class="svg-texte" font-size="15" font-weight="700">+</text>
    <rect x="296" y="100" width="40" height="32" rx="6" class="svg-parametre" fill-opacity="0.25" />
    <text x="316" y="121" text-anchor="middle" class="svg-texte" font-size="13" font-weight="700">h</text>
    <g data-f1></g><g data-f2></g><g data-f3></g><g data-f4></g><g data-f5></g><g data-f6></g>
    <text x="4" y="236" class="svg-texte" font-size="12" font-weight="700">h = W₀x + BAx</text>
    <text x="4" y="252" class="svg-doux" font-size="10.5">B part de zéro : au début, le modèle est inchangé</text>`;
}

export function dessiner(scene: HTMLElement) {
  const svg = svgDe(scene, 340, 262, gabarit);
  fleche(q(svg, '[data-f1]'), 48, 110, 96, 62, 'doux', 1.5);
  fleche(q(svg, '[data-f2]'), 48, 124, 96, 166, 'sortie', 1.5);
  fleche(q(svg, '[data-f3]'), 146, 168, 166, 168, 'sortie', 1.5);
  fleche(q(svg, '[data-f4]'), 216, 56, 250, 106, 'doux', 1.5);
  fleche(q(svg, '[data-f5]'), 216, 166, 250, 126, 'sortie', 1.5);
  fleche(q(svg, '[data-f6]'), 276, 116, 296, 116, 'doux', 1.5);
  scene.setAttribute('aria-label', 'L’entrée x passe par W₀, gelée, et en parallèle par A puis B, entraînées. Les deux résultats s’additionnent : h = W₀x + BAx.');
}
