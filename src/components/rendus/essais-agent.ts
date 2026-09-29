// Fiche « evaluation-agents » : 5 tâches × 8 essais (résultats inventés). Taux 22/40 = 0,55 ;
// sur les 4 premiers essais, pass@4 = 4/5 = 0,8 (au moins une réussite), pass^4 = 1/5 = 0,2 (toutes).
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'evaluation-agents';

const GRILLE = ['11111111', '11011111', '10110110', '01001000', '00000000'];
const X0 = 62, Y0 = 34, PAS_X = 27, PAS_Y = 26, T = 21;

const ETAPES = [
  { mode: 'grille', t1: '5 tâches, 8 essais chacune', t2: 'plein : réussi · pâle : raté (résultats inventés)' },
  { mode: 'taux', t1: 'Taux de réussite : 22 / 40 = 0,55', t2: 'la moyenne cache des tâches très différentes' },
  { mode: 'arobase', t1: 'pass@4 : 4 tâches sur 5 = 0,8', t2: 'au moins une réussite parmi les 4 premiers essais' },
  { mode: 'puissance', t1: 'pass^4 : 1 tâche sur 5 = 0,2', t2: 'les 4 premiers essais tous réussis' },
  { mode: 'bilan', t1: 'Même agent : 0,8 ou 0,2', t2: 'pass@k : « peut-il y arriver ? »' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'taux', 'arobase', 'puissance', 'bilan'][i], { k: i }]));

function gabarit() {
  return `
    <text x="${X0}" y="20" class="svg-doux" font-size="10">essais 1 à 8 →</text>
    <rect x="${X0 - 4}" y="${Y0 - 4}" width="${4 * PAS_X + 2}" height="${5 * PAS_Y + 2}" rx="5" fill="none" class="svg-trait-sortie" stroke-width="2.5" data-cadre />
    ${GRILLE.map((r, i) => `<text x="4" y="${Y0 + i * PAS_Y + 15}" class="svg-texte" font-size="11">tâche ${i + 1}</text>
      ${[...r].map((v, j) => `<rect x="${X0 + j * PAS_X}" y="${Y0 + i * PAS_Y}" width="${T}" height="${T}" rx="4" class="${v === '1' ? 'svg-parametre svg-trait-parametre' : 'svg-perte svg-trait-perte'}" fill-opacity="${v === '1' ? 0.85 : 0.15}" stroke-width="1" data-c="${i}-${j}" />`).join('')}
      <text x="336" y="${Y0 + i * PAS_Y + 15}" text-anchor="end" class="svg-texte" font-size="11" font-weight="700" data-r="${i}"></text>`).join('')}
    <text x="4" y="196" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="216" class="svg-doux" font-size="10.5" data-t2></text>
    <text x="4" y="234" class="svg-doux" font-size="10.5" data-t3></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  const quatre = et.mode === 'arobase' || et.mode === 'puissance';
  q(svg, '[data-cadre]').setAttribute('opacity', quatre ? '1' : '0');
  GRILLE.forEach((r, i) => {
    [...r].forEach((_, j) => q(svg, `[data-c="${i}-${j}"]`).setAttribute('opacity', quatre && j >= 4 ? '0.25' : '1'));
    const debut = r.slice(0, 4);
    let marque = '';
    if (et.mode === 'taux' || et.mode === 'bilan') marque = `${r.split('').filter((v) => v === '1').length}/8`;
    else if (et.mode === 'arobase') marque = debut.includes('1') ? 'oui' : 'non';
    else if (et.mode === 'puissance') marque = debut === '1111' ? 'oui' : 'non';
    texte(svg, `[data-r="${i}"]`, marque);
  });
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  texte(svg, '[data-t3]', et.mode === 'bilan' ? 'pass^k : « y arrive-t-il à chaque fois ? »' : '');
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
