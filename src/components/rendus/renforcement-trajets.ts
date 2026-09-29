// Fiche « apprentissage-renforcement » : trois itinéraires, des essais, des estimations qui se précisent.
// Récompense = − durée en minutes. Durées inventées pour l'illustration.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'apprentissage-renforcement';

const NOMS = ['A', 'B', 'C'];
// Pour chaque étape : durées observées par itinéraire, et l'itinéraire joué à cette étape.
const ETAPES = [
  { obs: [[], [], []], joue: -1, mode: '', t1: 'Trois itinéraires, aucune information', t2: 'l’agent ne connaît pas les durées moyennes' },
  { obs: [[38], [33], [36]], joue: -1, mode: 'explorer', t1: 'Explorer : essayer chacun une fois', t2: 'récompense = − durée ; B semble le meilleur' },
  { obs: [[38], [33, 29], [36]], joue: 1, mode: 'exploiter', t1: 'Exploiter : reprendre le meilleur estimé', t2: 'B : 29 min, son estimation passe à − 31' },
  { obs: [[38], [33, 29], [36, 44]], joue: 2, mode: 'explorer', t1: 'Explorer encore, de temps en temps', t2: 'C était chanceux la première fois : − 40' },
  { obs: [[38, 34], [33, 29, 31], [36, 44]], joue: 1, mode: 'exploiter', t1: 'Les estimations se précisent', t2: 'la politique : prendre B presque toujours' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'explorer', 'exploiter', 'explorer2', 'bilan'][i], { k: i }]));

const moyenne = (t: number[]) => t.reduce((s, x) => s + x, 0) / t.length;

function gabarit() {
  return `
    <text x="4" y="14" class="svg-doux" font-size="10">itinéraire · durées observées (min) · estimation de la récompense</text>
    <g data-lignes></g>
    <text x="4" y="186" class="svg-doux" font-size="10" data-mode></text>
    <text x="4" y="226" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="245" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  const estim = et.obs.map((o) => (o.length ? -moyenne(o) : null));
  const valides = estim.filter((x): x is number => x !== null);
  const meilleur = valides.length ? estim.indexOf(Math.max(...valides)) : -1;
  q(svg, '[data-lignes]').innerHTML = NOMS.map((n, i) => {
    const y = 26 + i * 50;
    const est = estim[i];
    const largeur = est === null ? 0 : (Math.abs(est) / 45) * 110;
    const actif = i === et.joue;
    return `
      <rect x="0" y="${y}" width="340" height="42" rx="5" class="${actif ? 'svg-fond-sortie' : 'svg-entree'}" fill-opacity="${actif ? 1 : 0.08}" />
      <text x="10" y="${y + 27}" class="svg-texte" font-size="16" font-weight="700">${n}</text>
      <text x="36" y="${y + 26}" class="svg-texte" font-size="11" style="font-family: var(--police-code)">${et.obs[i].join(', ') || '—'}</text>
      <rect x="170" y="${y + 13}" width="${largeur}" height="16" rx="3" class="svg-perte" fill-opacity="${i === meilleur ? 0.9 : 0.35}" />
      <text x="336" y="${y + 26}" text-anchor="end" class="svg-texte" font-size="11" font-weight="${i === meilleur ? 700 : 400}">${est === null ? '?' : `− ${Math.abs(est).toFixed(0)}`}</text>`;
  }).join('');
  texte(svg, '[data-mode]', et.mode ? `ce tour : ${et.mode}${et.joue >= 0 ? ` (itinéraire ${NOMS[et.joue]})` : ''}` : '');
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${NOMS.map((n, i) => `${n} : ${estim[i] === null ? 'inconnu' : `estimation ${estim[i]!.toFixed(0)}`}`).join(', ')}.`);
}
