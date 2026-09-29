// Fiche « multi-head » : schéma statique avec les dimensions du modèle de base de Vaswani et al.
// (d_model = 512, h = 8, d_k = d_v = 64) : X → 8 têtes en parallèle → concaténation → W_O → sortie.
import type { Etat } from '../animations/types';
import { svgDe, q, fleche } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: { k: 0 } };

const TETES = [
  { x: 6, t: 'tête 1' }, { x: 90, t: 'tête 2' }, { x: 174, t: '…' }, { x: 258, t: 'tête 8' },
];

function boite(x: number, y: number, l: number, h: number, t1: string, t2: string, classe: string) {
  return `<rect x="${x}" y="${y}" width="${l}" height="${h}" rx="6" class="${classe} svg-trait-entree" fill-opacity="0.16" stroke-width="1.2" />
    <text x="${x + l / 2}" y="${y + 17}" text-anchor="middle" class="svg-texte" font-size="11.5" font-weight="700">${t1}</text>
    <text x="${x + l / 2}" y="${y + 31}" text-anchor="middle" class="svg-doux" font-size="10" style="font-family: var(--police-code)">${t2}</text>`;
}

function gabarit() {
  return `
    ${boite(100, 4, 140, 38, 'entrée X', 'n × 512', 'svg-entree')}
    ${TETES.map((h) => h.t === '…'
      ? `<text x="${h.x + 38}" y="${88}" text-anchor="middle" class="svg-texte" font-size="16">…</text>`
      : boite(h.x, 64, 76, 44, h.t, 'n × 64', 'svg-parametre')).join('')}
    ${boite(70, 134, 200, 38, 'concaténation', 'n × (8 × 64) = n × 512', 'svg-entree')}
    ${boite(100, 190, 140, 38, '× W_O', '512 × 512', 'svg-sortie')}
    <text x="170" y="252" text-anchor="middle" class="svg-doux" font-size="10.5">sortie : n × 512, même forme que l’entrée</text>
    <g data-f0></g><g data-f1></g><g data-f2></g><g data-f3></g>
    <g data-g0></g><g data-g1></g><g data-g2></g><g data-g3></g>
    <g data-h></g>`;
}

export function dessiner(scene: HTMLElement) {
  const svg = svgDe(scene, 340, 262, gabarit);
  TETES.forEach((h, i) => {
    const cx = h.x + 38;
    if (h.t === '…') return;
    fleche(q(svg, `[data-f${i}]`), 170 + (cx - 170) * 0.35, 43, cx, 62, 'doux', 1.4);
    fleche(q(svg, `[data-g${i}]`), cx, 109, 170 + (cx - 170) * 0.55, 132, 'doux', 1.4);
  });
  fleche(q(svg, '[data-h]'), 170, 173, 170, 188, 'doux', 1.6);
  scene.setAttribute('aria-label', 'Schéma de l’attention multi-têtes : l’entrée X de taille n × 512 alimente 8 têtes en parallèle, chacune de sortie n × 64 ; on les concatène en n × 512, puis on multiplie par W_O de taille 512 × 512.');
}
