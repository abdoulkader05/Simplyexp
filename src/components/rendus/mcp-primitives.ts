// Fiche « protocoles-outils » : schéma statique des trois primitives d'un serveur MCP
// et de qui décide de leur usage (spécification MCP 2025-06-18).
import type { Etat } from '../animations/types';
import { svgDe } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: {} };

const COLONNES = [
  { x: 4, titre: 'Prompts', qui: 'l’utilisateur', ex: ['modèles de requête', 'ex. /résumer'], classe: 'entree' },
  { x: 116, titre: 'Ressources', qui: 'l’application', ex: ['données de contexte', 'ex. un fichier joint'], classe: 'parametre' },
  { x: 228, titre: 'Outils', qui: 'le modèle', ex: ['actions exécutables', 'ex. créer un ticket'], classe: 'sortie' },
];

function gabarit() {
  return `
    <rect x="4" y="6" width="332" height="30" rx="6" class="svg-encre svg-trait-encre" fill-opacity="0.06" stroke-width="1.2" />
    <text x="170" y="26" text-anchor="middle" class="svg-texte" font-size="12" font-weight="700">Serveur MCP</text>
    ${COLONNES.map((c) => `
      <line x1="${c.x + 54}" y1="36" x2="${c.x + 54}" y2="56" class="svg-ligne svg-trait-doux" stroke-width="1.5" />
      <rect x="${c.x}" y="56" width="108" height="34" rx="6" class="svg-${c.classe} svg-trait-${c.classe}" fill-opacity="0.2" stroke-width="1.5" />
      <text x="${c.x + 54}" y="78" text-anchor="middle" class="svg-texte" font-size="12" font-weight="700">${c.titre}</text>
      <text x="${c.x + 54}" y="112" text-anchor="middle" class="svg-doux" font-size="10">décidé par</text>
      <text x="${c.x + 54}" y="128" text-anchor="middle" class="svg-texte" font-size="11" font-weight="600">${c.qui}</text>
      <text x="${c.x + 54}" y="156" text-anchor="middle" class="svg-doux" font-size="10">${c.ex[0]}</text>
      <text x="${c.x + 54}" y="172" text-anchor="middle" class="svg-doux" font-size="10">${c.ex[1]}</text>`).join('')}
    <line x1="0" y1="190" x2="340" y2="190" class="svg-trait" />
    <text x="4" y="212" class="svg-texte" font-size="11">Seuls les outils sont choisis par le modèle lui-même :</text>
    <text x="4" y="230" class="svg-texte" font-size="11">ce sont eux qui agissent, et qui demandent le plus</text>
    <text x="4" y="248" class="svg-texte" font-size="11">de garde-fous.</text>`;
}

export function dessiner(scene: HTMLElement) {
  svgDe(scene, 340, 262, gabarit);
  scene.setAttribute('aria-label', 'Un serveur MCP expose trois primitives : les prompts, choisis par l’utilisateur ; les ressources, gérées par l’application ; les outils, choisis par le modèle.');
}
