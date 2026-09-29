// Fiche « rag » : schéma statique des deux phases. En haut, l'indexation (une fois) ;
// en bas, chaque question (à chaque requête).
import type { Etat } from '../animations/types';
import { svgDe, q, fleche } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: { k: 0 } };

function boite(x: number, y: number, l: number, t: string, classe = 'svg-entree', op = 0.16) {
  return `<rect x="${x}" y="${y}" width="${l}" height="30" rx="5" class="${classe}" fill-opacity="${op}" />
    <text x="${x + l / 2}" y="${y + 19}" text-anchor="middle" class="svg-texte" font-size="10.5">${t}</text>`;
}

function gabarit() {
  return `
    <text x="4" y="14" class="svg-texte" font-size="11.5" font-weight="700">1. Indexer, une fois</text>
    ${boite(0, 24, 72, 'documents')}${boite(88, 24, 72, 'passages')}${boite(176, 24, 76, 'embeddings')}${boite(268, 24, 72, 'index', 'svg-parametre', 0.25)}
    <g data-a1></g><g data-a2></g><g data-a3></g>
    <line x1="0" y1="72" x2="340" y2="72" class="svg-trait" />
    <text x="4" y="92" class="svg-texte" font-size="11.5" font-weight="700">2. À chaque question</text>
    ${boite(0, 102, 72, 'question')}${boite(88, 102, 72, 'embedding')}${boite(176, 102, 76, 'top-k')}
    ${boite(268, 102, 72, 'index', 'svg-parametre', 0.25)}
    ${boite(88, 158, 164, 'prompt : passages + question')}
    ${boite(268, 158, 72, 'LLM', 'svg-sortie', 1)}
    ${boite(268, 214, 72, 'réponse', 'svg-fond-sortie', 1)}
    <g data-b1></g><g data-b2></g><g data-b3></g><g data-b4></g><g data-b5></g><g data-b6></g>
    <text x="4" y="238" class="svg-doux" font-size="10">mettre à jour les documents :</text>
    <text x="4" y="252" class="svg-doux" font-size="10">réindexer, sans réentraîner le modèle</text>`;
}

export function dessiner(scene: HTMLElement) {
  const svg = svgDe(scene, 340, 262, gabarit);
  fleche(q(svg, '[data-a1]'), 72, 39, 88, 39, 'doux', 1.5);
  fleche(q(svg, '[data-a2]'), 160, 39, 176, 39, 'doux', 1.5);
  fleche(q(svg, '[data-a3]'), 252, 39, 268, 39, 'doux', 1.5);
  fleche(q(svg, '[data-b1]'), 72, 117, 88, 117, 'doux', 1.5);
  fleche(q(svg, '[data-b2]'), 160, 117, 176, 117, 'doux', 1.5);
  fleche(q(svg, '[data-b3]'), 268, 117, 252, 117, 'parametre', 1.5);
  fleche(q(svg, '[data-b4]'), 214, 132, 170, 158, 'doux', 1.5);
  fleche(q(svg, '[data-b5]'), 252, 173, 268, 173, 'doux', 1.5);
  fleche(q(svg, '[data-b6]'), 304, 188, 304, 214, 'sortie', 2);
  scene.setAttribute('aria-label', 'Indexation, une fois : documents, découpage en passages, embeddings, index. À chaque question : embedding de la question, recherche des k meilleurs passages dans l’index, prompt avec passages et question, LLM, réponse.');
}
