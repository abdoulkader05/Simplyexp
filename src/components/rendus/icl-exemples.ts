// Fiche « in-context-learning » : un prompt qui s'enrichit d'exemples, et la loi du mot suivant qui change.
// Probabilités inventées pour l'illustration.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'in-context-learning';

const LIGNES = [
  'Classe l’avis : positif ou négatif.',
  'Avis : « Colis abîmé. » → négatif',
  'Avis : « Parfait, merci ! » → positif',
  'Avis : « Jamais reçu. » → négatif',
];
const QUESTION = 'Avis : « Livraison rapide. » →';
const ETAPES = [
  { n: 1, lois: [0.35, 0.15, 0.5], t1: 'Zéro exemple : juste la consigne', t2: 'le modèle hésite, il pourrait continuer autrement' },
  { n: 2, lois: [0.6, 0.25, 0.15], t1: 'Un exemple : le format apparaît', t2: 'il comprend qu’on attend un seul mot' },
  { n: 4, lois: [0.85, 0.1, 0.05], t1: 'Trois exemples : la tâche est claire', t2: 'presque toute la probabilité va aux deux étiquettes' },
  { n: 4, lois: [0.85, 0.1, 0.05], t1: 'Aucun poids n’a changé', t2: 'efface les exemples : le modèle redevient le même' },
];
const NOMS = ['positif', 'négatif', 'autre suite'];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'un', 'trois', 'poids'][i], { k: i }]));

function gabarit() {
  return `
    <text x="4" y="12" class="svg-doux" font-size="10">le prompt envoyé au modèle</text>
    <rect x="0" y="18" width="340" height="96" rx="5" class="svg-entree" fill-opacity="0.08" />
    ${[0, 1, 2, 3, 4].map((i) => `<text x="8" y="${36 + i * 17}" class="svg-texte" font-size="10" style="font-family: var(--police-code)" data-l="${i}"></text>`).join('')}
    <text x="4" y="134" class="svg-doux" font-size="10">probabilité du mot suivant (valeurs inventées)</text>
    <g data-barres></g>
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="251" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  const lignes = [...LIGNES.slice(0, et.n), QUESTION];
  for (let i = 0; i < 5; i++) {
    const t = q(svg, `[data-l="${i}"]`);
    t.textContent = lignes[i] ?? '';
    t.setAttribute('font-weight', i === lignes.length - 1 ? '700' : '400');
  }
  q(svg, '[data-barres]').innerHTML = et.lois.map((p, i) => {
    const y = 142 + i * 24;
    return `<text x="4" y="${y + 13}" class="svg-texte" font-size="11">${NOMS[i]}</text>
      <rect x="86" y="${y}" width="200" height="16" rx="3" fill="none" class="svg-trait" />
      <rect x="86" y="${y}" width="${200 * p}" height="16" rx="3" class="${i === 0 ? 'svg-sortie' : 'svg-entree'}" fill-opacity="${i === 0 ? 1 : 0.35}" />
      <text x="336" y="${y + 13}" text-anchor="end" class="svg-texte" font-size="11">${fr(p, 2)}</text>`;
  }).join('');
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. Prompt : ${lignes.join(' / ')}. Probabilités : ${NOMS.map((n, i) => `${n} ${fr(et.lois[i], 2)}`).join(', ')}.`);
}
