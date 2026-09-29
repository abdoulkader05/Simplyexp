// Fiche « lora » : W₀ gelée, ΔW complète contre B × A de rang 1, puis fusion. Exemple d = k = 6, r = 1.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'lora';

const C = 11; // taille d'une case en pixels
const ETAPES = [
  { vue: 'gele', t1: 'W₀ : les poids pré-entraînés, gelés', t2: 'ici 6 × 6 = 36 nombres, qu’on ne touche plus' },
  { vue: 'complet', t1: 'Fine-tuning complet : apprendre ΔW', t2: 'une matrice de même taille : 36 nombres' },
  { vue: 'lora', t1: 'LoRA : ΔW = B × A, de rang 1', t2: 'B (6 × 1) et A (1 × 6) : 12 nombres seulement' },
  { vue: 'fusion', t1: 'Après l’entraînement : W = W₀ + BA', t2: 'une seule matrice, aucun calcul en plus' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((et, i) => [i === 0 ? 'initial' : et.vue, { k: i }]));

function grille(x: number, y: number, lignes: number, colonnes: number, classe: string, op: number) {
  let s = '';
  for (let i = 0; i < lignes; i++) for (let j = 0; j < colonnes; j++)
    s += `<rect x="${x + j * C}" y="${y + i * C}" width="${C - 1.5}" height="${C - 1.5}" rx="1.5" class="${classe}" fill-opacity="${op}" />`;
  return s;
}
const legende = (x: number, y: number, t: string) => `<text x="${x}" y="${y}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="600">${t}</text>`;
const signe = (x: number, y: number, t: string) => `<text x="${x}" y="${y}" text-anchor="middle" class="svg-texte" font-size="16" font-weight="700">${t}</text>`;

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, () => `<g data-corps></g>
    <text x="4" y="226" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="245" class="svg-doux" font-size="11" data-t2></text>`);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  const Y = 50;
  let h = grille(10, Y, 6, 6, 'svg-entree', 0.25) + legende(42, Y - 10, 'W₀ (gelée)');
  if (et.vue === 'complet') {
    h += signe(88, Y + 38, '+') + grille(104, Y, 6, 6, 'svg-sortie', 0.9) + legende(136, Y - 10, 'ΔW : 36 à apprendre');
  } else if (et.vue === 'lora') {
    h += signe(88, Y + 38, '+') + grille(104, Y, 6, 1, 'svg-sortie', 0.9) + legende(109, Y - 10, 'B')
      + signe(126, Y + 38, '×') + grille(140, Y + 28, 1, 6, 'svg-sortie', 0.9) + legende(172, Y + 20, 'A')
      + `<text x="140" y="${Y + 62}" class="svg-doux" font-size="10">6 + 6 = 12 nombres</text>`
      + signe(222, Y + 38, '=') + grille(238, Y, 6, 6, 'svg-sortie', 0.45) + legende(270, Y - 10, 'BA : rang 1');
  } else if (et.vue === 'fusion') {
    h += signe(88, Y + 38, '+') + grille(104, Y, 6, 6, 'svg-sortie', 0.45) + legende(136, Y - 10, 'BA')
      + signe(186, Y + 38, '=') + grille(202, Y, 6, 6, 'svg-parametre', 0.55) + legende(234, Y - 10, 'W')
      + `<text x="202" y="${Y + 84}" class="svg-doux" font-size="10">même taille que W₀</text>`;
  } else {
    h += `<text x="90" y="${Y + 30}" class="svg-doux" font-size="11">d = 6 lignes, k = 6 colonnes</text>
      <text x="90" y="${Y + 48}" class="svg-doux" font-size="11">(dans un vrai modèle : des milliers)</text>`;
  }
  q(svg, '[data-corps]').innerHTML = h;
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
