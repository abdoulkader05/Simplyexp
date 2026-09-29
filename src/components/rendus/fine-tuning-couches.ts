// Fiche « fine-tuning » : une pile de 4 couches pré-entraînées + une tête neuve.
// Taux d'apprentissage discriminants (Howard et Ruder 2018) : η_{l−1} = η_l / 2,6, avec η_4 = 3 × 10⁻⁵.
// Les jauges « tâche » et « général » sont des valeurs d'illustration.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'fine-tuning';
const COUCHES = ['couche 1', 'couche 2', 'couche 3', 'couche 4'];
const TAUX = ['0,17 × 10⁻⁵', '0,44 × 10⁻⁵', '1,15 × 10⁻⁵', '3 × 10⁻⁵'];

type Et = { actives: number[]; tete: boolean; taux: boolean; tache: number; general: number; t1: string; t2: string; oubli?: boolean };
const ETAPES: Et[] = [
  { actives: [], tete: false, taux: false, tache: 0.1, general: 0.8, t1: 'Un modèle pré-entraîné, une tête neuve', t2: 'la tête transforme le dernier vecteur en réponse' },
  { actives: [], tete: true, taux: false, tache: 0.45, general: 0.8, t1: 'D’abord, seule la tête apprend', t2: 'les couches pré-entraînées restent gelées' },
  { actives: [3, 2], tete: true, taux: false, tache: 0.7, general: 0.78, t1: 'On dégèle couche après couche', t2: 'en partant du haut : dégel progressif' },
  { actives: [3, 2, 1, 0], tete: true, taux: true, tache: 0.85, general: 0.76, t1: 'Des pas plus petits vers le bas', t2: 'chaque couche : taux de la couche au-dessus ÷ 2,6' },
  { actives: [3, 2, 1, 0], tete: true, taux: false, tache: 0.9, general: 0.3, oubli: true, t1: 'Trop fort, trop longtemps : l’oubli', t2: 'la tâche progresse, le savoir général s’efface' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'tete', 'degel', 'taux', 'oubli'][i], { k: i }]));

function gabarit() {
  const pile = COUCHES.map((c, i) => {
    const y = 150 - i * 32;
    return `<rect x="10" y="${y}" width="130" height="26" rx="5" class="svg-entree svg-trait-entree" stroke-width="1.5" data-c="${i}" />
      <text x="75" y="${y + 17}" text-anchor="middle" class="svg-texte" font-size="11">${c}</text>
      <text x="148" y="${y + 17}" class="svg-texte" font-size="10" style="font-family: var(--police-code)" data-taux="${i}">${TAUX[i]}</text>`;
  }).join('');
  return `<rect x="10" y="14" width="130" height="26" rx="5" class="svg-sortie svg-trait-sortie" stroke-width="1.5" data-tete />
    <text x="75" y="31" text-anchor="middle" class="svg-texte" font-size="11" font-weight="700">tête (neuve)</text>
    ${pile}
    <text x="75" y="194" text-anchor="middle" class="svg-doux" font-size="9.5">texte d’entrée</text>
    <text x="290" y="30" text-anchor="middle" class="svg-doux" font-size="9.5">niveaux (illustration)</text>
    <text x="290" y="60" text-anchor="middle" class="svg-texte" font-size="10.5">tâche</text>
    <rect x="250" y="66" width="80" height="12" rx="3" fill="none" class="svg-trait" /><rect x="250" y="66" height="12" rx="3" class="svg-parametre" data-j1 />
    <text x="290" y="104" text-anchor="middle" class="svg-texte" font-size="10.5">général</text>
    <rect x="250" y="110" width="80" height="12" rx="3" fill="none" class="svg-trait" /><rect x="250" y="110" height="12" rx="3" data-j2 />
    <text x="4" y="226" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="246" class="svg-doux" font-size="10.5" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  COUCHES.forEach((_, i) => {
    q(svg, `[data-c="${i}"]`).setAttribute('fill-opacity', et.actives.includes(i) ? '0.4' : '0.08');
    q(svg, `[data-taux="${i}"]`).setAttribute('opacity', et.taux ? '1' : '0');
  });
  q(svg, '[data-tete]').setAttribute('fill-opacity', et.tete ? '0.9' : '0.25');
  q(svg, '[data-j1]').setAttribute('width', String(80 * et.tache));
  const j2 = q(svg, '[data-j2]');
  j2.setAttribute('width', String(80 * et.general));
  j2.setAttribute('class', et.oubli ? 'svg-perte' : 'svg-parametre');
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
