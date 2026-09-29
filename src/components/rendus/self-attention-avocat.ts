// Fiche « self-attention » : le même mot « avocat » (1 ; 1) change de sens selon la phrase.
// Axes inventés : justice (x), nourriture (y). « plaide » = (3 ; 0), « mûrit » = (0 ; 3).
// Projections identité, d_k = 2 : poids de la ligne « avocat » ≈ (0,33 ; 0,67),
// sorties ≈ (2,34 ; 0,33) dans « avocat plaide » et (0,33 ; 2,34) dans « avocat mûrit ».
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, fleche } from '../animations/svg';

export const fiche = 'self-attention';

const OX = 30, OY = 170, U = 40;
const px = (x: number) => OX + x * U, py = (y: number) => OY - y * U;
const A = [0.3302, 0.6698], B = [0.0142, 0.9858];
const S1 = [2.3395, 0.3302], S2 = [0.3302, 2.3395];

export const etats: Record<string, Etat> = {
  initial: { k: 0 }, poids1: { k: 1 }, sortie1: { k: 2 }, phrase2: { k: 3 }, compare: { k: 4 },
};

function point(x: number, y: number, classe: string, nom: string, dx = 6, dy = -6, ancre = 'start') {
  return `<circle cx="${px(x)}" cy="${py(y)}" r="5" class="${classe}" />
    <text x="${px(x) + dx}" y="${py(y) + dy}" text-anchor="${ancre}" class="svg-texte" font-size="11">${nom}</text>`;
}

function gabarit() {
  return `
    <line x1="${OX}" y1="${OY}" x2="${px(3.4)}" y2="${OY}" class="svg-trait-doux" stroke-width="1.5" />
    <line x1="${OX}" y1="${OY}" x2="${OX}" y2="${py(3.4)}" class="svg-trait-doux" stroke-width="1.5" />
    <text x="${px(3.4)}" y="${OY + 16}" text-anchor="end" class="svg-doux" font-size="10">justice →</text>
    <text x="${OX - 4}" y="${py(3.4) - 6}" class="svg-doux" font-size="10">↑ nourriture</text>
    <g data-plaide>${point(3, 0, 'svg-entree', 'plaide', 8, 4)}</g>
    <g data-murit>${point(0, 3, 'svg-entree', 'mûrit', 9, 4)}</g>
    ${point(1, 1, 'svg-encre', 'avocat', 8, 12)}
    <g data-f1></g><g data-f2></g>
    <g data-s1><circle cx="${px(S1[0])}" cy="${py(S1[1])}" r="5" class="svg-sortie" /></g>
    <g data-s2><circle cx="${px(S2[0])}" cy="${py(S2[1])}" r="5" class="svg-sortie" /></g>
    <text x="190" y="24" class="svg-texte" font-size="12" font-weight="700" data-phrase></text>
    <text x="190" y="42" class="svg-doux" font-size="10">poids (une ligne par mot)</text>
    <g data-matrice></g>
    <text x="4" y="212" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="232" class="svg-doux" font-size="11" data-t2></text>
    <text x="4" y="250" class="svg-doux" font-size="11" data-t3></text>`;
}

function matrice(autre: string) {
  const mots = ['avocat', autre];
  const lignes = [A, B];
  const X0 = 238, Y0 = 70, L = 48, H = 30;
  let html = mots.map((m, j) => `<text x="${X0 + j * L + L / 2}" y="${Y0 - 6}" text-anchor="middle" class="svg-doux" font-size="10">${m}</text>`).join('');
  lignes.forEach((ligne, i) => {
    html += `<text x="${X0 - 6}" y="${Y0 + i * H + 19}" text-anchor="end" class="svg-texte" font-size="11">${mots[i]}</text>`;
    ligne.forEach((p, j) => {
      html += `<rect x="${X0 + j * L + 1}" y="${Y0 + i * H + 1}" width="${L - 2}" height="${H - 2}" rx="3" class="svg-sortie" fill-opacity="${0.12 + 0.6 * p}" />
        <text x="${X0 + j * L + L / 2}" y="${Y0 + i * H + 19}" text-anchor="middle" class="svg-texte" font-size="11">${fr(p, 2)}</text>`;
    });
  });
  return html;
}

const TEXTES = [
  ['Le même vecteur dans deux phrases', '« avocat » part de (1 ; 1) : ni justice, ni nourriture', 'dans « avocat plaide » comme dans « avocat mûrit »'],
  ['« avocat plaide » : chaque mot interroge l’autre', 'la ligne « avocat » donne 0,67 à « plaide »', 'et 0,33 à lui-même'],
  ['La sortie penche vers la justice', 'avocat → 0,33 × (1 ; 1) + 0,67 × (3 ; 0)', '≈ (2,34 ; 0,33)'],
  ['« avocat mûrit » : mêmes poids, autre voisin', 'avocat → 0,33 × (1 ; 1) + 0,67 × (0 ; 3)', '≈ (0,33 ; 2,34)'],
  ['Un mot, deux sens', 'la self-attention a rendu « avocat » contextuel', 'sans aucune règle écrite à la main'],
];

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(4, Math.round(e.k)));
  const phrase2 = k === 3;
  q(svg, '[data-plaide]').setAttribute('opacity', k === 3 ? '0.25' : '1');
  q(svg, '[data-murit]').setAttribute('opacity', k === 1 || k === 2 ? '0.25' : '1');
  const s1 = k === 2 || k === 4, s2 = k >= 3;
  q(svg, '[data-s1]').setAttribute('opacity', s1 ? '1' : '0');
  q(svg, '[data-s2]').setAttribute('opacity', s2 ? '1' : '0');
  // Flèches de (1 ; 1) vers les sorties, arrêtées avant les points.
  const vers = (g: Element, cible: number[], on: boolean) => {
    const x1 = px(1), y1 = py(1), x2 = px(cible[0]), y2 = py(cible[1]);
    const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d;
    if (on) fleche(g, x1 + ux * 8, y1 + uy * 8, x2 - ux * 8, y2 - uy * 8, 'sortie', 2.5);
    else g.innerHTML = '';
  };
  vers(q(svg, '[data-f1]'), S1, s1);
  vers(q(svg, '[data-f2]'), S2, s2);
  texte(svg, '[data-phrase]', k === 0 ? '' : k === 4 ? 'deux phrases' : phrase2 ? '« avocat mûrit »' : '« avocat plaide »');
  q(svg, '[data-matrice]').innerHTML = k === 0 || k === 4 ? '' : matrice(phrase2 ? 'mûrit' : 'plaide');
  const [t1, t2, t3] = TEXTES[k];
  texte(svg, '[data-t1]', t1);
  texte(svg, '[data-t2]', t2);
  texte(svg, '[data-t3]', t3);
  scene.setAttribute('aria-label', `${t1}. ${t2} ${t3}`);
}
