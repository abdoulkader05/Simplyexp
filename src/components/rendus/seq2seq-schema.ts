// Schéma statique : ce que reçoit le décodeur à l'entraînement (la vraie traduction) et à la génération (ses propres sorties).
import type { Etat } from '../animations/types';
import { svgDe } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: {} };

const X = (i: number) => 104 + i * 60;
function ligne(y: number, titre: string, entrees: string[], sorties: string[], boucle: boolean) {
  let s = `<text x="4" y="${y - 44}" class="svg-texte" font-size="11.5" font-weight="700">${titre}</text>
    <rect x="${X(0) - 26}" y="${y - 12}" width="${X(3) - X(0) + 52}" height="24" rx="5" class="svg-parametre" opacity=".18" />
    <text x="4" y="${y + 4}" class="svg-doux" font-size="10">décodeur</text>
    <text x="4" y="${y + 34}" class="svg-doux" font-size="10">reçoit</text>
    <text x="4" y="${y - 22}" class="svg-doux" font-size="10">prédit</text>`;
  entrees.forEach((m, i) => {
    s += `<text x="${X(i)}" y="${y + 34}" text-anchor="middle" class="svg-texte" font-size="11" ${boucle && i > 0 ? 'font-style="italic"' : ''}>${m}</text>
      <line x1="${X(i)}" y1="${y + 24}" x2="${X(i)}" y2="${y + 13}" class="svg-trait-doux" stroke-width="1.2" />
      <text x="${X(i)}" y="${y - 22}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="700">${sorties[i]}</text>
      <line x1="${X(i)}" y1="${y - 13}" x2="${X(i)}" y2="${y - 18}" class="svg-trait-doux" stroke-width="1.2" />`;
    if (boucle && i < 3) s += `<path d="M ${X(i) + 14} ${y - 26} C ${X(i) + 40} ${y - 26}, ${X(i) + 34} ${y + 30}, ${X(i + 1) - 16} ${y + 30}" fill="none" class="svg-trait-sortie" stroke-width="1.6" stroke-dasharray="3 3" />`;
  });
  return s;
}

function gabarit() {
  return ligne(68, 'Entraînement : on lui donne la vraie traduction', ['‹début›', 'it', 'is', 'raining'], ['it', 'is', 'raining', '.'], false)
    + ligne(180, 'Génération : il se nourrit de ses propres sorties', ['‹début›', 'it', 'is', 'raining'], ['it', 'is', 'raining', '.'], true)
    + `<text x="4" y="252" class="svg-doux" font-size="10.5">en pointillé : chaque mot prédit devient l’entrée du pas suivant</text>`;
}

export function dessiner(scene: HTMLElement, _e: Etat) {
  svgDe(scene, 340, 262, gabarit);
}
