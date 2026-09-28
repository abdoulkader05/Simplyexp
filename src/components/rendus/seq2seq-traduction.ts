// Fiche « encoder-decoder » : « il pleut . » → « it is raining . » (probabilités d'illustration).
// P = 0,7 × 0,8 × 0,6 × 0,9 = 0,3024.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'encoder-decoder';
const SOURCE = ['il', 'pleut', '.'];
const CIBLE: [string, number][] = [['it', 0.7], ['is', 0.8], ['raining', 0.6], ['.', 0.9]];
const ENTREES_DEC = ['‹début›', 'it', 'is', 'raining'];
const ex = (i: number) => 26 + i * 46, dx = (i: number) => 196 + i * 42, CTX = 152;
const YC = 128;

export const etats: Record<string, Etat> = {
  initial: { k: 0 }, encodage: { k: 1 }, contexte: { k: 2 }, d1: { k: 3 }, d2: { k: 4 }, fin: { k: 5 },
};

function gabarit() {
  let s = `<text x="${ex(1)}" y="16" text-anchor="middle" class="svg-doux" font-size="10">encodeur</text>
    <text x="${dx(1.5)}" y="16" text-anchor="middle" class="svg-doux" font-size="10">décodeur</text>`;
  SOURCE.forEach((m, i) => {
    s += `<g data-e="${i}">
      <rect x="${ex(i) - 18}" y="${YC - 15}" width="36" height="30" rx="5" class="svg-entree" opacity=".2" />
      <line x1="${ex(i)}" y1="186" x2="${ex(i)}" y2="${YC + 16}" class="svg-trait-entree" stroke-width="1.5" />
      <text x="${ex(i)}" y="200" text-anchor="middle" class="svg-texte" font-size="12">${m}</text>
      ${i < 2 ? `<line x1="${ex(i) + 18}" y1="${YC}" x2="${ex(i + 1) - 18}" y2="${YC}" class="svg-trait-entree" stroke-width="1.5" />` : ''}
    </g>`;
  });
  s += `<g data-ctx>
      <line x1="${ex(2) + 18}" y1="${YC}" x2="${CTX - 12}" y2="${YC}" class="svg-trait-sortie" stroke-width="2" />
      <rect x="${CTX - 12}" y="${YC - 26}" width="24" height="52" rx="4" class="svg-sortie" />
      <text x="${CTX}" y="${YC + 42}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="700">c</text>
      <line x1="${CTX + 12}" y1="${YC}" x2="${dx(0) - 16}" y2="${YC}" class="svg-trait-sortie" stroke-width="2" />
    </g>`;
  CIBLE.forEach(([m], i) => {
    s += `<g data-d="${i}">
      <rect x="${dx(i) - 16}" y="${YC - 15}" width="32" height="30" rx="5" class="svg-parametre" opacity=".22" />
      ${i < 3 ? `<line x1="${dx(i) + 16}" y1="${YC}" x2="${dx(i + 1) - 16}" y2="${YC}" class="svg-trait-parametre" stroke-width="1.5" />` : ''}
      <line x1="${dx(i)}" y1="186" x2="${dx(i)}" y2="${YC + 16}" class="svg-trait-doux" stroke-width="1.2" />
      <text x="${dx(i)}" y="200" text-anchor="middle" class="svg-doux" font-size="9.5">${ENTREES_DEC[i]}</text>
      <line x1="${dx(i)}" y1="${YC - 16}" x2="${dx(i)}" y2="74" class="svg-trait-parametre" stroke-width="1.5" data-sortie />
      <text x="${dx(i)}" y="64" text-anchor="middle" class="svg-texte" font-size="12" font-weight="700">${m}</text>
      <text x="${dx(i)}" y="44" text-anchor="middle" class="svg-doux" font-size="10" data-p></text>
    </g>`;
  });
  return s + `<text x="4" y="232" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="251" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(5, Math.round(e.k)));
  SOURCE.forEach((_, i) => q(svg, `[data-e="${i}"]`).setAttribute('opacity', k >= 1 ? '1' : '0.4'));
  q(svg, '[data-ctx]').setAttribute('opacity', k >= 2 ? '1' : '0.15');
  const nbDec = k === 3 ? 1 : k === 4 ? 2 : k === 5 ? 4 : 0;
  CIBLE.forEach(([, p], i) => {
    const g = q(svg, `[data-d="${i}"]`);
    g.setAttribute('opacity', i < nbDec ? '1' : k >= 2 ? '0.3' : '0.15');
    q(g, '[data-p]').textContent = i < nbDec ? fr(p, 1) : '';
  });
  const T = [
    ['traduire « il pleut . » en anglais', 'deux réseaux récurrents : l’un lit, l’autre écrit'],
    ['l’encodeur lit la phrase source, mot après mot', 'il ne produit rien : il met à jour son état caché'],
    ['son dernier état devient le vecteur de contexte c', 'toute la phrase source est résumée dans c'],
    ['le décodeur part de c et du token ‹début›', 'il prédit « it » avec la probabilité 0,7'],
    ['« it » devient l’entrée du pas suivant', 'P(is | it, c) = 0,8'],
    ['« it is raining . » : on s’arrête au point final', 'P = 0,7 × 0,8 × 0,6 × 0,9 ≈ 0,302'],
  ][k];
  texte(svg, '[data-t1]', T[0]);
  texte(svg, '[data-t2]', T[1]);
  scene.setAttribute('aria-label', `${T[0]}. ${T[1]}.`);
}
