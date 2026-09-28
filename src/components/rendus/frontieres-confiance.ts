// Fiche « securite-agents » : schéma statique des frontières de confiance d'un agent.
// À gauche ce qui entre (fiable ou non), au centre l'agent, à droite les actions, avec les garde-fous.
import type { Etat } from '../animations/types';
import { svgDe, q, fleche } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: {} };

function boite(x: number, y: number, l: number, h: number, t: string, classe: string, fo = 0.18) {
  return `<rect x="${x}" y="${y}" width="${l}" height="${h}" rx="5" class="${classe}" fill-opacity="${fo}" />
    <text x="${x + l / 2}" y="${y + h / 2 + 4}" text-anchor="middle" class="svg-texte" font-size="10.5">${t}</text>`;
}

function gabarit() {
  return `
    <text x="4" y="14" class="svg-doux" font-size="10">entrées</text>
    <text x="170" y="14" text-anchor="middle" class="svg-doux" font-size="10">décision</text>
    <text x="336" y="14" text-anchor="end" class="svg-doux" font-size="10">actions</text>
    ${boite(4, 26, 86, 34, 'utilisateur', 'svg-entree')}
    ${boite(4, 84, 86, 34, 'pages web', 'svg-perte')}
    ${boite(4, 126, 86, 34, 'e-mails reçus', 'svg-perte')}
    ${boite(4, 168, 86, 34, 'fichiers', 'svg-perte')}
    ${boite(126, 84, 88, 76, 'LLM', 'svg-sortie', 0.3)}
    ${boite(250, 26, 86, 34, 'lire, chercher', 'svg-parametre')}
    ${boite(250, 84, 86, 34, 'écrire', 'svg-parametre')}
    ${boite(250, 142, 86, 60, '', 'svg-perte')}
    <text x="293" y="159" text-anchor="middle" class="svg-texte" font-size="10.5">envoyer, payer,</text>
    <text x="293" y="172" text-anchor="middle" class="svg-texte" font-size="10.5">supprimer</text>
    <rect x="252" y="181" width="82" height="13" rx="3" style="fill: var(--papier-2)" />
    <text x="293" y="191" text-anchor="middle" class="svg-perte" font-size="9" font-weight="700">confirmation humaine</text>
    <g data-f1></g><g data-f2></g><g data-f3></g><g data-f4></g><g data-f5></g><g data-f6></g><g data-f7></g>
    <line x1="106" y1="72" x2="106" y2="210" class="svg-trait-perte svg-pointille" stroke-width="1.5" />
    <text x="4" y="226" class="svg-texte" font-size="11" font-weight="700">en rouge : ce qui vient d’inconnus, ou ce qui ne se rattrape pas</text>
    <text x="4" y="244" class="svg-doux" font-size="10">les données non fiables ne doivent pas pouvoir déclencher seules</text>
    <text x="4" y="258" class="svg-doux" font-size="10">une action irréversible</text>`;
}

export function dessiner(scene: HTMLElement) {
  const svg = svgDe(scene, 340, 262, gabarit);
  fleche(q(svg, '[data-f1]'), 90, 43, 126, 96, 'entree', 1.8);
  fleche(q(svg, '[data-f2]'), 90, 101, 126, 112, 'perte', 1.5);
  fleche(q(svg, '[data-f3]'), 90, 143, 126, 128, 'perte', 1.5);
  fleche(q(svg, '[data-f4]'), 90, 185, 126, 146, 'perte', 1.5);
  fleche(q(svg, '[data-f5]'), 214, 100, 250, 45, 'parametre', 1.5);
  fleche(q(svg, '[data-f6]'), 214, 116, 250, 101, 'parametre', 1.5);
  fleche(q(svg, '[data-f7]'), 214, 140, 250, 166, 'perte', 1.8);
  scene.setAttribute('aria-label', 'Entrées : l’utilisateur, fiable, et des données non fiables (pages web, e-mails reçus, fichiers) qui entrent toutes dans le LLM. Sorties : lire et écrire, et des actions irréversibles (envoyer, payer, supprimer) soumises à une confirmation humaine.');
}
