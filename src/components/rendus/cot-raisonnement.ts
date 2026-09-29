// Fiche « chain-of-thought » : réponse directe contre raisonnement étape par étape, sur un problème de bus.
// 18 passagers, 6 descendent, 12 montent, puis la moitié descend : 18 − 6 = 12, 12 + 12 = 24, 24 / 2 = 12.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'chain-of-thought';

const ETAPES_RAISON = ['18 − 6 = 12 passagers après le 1er arrêt', '12 + 12 = 24 passagers dans le bus', 'la moitié descend : 24 / 2 = 12'];
const ETAPES = [
  { n: 0, direct: false, final: '', t1: 'Le problème', t2: 'trois opérations à enchaîner' },
  { n: 0, direct: true, final: '', t1: 'Réponse directe : « 15 »', t2: 'tout doit tenir dans un seul token de réponse' },
  { n: 1, direct: false, final: '', t1: 'Pas à pas : première étape', t2: 'chaque résultat est écrit, donc relu' },
  { n: 2, direct: false, final: '', t1: 'Deuxième étape', t2: 'le modèle s’appuie sur « 12 », déjà écrit' },
  { n: 3, direct: false, final: 'Réponse : 12', t1: 'Troisième étape, puis la réponse', t2: 'la réponse arrive en dernier, après le calcul' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'direct', 'e1', 'e2', 'e3'][i], { k: i }]));

function gabarit() {
  return `
    <rect x="0" y="4" width="340" height="52" rx="5" class="svg-entree" fill-opacity="0.08" />
    <text x="8" y="22" class="svg-texte" font-size="11">Un bus part avec 18 passagers. 6 descendent,</text>
    <text x="8" y="38" class="svg-texte" font-size="11">12 montent. Au 2e arrêt, la moitié descend.</text>
    <text x="8" y="52" class="svg-texte" font-size="11" font-weight="700">Combien reste-t-il de passagers ?</text>
    <g data-direct></g>
    ${[0, 1, 2].map((i) => `<text x="8" y="${92 + i * 24}" class="svg-texte" font-size="11" style="font-family: var(--police-code)" data-r="${i}"></text>`).join('')}
    <rect x="8" y="160" width="130" height="26" rx="5" class="svg-fond-sortie" data-fbox />
    <text x="16" y="178" class="svg-texte" font-size="13" font-weight="700" data-final></text>
    <text x="4" y="226" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="246" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  q(svg, '[data-direct]').innerHTML = et.direct
    ? `<rect x="8" y="72" width="130" height="26" rx="5" class="svg-perte" fill-opacity="0.15" />
       <text x="16" y="90" class="svg-texte" font-size="13" font-weight="700">Réponse : 15</text>
       <text x="150" y="90" class="svg-perte" font-size="12" font-weight="700">faux</text>`
    : '';
  ETAPES_RAISON.forEach((r, i) => texte(svg, `[data-r="${i}"]`, !et.direct && i < et.n ? r : ''));
  q(svg, '[data-fbox]').setAttribute('opacity', et.final ? '1' : '0');
  texte(svg, '[data-final]', et.final);
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  const vus = et.direct ? ['Réponse directe : 15, faux'] : ETAPES_RAISON.slice(0, et.n);
  scene.setAttribute('aria-label', `${et.t1}. ${vus.join('. ')}${et.final ? `. ${et.final}` : ''}.`);
}
