// Fiche « pretraining » : la chaîne du pré-entraînement de GPT-3 (Brown et al. 2020, section 2.2).
// Common Crawl : 45 To compressés → 570 Go après filtrage ; 300 milliards de tokens vus ; C ≈ 6ND ≈ 3,15 × 10²³.
import type { Etat } from '../animations/types';
import { svgDe, q, texte, fleche } from '../animations/svg';

export const fiche = 'pretraining';
const BOITES = [
  { id: 'web', x: 4, y: 26, l: 100, t: 'web brut', s: '45 To compressés' },
  { id: 'filtre', x: 120, y: 26, l: 100, t: 'filtrer, dédoubler', s: '570 Go gardés' },
  { id: 'melange', x: 236, y: 26, l: 100, t: 'mélanger', s: 'cinq sources' },
  { id: 'tokens', x: 236, y: 96, l: 100, t: 'tokeniser (BPE)', s: 'lots de séquences' },
  { id: 'predire', x: 120, y: 96, l: 100, t: 'prédire', s: 'token suivant' },
  { id: 'corriger', x: 4, y: 96, l: 100, t: 'corriger', s: 'perte, gradient' },
];
const ETAPES = [
  { actives: ['web'], t1: 'Au départ : une copie du web', t2: 'pages, forums, publicités, doublons, textes cassés' },
  { actives: ['filtre'], t1: 'Filtrer et dédoubler', t2: '45 To compressés → 570 Go de texte jugé de qualité' },
  { actives: ['melange'], t1: 'Mélanger les sources, pondérées', t2: 'les sources soignées sont lues plus souvent' },
  { actives: ['tokens', 'predire', 'corriger'], t1: 'La boucle : prédire, corriger, recommencer', t2: 'des centaines de milliers de pas d’optimisation' },
  { actives: [], t1: 'Le bilan de GPT-3', t2: '300 milliards de tokens · C ≈ 6 N D ≈ 3,15 × 10²³ opérations' },
];
const MELANGE = [['Common Crawl', 0.6], ['WebText2', 0.22], ['Books1', 0.08], ['Books2', 0.08], ['Wikipédia', 0.03]] as const;

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'filtre', 'melange', 'boucle', 'bilan'][i], { k: i }]));

function gabarit() {
  return BOITES.map((b) => `<g data-b="${b.id}">
    <rect x="${b.x}" y="${b.y}" width="${b.l}" height="46" rx="6" class="svg-entree svg-trait-entree" stroke-width="1.5" />
    <text x="${b.x + b.l / 2}" y="${b.y + 20}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="700">${b.t}</text>
    <text x="${b.x + b.l / 2}" y="${b.y + 36}" text-anchor="middle" class="svg-doux" font-size="9.5">${b.s}</text></g>`).join('')
    + '<g data-f1></g><g data-f2></g><g data-f3></g><g data-f4></g><g data-f5></g><g data-f6></g><g data-mix></g>'
    + `<text x="4" y="14" class="svg-doux" font-size="10">GPT-3, d’après le paper de 2020</text>
    <text x="4" y="226" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="246" class="svg-doux" font-size="10.5" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  BOITES.forEach((b) => q(svg, `[data-b="${b.id}"] rect`).setAttribute('fill-opacity', et.actives.includes(b.id) ? '0.35' : '0.08'));
  const f = (n: number, x1: number, y1: number, x2: number, y2: number, actif: boolean) => {
    fleche(q(svg, `[data-f${n}]`), x1, y1, x2, y2, actif ? 'sortie' : 'doux', actif ? 2.5 : 1.5);
  };
  f(1, 104, 49, 120, 49, k === 1);
  f(2, 220, 49, 236, 49, k === 2);
  f(3, 286, 72, 286, 96, k === 3);
  f(4, 236, 119, 220, 119, k === 3);
  f(5, 120, 119, 104, 119, k === 3);
  f(6, 54, 142, 54, 158, false);
  q(svg, '[data-f6]').innerHTML = k === 3 ? `<path d="M54,142 L54,160 L286,160 L286,146" class="svg-ligne svg-trait-sortie svg-pointille" stroke-width="1.8" />
    <text x="170" y="174" text-anchor="middle" class="svg-doux" font-size="9.5">poids mis à jour, lot suivant</text>` : '';
  q(svg, '[data-mix]').innerHTML = k === 2 ? MELANGE.map(([n, w], i) => {
    const y = 152 + i * 12;
    return `<text x="4" y="${y + 8}" class="svg-texte" font-size="9.5">${n}</text>
      <rect x="84" y="${y}" width="${220 * w}" height="9" rx="2" class="svg-sortie" />
      <text x="${90 + 220 * w}" y="${y + 8}" class="svg-texte" font-size="9.5">${Math.round(w * 100)} %</text>`;
  }).join('') : '';
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
