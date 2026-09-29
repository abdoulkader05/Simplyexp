// Fiche « dpo » : schéma statique. En haut, le RLHF (modèle de récompense puis renforcement avec
// échantillonnage) ; en bas, DPO (une seule perte sur les paires de préférences).
import type { Etat } from '../animations/types';
import { svgDe, q, fleche } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: { k: 0 } };

function boite(x: number, y: number, l: number, lignes: string[], classe = 'svg-entree', op = 0.16) {
  const h = 16 + lignes.length * 13;
  return `<rect x="${x}" y="${y}" width="${l}" height="${h}" rx="5" class="${classe}" fill-opacity="${op}" />`
    + lignes.map((t, i) => `<text x="${x + l / 2}" y="${y + 18 + i * 13}" text-anchor="middle" class="svg-texte" font-size="10">${t}</text>`).join('');
}

function gabarit() {
  return `
    <text x="4" y="14" class="svg-texte" font-size="11.5" font-weight="700">RLHF : trois modèles, une boucle de renforcement</text>
    ${boite(0, 24, 74, ['préférences'])}
    ${boite(88, 24, 74, ['modèle de', 'récompense'], 'svg-parametre', 0.22)}
    ${boite(176, 24, 74, ['générer', 'et noter'], 'svg-perte', 0.14)}
    ${boite(264, 24, 76, ['modèle', 'aligné'], 'svg-fond-sortie', 1)}
    <text x="213" y="86" text-anchor="middle" class="svg-doux" font-size="9.5">+ pénalité KL, en boucle</text>
    <g data-a1></g><g data-a2></g><g data-a3></g>
    <line x1="0" y1="104" x2="340" y2="104" class="svg-trait" />
    <text x="4" y="126" class="svg-texte" font-size="11.5" font-weight="700">DPO : une perte, comme une classification</text>
    ${boite(0, 136, 74, ['préférences'])}
    ${boite(106, 136, 126, ['perte DPO : modèle', 'contre référence'], 'svg-parametre', 0.22)}
    ${boite(264, 136, 76, ['modèle', 'aligné'], 'svg-fond-sortie', 1)}
    <g data-b1></g><g data-b2></g>
    <text x="4" y="206" class="svg-doux" font-size="10.5">ni modèle de récompense séparé, ni échantillonnage</text>
    <text x="4" y="222" class="svg-doux" font-size="10.5">pendant l’entraînement : un fine-tuning ordinaire</text>`;
}

export function dessiner(scene: HTMLElement) {
  const svg = svgDe(scene, 340, 262, gabarit);
  fleche(q(svg, '[data-a1]'), 74, 45, 88, 45, 'doux', 1.5);
  fleche(q(svg, '[data-a2]'), 162, 45, 176, 45, 'doux', 1.5);
  fleche(q(svg, '[data-a3]'), 250, 45, 264, 45, 'doux', 1.5);
  fleche(q(svg, '[data-b1]'), 74, 157, 106, 157, 'doux', 1.5);
  fleche(q(svg, '[data-b2]'), 232, 157, 264, 157, 'sortie', 2);
  scene.setAttribute('aria-label', 'RLHF : préférences, puis modèle de récompense, puis génération et notation en boucle avec pénalité KL, puis modèle aligné. DPO : préférences, puis une perte directe calculée avec le modèle et un modèle de référence, puis modèle aligné.');
}
