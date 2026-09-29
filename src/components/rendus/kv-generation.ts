// Fiche « kv-cache » : génération de « Le chat dort sur », avec et sans cache des clés et valeurs.
// Sans cache : 2 + 3 + 4 = 9 calculs de (K, V). Avec cache : 2 + 1 + 1 = 4.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'kv-cache';

const MOTS = ['Le', 'chat', 'dort', 'sur'];
const ETAPES = [
  { t: 2, sans: 2, avec: 2, t1: 'Prompt « Le chat » : 2 paires (K, V)', t2: 'les deux méthodes commencent pareil' },
  { t: 3, sans: 5, avec: 3, t1: 'Nouveau token « dort »', t2: 'sans cache : on refait les 3 ; avec : 1 seul' },
  { t: 4, sans: 9, avec: 4, t1: 'Nouveau token « sur »', t2: 'sans cache : 4 de plus ; avec : toujours 1' },
  { t: 4, sans: 9, avec: 4, t1: 'Bilan : 9 calculs contre 4', t2: 'l’écart grandit à chaque token généré' },
];

export const etats: Record<string, Etat> = Object.fromEntries(
  ETAPES.map((_, k) => [['initial', 't3', 't4', 'bilan'][k], { k }]),
);

function rangee(y: number, t: number, nouveaux: number) {
  // t tokens ; les `nouveaux` derniers sont calculés à cette étape, les autres relus.
  return MOTS.slice(0, t).map((m, i) => {
    const x = 70 + i * 62, calcule = i >= t - nouveaux;
    return `<rect x="${x}" y="${y}" width="56" height="38" rx="4" class="${calcule ? 'svg-sortie' : 'svg-parametre'}" fill-opacity="${calcule ? 0.45 : 0.15}" />
      <text x="${x + 28}" y="${y + 16}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="600">${m}</text>
      <text x="${x + 28}" y="${y + 31}" text-anchor="middle" class="svg-doux" font-size="9.5">${calcule ? 'calculé' : 'relu'}</text>`;
  }).join('');
}

function gabarit() {
  return `
    <text x="4" y="18" class="svg-doux" font-size="10">une case = les clés et valeurs d’un token, dans chaque couche</text>
    <text x="4" y="60" class="svg-texte" font-size="11" font-weight="700">sans</text>
    <text x="4" y="74" class="svg-texte" font-size="11" font-weight="700">cache</text>
    <g data-sans></g>
    <text x="4" y="130" class="svg-texte" font-size="11" font-weight="700">avec</text>
    <text x="4" y="144" class="svg-texte" font-size="11" font-weight="700">cache</text>
    <g data-avec></g>
    <text x="4" y="186" class="svg-texte" font-size="11" style="font-family: var(--police-code)" data-compte></text>
    <text x="4" y="226" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="246" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  const bilan = k === 3;
  q(svg, '[data-sans]').innerHTML = rangee(46, et.t, bilan ? 0 : k === 0 ? 2 : et.t);
  q(svg, '[data-avec]').innerHTML = rangee(116, et.t, bilan ? 0 : k === 0 ? 2 : 1);
  texte(svg, '[data-compte]', `calculs cumulés : sans cache ${et.sans}, avec cache ${et.avec}`);
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}. Calculs cumulés : ${et.sans} sans cache, ${et.avec} avec cache.`);
}
