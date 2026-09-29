// Fiche « masque-causal » : scores (déjà divisés par √d_k) de « Le chat dort », inventés pour l'exemple :
// [[1, 2, 0], [0, 1, 3], [1, 0, 1]]. Masque : −∞ au-dessus de la diagonale.
// Poids : [[1, 0, 0], [0,27, 0,73, 0], [0,42, 0,16, 0,42]].
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'masque-causal';

const MOTS = ['Le', 'chat', 'dort'];
const CIBLES = ['chat', 'dort', '« . »'];
const S = [[1, 2, 0], [0, 1, 3], [1, 0, 1]];
const P = [[1, 0, 0], [0.2689, 0.7311, 0], [0.4223, 0.1554, 0.4223]];
const X0 = 96, Y0 = 62, L = 58, H = 36;

export const etats: Record<string, Etat> = { initial: { k: 0 }, scores: { k: 1 }, masque: { k: 2 }, poids: { k: 3 }, ligne: { k: 4 } };

function gabarit() {
  let html = MOTS.map((m, j) => `<text x="${X0 + j * L + L / 2}" y="${Y0 - 8}" text-anchor="middle" class="svg-doux" font-size="10.5">${m}</text>`).join('');
  html += `<text x="${X0 + 1.5 * L}" y="${Y0 - 24}" text-anchor="middle" class="svg-doux" font-size="9.5">mot regardé (clé)</text>`;
  html += `<text x="${X0 + 3 * L + 8}" y="${Y0 - 8}" class="svg-doux" font-size="9.5">doit prédire</text>`;
  MOTS.forEach((m, i) => {
    html += `<rect x="0" y="${Y0 + i * H}" width="340" height="${H}" rx="4" class="svg-entree" fill-opacity="0" data-bande="${i}" />`;
    html += `<text x="${X0 - 8}" y="${Y0 + i * H + 22}" text-anchor="end" class="svg-texte" font-size="12" font-weight="600">${m}</text>`;
    html += `<text x="${X0 + 3 * L + 8}" y="${Y0 + i * H + 22}" class="svg-parametre" font-size="11.5">→ ${CIBLES[i]}</text>`;
    S[i].forEach((_, j) => {
      html += `<rect x="${X0 + j * L + 2}" y="${Y0 + i * H + 2}" width="${L - 4}" height="${H - 4}" rx="4" class="svg-trait" fill="none" stroke-width="1.2" />
        <rect x="${X0 + j * L + 2}" y="${Y0 + i * H + 2}" width="${L - 4}" height="${H - 4}" rx="4" data-fond="${i}${j}" />
        <text x="${X0 + j * L + L / 2}" y="${Y0 + i * H + 23}" text-anchor="middle" class="svg-texte" font-size="12" data-v="${i}${j}"></text>`;
    });
  });
  html += `<text x="4" y="${Y0 + 1.5 * H - 30}" class="svg-doux" font-size="9.5">mot qui</text><text x="4" y="${Y0 + 1.5 * H - 18}" class="svg-doux" font-size="9.5">regarde</text>`;
  return html + `
    <text x="4" y="200" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="220" class="svg-doux" font-size="11" data-t2></text>
    <text x="4" y="240" class="svg-doux" font-size="11" data-t3></text>`;
}

const TEXTES = [
  ['Entraîner sur « Le chat dort . »', 'chaque position doit prédire le mot suivant', 'sans avoir le droit de le regarder'],
  ['Les scores, sans précaution', 'la ligne « Le » donne 2 à « chat » :', 'elle lirait la réponse qu’elle doit deviner'],
  ['Le masque : −∞ au-dessus de la diagonale', 'on l’ajoute aux scores avant le softmax', 'e^(−∞) = 0 : ces cases ne pèseront rien'],
  ['Les poids, ligne par ligne', 'chaque ligne somme à 1 sur les mots permis', '« Le » ne voit que lui-même : poids 1'],
  ['La ligne « chat » ne voit que le passé', '0,27 sur « Le », 0,73 sur « chat », 0 sur « dort »', 'elle prédit « dort » sans l’avoir vu'],
];

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(4, Math.round(e.k)));
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const futur = j > i;
    const fond = q(svg, `[data-fond="${i}${j}"]`);
    const v = q(svg, `[data-v="${i}${j}"]`);
    let contenu = '', classe = 'svg-entree', opac = '0';
    if (k === 1) { contenu = fr(S[i][j], 0); opac = '0.1'; }
    if (k === 2) { contenu = futur ? '−∞' : fr(S[i][j], 0); classe = futur ? 'svg-perte' : 'svg-entree'; opac = futur ? '0.28' : '0.1'; }
    if (k >= 3) { contenu = futur ? '0' : fr(P[i][j], 2); classe = futur ? 'svg-perte' : 'svg-sortie'; opac = futur ? '0.12' : String(0.15 + 0.6 * P[i][j]); }
    fond.setAttribute('class', classe);
    fond.setAttribute('fill-opacity', opac);
    v.textContent = contenu;
  }
  for (let i = 0; i < 3; i++) q(svg, `[data-bande="${i}"]`).setAttribute('fill-opacity', k === 4 && i === 1 ? '0.12' : '0');
  const [t1, t2, t3] = TEXTES[k];
  texte(svg, '[data-t1]', t1);
  texte(svg, '[data-t2]', t2);
  texte(svg, '[data-t3]', t3);
  scene.setAttribute('aria-label', `${t1}. ${t2} ${t3}.`);
}
