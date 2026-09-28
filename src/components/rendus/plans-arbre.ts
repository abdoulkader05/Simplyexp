// Fiche « planification-agent » : schéma statique. En haut, tous les plans de 3 étapes avec 3 actions
// possibles (3³ = 27 feuilles) ; en bas, la même tâche découpée en 3 sous-tâches d'une étape (3 × 3 = 9).
import type { Etat } from '../animations/types';
import { svgDe } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: {} };

function arbre(x0: number, largeur: number, y0: number, profondeur: number, dy: number) {
  let html = '';
  let niveau = [{ x: x0 + largeur / 2, y: y0 }];
  html += `<circle cx="${niveau[0].x}" cy="${y0}" r="3.5" class="svg-encre" />`;
  for (let d = 1; d <= profondeur; d++) {
    const n = 3 ** d, pas = largeur / n;
    const suivant = Array.from({ length: n }, (_, i) => ({ x: x0 + pas * (i + 0.5), y: y0 + d * dy }));
    suivant.forEach((p, i) => {
      const parent = niveau[Math.floor(i / 3)];
      html += `<line x1="${parent.x}" y1="${parent.y}" x2="${p.x}" y2="${p.y}" class="svg-trait-doux" stroke-width="1" />`;
    });
    suivant.forEach((p) => (html += `<circle cx="${p.x}" cy="${p.y}" r="${d === profondeur ? 2.8 : 3}" class="${d === profondeur ? 'svg-sortie' : 'svg-entree'}" />`));
    niveau = suivant;
  }
  return html;
}

function gabarit() {
  return `
    <text x="4" y="14" class="svg-texte" font-size="12" font-weight="700">Tout planifier d’un bloc : 3 × 3 × 3 = 27 plans</text>
    ${arbre(4, 332, 28, 3, 30)}
    <text x="4" y="138" class="svg-doux" font-size="10">chaque feuille est un plan complet à évaluer</text>
    <line x1="0" y1="150" x2="340" y2="150" class="svg-trait" />
    <text x="4" y="170" class="svg-texte" font-size="12" font-weight="700">Découper en 3 sous-tâches : 3 + 3 + 3 = 9 choix</text>
    ${arbre(10, 96, 184, 1, 32)}${arbre(122, 96, 184, 1, 32)}${arbre(234, 96, 184, 1, 32)}
    <text x="58" y="236" text-anchor="middle" class="svg-doux" font-size="10">sous-tâche 1</text>
    <text x="170" y="236" text-anchor="middle" class="svg-doux" font-size="10">sous-tâche 2</text>
    <text x="282" y="236" text-anchor="middle" class="svg-doux" font-size="10">sous-tâche 3</text>
    <text x="4" y="256" class="svg-doux" font-size="10">on choisit la meilleure action de chaque sous-tâche, l’une après l’autre</text>`;
}

export function dessiner(scene: HTMLElement) {
  svgDe(scene, 340, 262, gabarit);
  scene.setAttribute('aria-label', 'En haut, un arbre de trois niveaux avec trois choix par niveau : 27 plans complets. En bas, trois petits arbres d’un niveau : 9 choix en tout, faits sous-tâche par sous-tâche.');
}
