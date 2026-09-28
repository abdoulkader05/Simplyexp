// Fiche « react-agent » : une trajectoire Pensée → Action → Observation, ligne après ligne.
// Question : « Dans quel pays est né le créateur du langage Python ? » (Wikipédia : La Haye, Pays-Bas).
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'react-agent';

type Ligne = { type: 'pensee' | 'action' | 'obs'; t: string };
const TRACE: Ligne[] = [
  { type: 'pensee', t: 'Trouver d’abord qui a créé Python.' },
  { type: 'action', t: 'chercher[Python (langage)]' },
  { type: 'obs', t: '… créé par Guido van Rossum …' },
  { type: 'pensee', t: 'Chercher maintenant où il est né.' },
  { type: 'action', t: 'chercher[Guido van Rossum]' },
  { type: 'obs', t: '… né à La Haye, aux Pays-Bas …' },
  { type: 'action', t: 'terminer[Pays-Bas]' },
];
const LIB = { pensee: 'Pensée', action: 'Action', obs: 'Observation' };
const CLASSE = { pensee: 'svg-entree', action: 'svg-sortie', obs: 'svg-parametre' };
// Nombre de lignes visibles à chaque étape du défilement.
const VISIBLES = [0, 2, 3, 6, 7];
const LEGENDES = [
  ['La question arrive', 'le modèle ne connaît pas la réponse de mémoire, ou pas sûrement'],
  ['Il pense, puis il agit', 'la pensée dit quoi chercher, l’action le cherche'],
  ['Le monde répond', 'l’observation est un vrai texte, pas une invention du modèle'],
  ['Deuxième tour', 'la nouvelle pensée s’appuie sur ce qui vient d’être lu'],
  ['Il termine', 'la réponse repose sur deux observations vérifiables'],
];

export const etats: Record<string, Etat> = Object.fromEntries(VISIBLES.map((_, i) => [['initial', 'tour1', 'obs1', 'tour2', 'fin'][i], { k: i }]));

function gabarit() {
  return `
    <text x="4" y="16" class="svg-texte" font-size="12" font-weight="700">« Dans quel pays est né le créateur de Python ? »</text>
    ${TRACE.map((_, i) => `<g data-l="${i}"></g>`).join('')}
    <text x="4" y="236" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="254" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(VISIBLES.length - 1, Math.round(e.k)));
  const n = VISIBLES[k];
  const nPrec = k ? VISIBLES[k - 1] : 0;
  TRACE.forEach((l, i) => {
    const y = 30 + i * 27;
    const g = q(svg, `[data-l="${i}"]`);
    if (i >= n) { g.innerHTML = ''; return; }
    const neuf = i >= nPrec;
    g.innerHTML = `
      <rect x="0" y="${y}" width="340" height="23" rx="4" class="${CLASSE[l.type]}" fill-opacity="${neuf ? 0.22 : 0.08}" />
      <rect x="0" y="${y}" width="4" height="23" class="${CLASSE[l.type]}" />
      <text x="10" y="${y + 15.5}" class="svg-doux" font-size="10" font-weight="700">${LIB[l.type]}</text>
      <text x="84" y="${y + 15.5}" class="svg-texte" font-size="${l.type === 'action' ? 10.5 : 11}"${l.type === 'action' ? ' style="font-family: var(--police-code)"' : ''}>${l.t}</text>`;
  });
  texte(svg, '[data-t1]', LEGENDES[k][0]);
  texte(svg, '[data-t2]', LEGENDES[k][1]);
  scene.setAttribute('aria-label', `${LEGENDES[k][0]}. ${TRACE.slice(0, n).map((l) => `${LIB[l.type]} : ${l.t}`).join('. ')}`);
}
