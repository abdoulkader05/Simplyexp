// Fiche « decodage-sampling » : une même loi du token suivant, six façons de choisir.
// Loi d'illustration après « Le soleil se » : lève 0,50 · couche 0,30 · voile 0,10 · montre 0,05 · cache 0,03 · mange 0,02.
// Température : p^(1/T) renormalisé. Top-k (k = 3) et top-p (p = 0,75) : on garde, puis on renormalise.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'decodage-sampling';
const MOTS = ['lève', 'couche', 'voile', 'montre', 'cache', 'mange'];
const P = [0.5, 0.3, 0.1, 0.05, 0.03, 0.02];

const temperature = (T: number) => {
  const q2 = P.map((p) => p ** (1 / T));
  const s = q2.reduce((a, b) => a + b, 0);
  return q2.map((x) => x / s);
};
const garder = (n: number) => {
  const s = P.slice(0, n).reduce((a, b) => a + b, 0);
  return P.map((p, i) => (i < n ? p / s : 0));
};

const ETAPES = [
  { loi: P, choisi: -1, t1: 'La loi du token suivant', t2: 'après « Le soleil se », calculée par le modèle' },
  { loi: P, choisi: 0, t1: 'Glouton : on prend toujours le premier', t2: 'même contexte, même mot, à chaque fois' },
  { loi: temperature(0.5), choisi: -1, t1: 'Température T = 0,5 : la loi se durcit', t2: '« lève » passe de 0,50 à 0,71' },
  { loi: temperature(2), choisi: -1, t1: 'Température T = 2 : la loi s’aplatit', t2: 'même « mange » atteint 0,07' },
  { loi: garder(3), choisi: -1, t1: 'Top-k, k = 3 : on garde les 3 premiers', t2: 'puis on divise par leur somme, 0,9' },
  { loi: garder(2), choisi: -1, t1: 'Top-p, p = 0,75 : le plus petit noyau', t2: 'cumul 0,50 puis 0,80 ≥ 0,75 : deux mots suffisent' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'glouton', 'froid', 'chaud', 'topk', 'topp'][i], { k: i }]));

function gabarit() {
  return `
    <text x="4" y="16" class="svg-texte" font-size="13" font-weight="600">« Le soleil se … »</text>
    <g data-barres></g>
    <text x="4" y="224" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="244" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  q(svg, '[data-barres]').innerHTML = MOTS.map((m, i) => {
    const y = 32 + i * 29;
    const v = et.loi[i];
    const exclu = v === 0;
    const garde = et.choisi === -1 ? !exclu : i === et.choisi;
    return `<text x="4" y="${y + 14}" class="svg-texte" font-size="12" opacity="${exclu ? 0.4 : 1}">${m}</text>
      <rect x="66" y="${y}" width="220" height="20" rx="3" fill="none" class="svg-trait" />
      <rect x="66" y="${y}" width="${Math.max(0, 220 * v)}" height="20" rx="3" class="${garde ? 'svg-sortie' : 'svg-entree'}" fill-opacity="${garde ? 1 : 0.3}" />
      <text x="336" y="${y + 14}" text-anchor="end" class="svg-texte" font-size="12" opacity="${exclu ? 0.4 : 1}">${exclu ? 'exclu' : fr(v, 2)}</text>`;
  }).join('');
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${MOTS.map((m, i) => `${m} ${fr(et.loi[i], 2)}`).join(', ')}.`);
}
