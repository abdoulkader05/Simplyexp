// Fiche « bloc-transformer » : schéma statique de l'encodeur de base de Vaswani et al. :
// embeddings + encodage positionnel, puis N = 6 blocs identiques empilés, chacun n × 512 → n × 512.
import type { Etat } from '../animations/types';
import { svgDe, q, fleche } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: { k: 0 } };

const X = 70, W = 150, H = 22, Y_BAS = 196;

function gabarit() {
  let blocs = '';
  for (let i = 0; i < 6; i++) {
    const y = Y_BAS - 36 - i * (H + 5);
    // Petits plots sur le dessus : la brique qu'on emboîte.
    const plots = [0.25, 0.5, 0.75].map((f) => `<rect x="${X + W * f - 9}" y="${y - 4}" width="18" height="5" rx="2" class="svg-parametre" fill-opacity="0.45" />`).join('');
    blocs += `${plots}<rect x="${X}" y="${y}" width="${W}" height="${H}" rx="4" class="svg-parametre svg-trait-parametre" fill-opacity="0.2" stroke-width="1" />
      <text x="${X + W / 2}" y="${y + 15}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="600">bloc ${i + 1}</text>`;
  }
  return `
    <text x="${X + W / 2}" y="14" text-anchor="middle" class="svg-texte" font-size="11.5" font-weight="700">vecteurs contextuels : n × 512</text>
    ${blocs}
    <rect x="${X}" y="${Y_BAS}" width="${W}" height="${H + 6}" rx="4" class="svg-entree svg-trait-entree" fill-opacity="0.18" stroke-width="1" />
    <text x="${X + W / 2}" y="${Y_BAS + 12}" text-anchor="middle" class="svg-texte" font-size="10">embeddings des tokens</text>
    <text x="${X + W / 2}" y="${Y_BAS + 24}" text-anchor="middle" class="svg-texte" font-size="10">+ encodage positionnel</text>
    <text x="${X + W / 2}" y="${Y_BAS + 48}" text-anchor="middle" class="svg-doux" font-size="10">tokens de la phrase</text>
    <g data-f1></g>
    <text x="${X + W + 10}" y="100" class="svg-doux" font-size="10">N = 6 blocs</text>
    <text x="${X + W + 10}" y="114" class="svg-doux" font-size="10">identiques,</text>
    <text x="${X + W + 10}" y="128" class="svg-doux" font-size="10">poids différents</text>
    <text x="${X + W + 10}" y="150" class="svg-doux" font-size="10" style="font-family: var(--police-code)">n×512 → n×512</text>`;
}

export function dessiner(scene: HTMLElement) {
  const svg = svgDe(scene, 340, 262, gabarit);
  fleche(q(svg, '[data-f1]'), X + W / 2, Y_BAS + 38, X + W / 2, Y_BAS + H + 9, 'doux', 1.4);
  scene.setAttribute('aria-label', 'Schéma de l’encodeur : les tokens deviennent des embeddings auxquels on ajoute l’encodage positionnel, puis traversent six blocs identiques empilés, qui gardent tous la forme n × 512, jusqu’aux vecteurs contextuels.');
}
