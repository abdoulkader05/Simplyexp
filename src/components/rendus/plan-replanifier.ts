// Fiche « planification-agent » : un plan en sous-tâches, un échec observé, une replanification.
// Tâche et imprévu inventés pour l'illustration.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'planification-agent';

type Statut = 'attente' | 'cours' | 'fait' | 'echec' | 'neuf';
const PLAN_A = ['Réserver une salle', 'Commander le gâteau (samedi)', 'Inviter les 20 amis', 'Confirmer le nombre d’invités'];
const PLAN_B = ['Réserver une salle', 'Commander le gâteau (vendredi)', 'Inviter les 20 amis', 'Confirmer le nombre d’invités'];
const ETAPES: { plan: string[]; statuts: Statut[]; t1: string; t2: string }[] = [
  { plan: [], statuts: [], t1: 'L’objectif', t2: '« Organise un anniversaire surprise samedi, 20 personnes. »' },
  { plan: PLAN_A, statuts: ['attente', 'attente', 'attente', 'attente'], t1: 'D’abord, un plan en sous-tâches', t2: 'le modèle découpe avant d’agir' },
  { plan: PLAN_A, statuts: ['fait', 'cours', 'attente', 'attente'], t1: 'Exécution, sous-tâche par sous-tâche', t2: 'salle réservée ; on passe au gâteau' },
  { plan: PLAN_A, statuts: ['fait', 'echec', 'attente', 'attente'], t1: 'Observation : la pâtisserie ferme le samedi', t2: 'le plan initial ne peut plus aboutir' },
  { plan: PLAN_B, statuts: ['fait', 'neuf', 'attente', 'attente'], t1: 'Replanification', t2: 'seule la sous-tâche en échec est réécrite' },
  { plan: PLAN_B, statuts: ['fait', 'fait', 'fait', 'fait'], t1: 'Toutes les sous-tâches sont faites', t2: 'le plan a changé une fois, l’objectif jamais' },
];
const SYMBOLE: Record<Statut, string> = { attente: '○', cours: '▶', fait: '✓', echec: '✗', neuf: '↻' };
const CLASSE: Record<Statut, string> = { attente: 'svg-doux', cours: 'svg-entree', fait: 'svg-parametre', echec: 'svg-perte', neuf: 'svg-sortie' };

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'plan', 'execution', 'echec', 'replan', 'fin'][i], { k: i }]));

function gabarit() {
  return `
    <text x="4" y="18" class="svg-doux" font-size="10">plan de l’agent</text>
    ${[0, 1, 2, 3].map((i) => `<g data-p="${i}"></g>`).join('')}
    <text x="4" y="204" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="226" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  [0, 1, 2, 3].forEach((i) => {
    const g = q(svg, `[data-p="${i}"]`);
    if (!et.plan.length) { g.innerHTML = ''; return; }
    const s = et.statuts[i];
    const y = 28 + i * 40;
    const fond = s === 'echec' ? 'svg-perte' : s === 'neuf' ? 'svg-sortie' : s === 'cours' ? 'svg-entree' : 'svg-entree';
    const fo = s === 'echec' || s === 'neuf' ? 0.2 : s === 'cours' ? 0.18 : 0.07;
    g.innerHTML = `
      <rect x="0" y="${y}" width="340" height="32" rx="5" class="${fond}" fill-opacity="${fo}" />
      <text x="12" y="${y + 21}" class="svg-doux" font-size="11" font-weight="700">${i + 1}.</text>
      <text x="32" y="${y + 21}" class="svg-texte" font-size="12"${s === 'echec' ? ' text-decoration="line-through"' : ''}>${et.plan[i]}</text>
      <text x="324" y="${y + 22}" text-anchor="end" class="${CLASSE[s]}" font-size="15" font-weight="700">${SYMBOLE[s]}</text>`;
  });
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}. ${et.plan.map((p, i) => `${i + 1}. ${p} : ${et.statuts[i]}`).join(', ')}`);
}
