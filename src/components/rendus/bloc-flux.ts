// Fiche « bloc-transformer » : un bloc d'encodeur (Vaswani et al., modèle de base) traversé de haut en bas.
// Formes : n × 512 partout, sauf au milieu du feed-forward (n × 2048). Deux connexions résiduelles.
import type { Etat } from '../animations/types';
import { svgDe, q, texte, fleche } from '../animations/svg';

export const fiche = 'bloc-transformer';

// Étapes du bloc : y du haut, hauteur, titre, forme, classe.
const ETAGES = [
  { y: 4, h: 26, t: 'entrée x', f: 'n × 512', c: 'svg-entree' },
  { y: 44, h: 30, t: 'attention multi-têtes', f: 'n × 512', c: 'svg-parametre' },
  { y: 88, h: 26, t: 'z = LayerNorm(x + attention)', f: 'n × 512', c: 'svg-entree' },
  { y: 128, h: 30, t: 'feed-forward 512 → 2048 → 512', f: 'n × 2048', c: 'svg-parametre' },
  { y: 172, h: 26, t: 'y = LayerNorm(z + FFN(z))', f: 'n × 512', c: 'svg-sortie' },
];
const BX = 40, BW = 206;

export const etats: Record<string, Etat> = { initial: { k: 0 }, attention: { k: 1 }, norme1: { k: 2 }, ffn: { k: 3 }, norme2: { k: 4 } };

function gabarit() {
  const boites = ETAGES.map((e, i) => `<g data-e="${i}">
    <rect x="${BX}" y="${e.y}" width="${BW}" height="${e.h}" rx="6" class="${e.c} svg-trait-entree" fill-opacity="0.14" stroke-width="1" />
    <text x="${BX + BW / 2}" y="${e.y + e.h / 2 + 4}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="600">${e.t}</text>
    <text x="${BX + BW + 8}" y="${e.y + e.h / 2 + 4}" class="svg-doux" font-size="9.5" style="font-family: var(--police-code)">${e.f}</text>
  </g>`).join('');
  return `${boites}
    <g data-v0></g><g data-v1></g><g data-v2></g><g data-v3></g>
    <path d="M${BX},17 C${BX - 30},17 ${BX - 30},101 ${BX},101" class="svg-ligne svg-trait-sortie" stroke-width="2" fill="none" data-r1 />
    <path d="M${BX},101 C${BX - 30},101 ${BX - 30},185 ${BX},185" class="svg-ligne svg-trait-sortie" stroke-width="2" fill="none" data-r2 />
    <rect x="0" y="52" width="26" height="14" rx="3" style="fill: var(--papier-2)" data-r1l />
    <text x="13" y="62" text-anchor="middle" class="svg-doux" font-size="9" data-r1l>+ x</text>
    <rect x="0" y="136" width="26" height="14" rx="3" style="fill: var(--papier-2)" data-r2l />
    <text x="13" y="146" text-anchor="middle" class="svg-doux" font-size="9" data-r2l>+ z</text>
    <text x="4" y="222" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="242" class="svg-doux" font-size="11" data-t2></text>`;
}

const TEXTES = [
  ['Un bloc, deux sous-couches', 'la forme n × 512 entre… et ressort'],
  ['1. Les mots s’échangent de l’information', 'self-attention multi-têtes sur toute la phrase'],
  ['2. Raccourci, puis normalisation', 'on ajoute x à la sortie de l’attention, puis LayerNorm'],
  ['3. Chaque mot est retravaillé seul', 'même petit réseau pour chaque position : 512 → 2048 → 512'],
  ['4. Raccourci, normalisation : même forme', 'la sortie n × 512 peut entrer dans le bloc suivant'],
];

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(4, Math.round(e.k)));
  ETAGES.forEach((_, i) => q(svg, `[data-e="${i}"] rect`).setAttribute('fill-opacity', k === 0 || i === k || (i === 0 && k === 1) ? '0.3' : '0.08'));
  // Flèches verticales entre les étages, arrêtées au bord des boîtes.
  for (let i = 0; i < 4; i++) {
    const a = ETAGES[i], b = ETAGES[i + 1];
    fleche(q(svg, `[data-v${i}]`), BX + BW / 2, a.y + a.h + 1, BX + BW / 2, b.y - 2, i + 1 === k ? 'sortie' : 'doux', i + 1 === k ? 2.5 : 1.4);
  }
  const r1 = k === 0 || k === 2, r2 = k === 0 || k === 4;
  svg.querySelectorAll('[data-r1], [data-r1l]').forEach((el) => el.setAttribute('opacity', r1 ? '1' : '0.25'));
  svg.querySelectorAll('[data-r2], [data-r2l]').forEach((el) => el.setAttribute('opacity', r2 ? '1' : '0.25'));
  const [t1, t2] = TEXTES[k];
  texte(svg, '[data-t1]', t1);
  texte(svg, '[data-t2]', t2);
  scene.setAttribute('aria-label', `${t1}. ${t2}.`);
}
