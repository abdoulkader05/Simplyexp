// Fiche « bert-vs-gpt » : qui voit qui dans l'attention, pour une phrase de 4 tokens.
// Encodeur : 16 paires visibles. Décodeur (masque causal) : 1 + 2 + 3 + 4 = 10.
// Encodeur-décodeur : la source se voit en entier, la cible est causale et lit toute la source.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'bert-vs-gpt';
const MOTS = ['il', 'pleut', 'très', 'fort'];

type Mode = 'vide' | 'encodeur' | 'decodeur';
const ETAPES: { mode: Mode; t1: string; t2: string }[] = [
  { mode: 'vide', t1: 'Qui a le droit de regarder qui ?', t2: 'ligne : le token qui regarde · colonne : le token regardé' },
  { mode: 'encodeur', t1: 'Encodeur (BERT) : tout le monde voit tout', t2: '4 × 4 = 16 paires visibles' },
  { mode: 'decodeur', t1: 'Décodeur (GPT) : seulement le passé', t2: '1 + 2 + 3 + 4 = 10 paires visibles' },
];

export const etats: Record<string, Etat> = { initial: { k: 0 }, encodeur: { k: 1 }, decodeur: { k: 2 } };

function gabarit() {
  const x0 = 110, y0 = 40, c = 38;
  let g = MOTS.map((m, j) => `<text x="${x0 + j * c + c / 2}" y="${y0 - 8}" text-anchor="middle" class="svg-doux" font-size="11">${m}</text>`).join('');
  g += MOTS.map((m, i) => `<text x="${x0 - 8}" y="${y0 + i * c + c / 2 + 4}" text-anchor="end" class="svg-texte" font-size="12">${m}</text>`).join('');
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    g += `<rect x="${x0 + j * c + 2}" y="${y0 + i * c + 2}" width="${c - 4}" height="${c - 4}" rx="4" class="svg-entree svg-trait-entree" stroke-width="1" data-c="${i}-${j}" />`;
  }
  return `<text x="4" y="14" class="svg-doux" font-size="10">phrase « il pleut très fort »</text>${g}
    <text x="4" y="220" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="240" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const visible = et.mode === 'encodeur' || (et.mode === 'decodeur' && j <= i);
    q(svg, `[data-c="${i}-${j}"]`).setAttribute('fill-opacity', et.mode === 'vide' ? '0.08' : visible ? '0.55' : '0.04');
  }
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
