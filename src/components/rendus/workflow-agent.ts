// Fiche « agent-llm » : schéma statique. En haut, un workflow (chemin fixé par le code) ;
// en bas, un agent (le modèle choisit l'étape suivante et décide quand s'arrêter).
import type { Etat } from '../animations/types';
import { svgDe, fleche, q } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: { k: 0 } };

function boite(x: number, y: number, l: number, t: string, classe = 'svg-entree') {
  return `<rect x="${x}" y="${y}" width="${l}" height="30" rx="5" class="${classe}" opacity="0.2" />
    <text x="${x + l / 2}" y="${y + 19}" text-anchor="middle" class="svg-texte" font-size="11">${t}</text>`;
}

function gabarit() {
  return `
    <text x="4" y="14" class="svg-texte" font-size="12" font-weight="700">Workflow : le code fixe le chemin</text>
    ${boite(4, 24, 72, 'extraire')}${boite(92, 24, 72, 'résumer')}${boite(180, 24, 72, 'traduire')}${boite(268, 24, 68, 'envoyer')}
    <g data-w1></g><g data-w2></g><g data-w3></g>
    <text x="4" y="76" class="svg-doux" font-size="10">toujours les mêmes étapes, dans le même ordre</text>
    <line x1="0" y1="92" x2="340" y2="92" class="svg-trait" />
    <text x="4" y="112" class="svg-texte" font-size="12" font-weight="700">Agent : le modèle choisit la suite</text>
    ${boite(120, 128, 100, 'LLM', 'svg-sortie')}
    ${boite(4, 190, 76, 'recherche')}${boite(92, 190, 76, 'calcul')}${boite(180, 190, 76, 'fichier')}${boite(268, 190, 68, 'réponse')}
    <g data-a1></g><g data-a2></g><g data-a3></g><g data-a4></g>
    <text x="4" y="248" class="svg-doux" font-size="10">à chaque tour : quel outil, avec quoi, ou bien s’arrêter</text>`;
}

export function dessiner(scene: HTMLElement) {
  const svg = svgDe(scene, 340, 262, gabarit);
  fleche(q(svg, '[data-w1]'), 76, 39, 92, 39, 'doux', 1.5);
  fleche(q(svg, '[data-w2]'), 164, 39, 180, 39, 'doux', 1.5);
  fleche(q(svg, '[data-w3]'), 252, 39, 268, 39, 'doux', 1.5);
  // Flèches aller-retour stylisées entre le LLM et chaque outil ; la réponse est la sortie.
  fleche(q(svg, '[data-a1]'), 140, 158, 50, 190, 'parametre', 1.5);
  fleche(q(svg, '[data-a2]'), 160, 158, 130, 190, 'parametre', 1.5);
  fleche(q(svg, '[data-a3]'), 185, 158, 215, 190, 'parametre', 1.5);
  fleche(q(svg, '[data-a4]'), 205, 158, 298, 190, 'sortie', 2.5);
  scene.setAttribute('aria-label', 'En haut, un workflow : extraire, résumer, traduire, envoyer, toujours dans cet ordre. En bas, un agent : le LLM choisit à chaque tour entre recherche, calcul, fichier ou réponse finale.');
}
