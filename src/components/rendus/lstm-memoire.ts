// Fiche « lstm » : cellule mémoire à un nombre, c_t = f · c_{t−1} + i · c̃ (valeurs de portes choisies).
// c = 0,9 ; 0,855 ; 0,812 ; 0,772 ; puis oubli (f = 0,1) et écriture de −0,8 : c = −0,723.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'lstm';
export const MOTS = ['enfants', 'du', 'quartier', 'hier', 'chien'];
export const PORTES: [number, number, number][] = [[0, 1, 0.9], [0.95, 0.05, 0], [0.95, 0.05, 0], [0.95, 0.05, 0], [0.1, 1, -0.8]];
export const C = PORTES.reduce<number[]>((acc, [f, i, ct]) => [...acc, f * (acc.at(-1) ?? 0) + i * ct], []);
const cx = (i: number) => 38 + i * 66;
const BASE = 118, ECH = 58;

export const etats: Record<string, Etat> = Object.fromEntries([0, 1, 2, 3, 4, 5].map((k) => [k ? `t${k}` : 'initial', { k }]));

function gabarit() {
  return `
    <text x="4" y="14" class="svg-doux" font-size="10">cellule mémoire c : + = sujet au pluriel, − = au singulier</text>
    <line x1="8" y1="${BASE}" x2="336" y2="${BASE}" class="svg-trait-parametre" stroke-width="3" opacity=".5" />
    ${MOTS.map((m, i) => `<g data-c="${i}">
      <rect x="${cx(i) - 11}" y="${BASE}" width="22" height="0" class="svg-sortie" data-barre />
      <text x="${cx(i)}" y="${BASE}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="700" data-v></text>
      <text x="${cx(i)}" y="196" text-anchor="middle" class="svg-texte" font-size="12">${m}</text>
      <text x="${cx(i)}" y="211" text-anchor="middle" class="svg-doux" font-size="9" data-p></text>
    </g>`).join('')}
    <text x="4" y="236" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="254" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(5, Math.round(e.k)));
  MOTS.forEach((_, i) => {
    const g = q(svg, `[data-c="${i}"]`);
    const fait = i < k;
    g.setAttribute('opacity', fait || i === k ? '1' : '0.35');
    const v = C[i], h = fait ? ECH * Math.abs(v) : 0;
    const b = q(g, '[data-barre]');
    b.setAttribute('y', String(v >= 0 ? BASE - h : BASE));
    b.setAttribute('height', String(h));
    b.setAttribute('class', v >= 0 ? 'svg-sortie' : 'svg-perte');
    const t = q(g, '[data-v]');
    t.textContent = fait ? fr(v, 3) : '';
    t.setAttribute('y', String(v >= 0 ? BASE - h - 5 : BASE + h + 13));
    const [f, ii] = PORTES[i];
    q(g, '[data-p]').textContent = fait ? `f ${fr(f, 2)} · i ${fr(ii, 2)}` : '';
  });
  const T = [
    ['c = f × (ancienne mémoire) + i × (nouveauté)', 'f : porte d’oubli, i : porte d’entrée, entre 0 et 1'],
    ['« enfants » : on écrit « pluriel », c = 0,9', 'porte d’entrée ouverte (i = 1), nouveauté + 0,9'],
    ['« du » : on garde presque tout, c = 0,855', 'f = 0,95 : 0,95 × 0,9 = 0,855'],
    ['« quartier » : c = 0,812', 'la mémoire tient, la porte d’oubli reste presque à 1'],
    ['« hier » : c = 0,772', 'un RNN simple serait déjà tombé à 0,09 (voir la fiche RNN)'],
    ['« chien » : nouveau sujet, on efface et on réécrit', 'f = 0,1 et i = 1 : 0,1 × 0,772 − 0,8 = −0,723'],
  ][k];
  texte(svg, '[data-t1]', T[0]);
  texte(svg, '[data-t2]', T[1]);
  scene.setAttribute('aria-label', `${T[0]}. ${T[1]}.`);
}
