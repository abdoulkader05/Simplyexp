// Fiche « hallucinations » : un fait rare, une loi presque plate, une réponse assurée,
// puis le score attendu selon la notation (Kalai et al. 2025) : binaire → deviner ; pénalité t/(1−t) avec t = 0,5 → s'abstenir.
// Probabilités inventées pour l'illustration.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'hallucinations';
const LOI: [string, number][] = [['1998', 0.22], ['2001', 0.2], ['2003', 0.19], ['1995', 0.18], ['autre', 0.21]];

const ETAPES = [
  { barres: false, reponse: '', score: 0, t1: 'Une question sur un fait rare', t2: 'rarement vu, voire jamais, pendant le pré-entraînement' },
  { barres: true, reponse: '', score: 0, t1: 'Une loi presque plate', t2: 'aucune année ne dépasse 0,22 : le modèle ne sait pas' },
  { barres: true, reponse: '« L’entreprise a été fondée en 2001. »', score: 0, t1: 'Une réponse fluide et assurée', t2: 'l’hésitation de la loi ne se voit pas dans le texte' },
  { barres: true, reponse: '', score: 1, t1: 'Notation binaire : deviner rapporte', t2: 'répondre : 0,22 point en moyenne · « je ne sais pas » : 0' },
  { barres: true, reponse: '', score: 2, t1: 'Erreur pénalisée (seuil t = 0,5)', t2: '0,22 − 0,78 × 1 = −0,56 < 0 : mieux vaut s’abstenir' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'loi', 'reponse', 'binaire', 'penalite'][i], { k: i }]));

function gabarit() {
  return `<text x="4" y="18" class="svg-texte" font-size="12.5" font-weight="600">« En quelle année cette petite entreprise</text>
    <text x="4" y="34" class="svg-texte" font-size="12.5" font-weight="600">locale a-t-elle été fondée ? »</text>
    <g data-barres></g>
    <text x="4" y="186" class="svg-texte" font-size="11.5" font-style="italic" data-rep></text>
    <g data-score></g>
    <text x="4" y="228" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="247" class="svg-doux" font-size="10" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  q(svg, '[data-barres]').innerHTML = !et.barres ? '' : LOI.map(([m, p], i) => {
    const y = 50 + i * 24;
    const choisi = k === 2 && m === '2001';
    return `<text x="4" y="${y + 13}" class="svg-texte" font-size="11">${m}</text>
      <rect x="50" y="${y}" width="200" height="16" rx="3" fill="none" class="svg-trait" />
      <rect x="50" y="${y}" width="${200 * p}" height="16" rx="3" class="${choisi ? 'svg-sortie' : 'svg-entree'}" fill-opacity="${choisi ? 1 : 0.35}" />
      <text x="${58 + 200 * p}" y="${y + 13}" class="svg-texte" font-size="11">${fr(p, 2)}</text>`;
  }).join('');
  texte(svg, '[data-rep]', et.reponse);
  q(svg, '[data-score]').innerHTML = et.score === 0 ? '' : `
    <rect x="262" y="52" width="74" height="112" rx="6" style="fill: var(--papier-2)" />
    <text x="299" y="70" text-anchor="middle" class="svg-doux" font-size="9.5">score attendu</text>
    <text x="299" y="96" text-anchor="middle" class="svg-doux" font-size="9.5">répondre</text>
    <text x="299" y="114" text-anchor="middle" class="${et.score === 1 ? 'svg-texte' : 'svg-perte'}" font-size="14" font-weight="700">${et.score === 1 ? '+0,22' : '−0,56'}</text>
    <text x="299" y="138" text-anchor="middle" class="svg-doux" font-size="9.5">s’abstenir</text>
    <text x="299" y="156" text-anchor="middle" class="svg-texte" font-size="14" font-weight="700">0</text>`;
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
