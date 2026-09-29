// Fiche « bert-vs-gpt » : schéma statique des trois familles de transformers et de leurs usages.
import type { Etat } from '../animations/types';
import { svgDe } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: {} };

const COLONNES = [
  { x: 4, titre: 'Encodeur', ex: 'ex. BERT', obj: 'texte à trous', usages: ['classer un avis', 'rechercher', 'extraire des noms'], classe: 'svg-entree' },
  { x: 116, titre: 'Décodeur', ex: 'ex. GPT', obj: 'token suivant', usages: ['converser', 'rédiger', 'compléter du code'], classe: 'svg-sortie' },
  { x: 228, titre: 'Enc.-décodeur', ex: 'ex. T5', obj: 'texte → texte', usages: ['traduire', 'résumer', 'reformuler'], classe: 'svg-parametre' },
];

function gabarit() {
  return COLONNES.map((c) => `
    <rect x="${c.x}" y="6" width="108" height="46" rx="6" class="${c.classe}" fill-opacity="0.25" />
    <text x="${c.x + 54}" y="26" text-anchor="middle" class="svg-texte" font-size="12" font-weight="700">${c.titre}</text>
    <text x="${c.x + 54}" y="43" text-anchor="middle" class="svg-doux" font-size="10">${c.ex}</text>
    <text x="${c.x + 54}" y="74" text-anchor="middle" class="svg-doux" font-size="9.5">apprend par</text>
    <text x="${c.x + 54}" y="90" text-anchor="middle" class="svg-texte" font-size="11" font-weight="600">${c.obj}</text>
    <line x1="${c.x + 10}" y1="104" x2="${c.x + 98}" y2="104" class="svg-trait" />
    <text x="${c.x + 54}" y="122" text-anchor="middle" class="svg-doux" font-size="9.5">sert surtout à</text>
    ${c.usages.map((u, i) => `<text x="${c.x + 54}" y="${142 + i * 18}" text-anchor="middle" class="svg-texte" font-size="10.5">${u}</text>`).join('')}`).join('')
    + `<text x="4" y="222" class="svg-texte" font-size="12" font-weight="700">Même brique, trois assemblages</text>
    <text x="4" y="240" class="svg-doux" font-size="10.5">même bloc de base : le masque et l’objectif font la différence</text>`;
}

export function dessiner(scene: HTMLElement) {
  svgDe(scene, 340, 262, gabarit);
  scene.setAttribute('aria-label', 'Trois familles. Encodeur, par exemple BERT, appris par texte à trous, sert à classer, rechercher, extraire. Décodeur, par exemple GPT, appris par token suivant, sert à converser, rédiger, compléter du code. Encodeur-décodeur, par exemple T5, appris texte vers texte, sert à traduire, résumer, reformuler.');
}
