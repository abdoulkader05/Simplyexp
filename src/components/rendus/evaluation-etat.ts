// Fiche « evaluation-agents » : schéma statique. On juge l'état final du monde, comparé à l'état
// attendu, et non le texte de la réponse (principe de τ-bench : état de la base contre état annoté).
import type { Etat } from '../animations/types';
import { svgDe, q, fleche } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: {} };

const boite = (x: number, y: number, l: number, h: number, lignes: string[], classe: string) => `
  <rect x="${x}" y="${y}" width="${l}" height="${h}" rx="6" class="svg-${classe} svg-trait-${classe}" fill-opacity="0.15" stroke-width="1.3" />
  ${lignes.map((t, i) => `<text x="${x + l / 2}" y="${y + h / 2 + 4 + (i - (lignes.length - 1) / 2) * 14}" text-anchor="middle" class="svg-texte" font-size="11"${i === 0 ? ' font-weight="700"' : ''}>${t}</text>`).join('')}`;

function gabarit() {
  return `
    ${boite(4, 14, 96, 44, ['tâche', 'changer un vol'], 'entree')}
    ${boite(122, 14, 96, 44, ['agent', 'outils + boucle'], 'sortie')}
    ${boite(240, 14, 96, 44, ['état final', 'base de données'], 'parametre')}
    ${boite(240, 96, 96, 44, ['état attendu', 'annoté avant'], 'encre')}
    ${boite(122, 96, 96, 44, ['comparaison', 'identiques ?'], 'encre')}
    ${boite(4, 96, 96, 44, ['verdict', 'réussi / raté'], 'perte')}
    <g data-f1></g><g data-f2></g><g data-f3></g><g data-f4></g><g data-f5></g>
    <line x1="0" y1="160" x2="340" y2="160" class="svg-trait" />
    <text x="4" y="182" class="svg-texte" font-size="11">« Votre vol a bien été changé ! » ne prouve rien :</text>
    <text x="4" y="200" class="svg-texte" font-size="11">seule la base de données dit si c’est vrai.</text>
    <text x="4" y="226" class="svg-doux" font-size="10.5">Deux conversations différentes qui mènent au même</text>
    <text x="4" y="242" class="svg-doux" font-size="10.5">état final comptent toutes deux comme réussies.</text>`;
}

export function dessiner(scene: HTMLElement) {
  const svg = svgDe(scene, 340, 262, gabarit);
  fleche(q(svg, '[data-f1]'), 101, 36, 120, 36, 'doux', 1.6);
  fleche(q(svg, '[data-f2]'), 219, 36, 238, 36, 'doux', 1.6);
  fleche(q(svg, '[data-f3]'), 288, 59, 222, 100, 'doux', 1.6);
  fleche(q(svg, '[data-f4]'), 239, 118, 220, 118, 'doux', 1.6);
  fleche(q(svg, '[data-f5]'), 121, 118, 102, 118, 'doux', 1.6);
  scene.setAttribute('aria-label', 'La tâche est confiée à l’agent, qui modifie un état final, une base de données. On le compare à un état attendu annoté à l’avance ; le verdict dit réussi ou raté. Le texte de la réponse ne compte pas.');
}
