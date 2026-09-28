// Fiche « probabilites-bases » : un dé équilibré ; A = « pair », B = « au moins k ».
// P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Exemple k = 4 : 3/6 + 3/6 − 2/6 = 4/6.
import type { Etat } from '../animations/types';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'probabilites-bases';

export const etats: Record<string, Etat> = { initial: { k: 4 } };

const frac = (n: number) => `${n}/6`;

function gabarit() {
  return Array.from({ length: 6 }, (_, i) => {
    const x = 20 + i * 52;
    return `
      <rect data-a="${i}" x="${x}" y="40" width="44" height="44" rx="8" fill="none" stroke-width="3" />
      <rect data-b="${i}" x="${x - 4}" y="36" width="52" height="52" rx="10" fill="none" stroke-width="2" stroke-dasharray="5 3" />
      <rect data-u="${i}" x="${x}" y="40" width="44" height="44" rx="8" class="svg-fond-sortie" />
      <text x="${x + 22}" y="70" text-anchor="middle" class="svg-texte" font-size="20" font-weight="600">${i + 1}</text>`;
  }).join('') + `
    <text x="20" y="116" class="svg-entree" font-size="12" font-weight="600">trait plein bleu : A = « pair »</text>
    <text x="20" y="134" class="svg-parametre" font-size="12" font-weight="600" data-nb></text>
    <text x="20" y="152" class="svg-doux" font-size="11">fond doré : A ∪ B (« A ou B »)</text>
    <text x="4" y="186" class="svg-texte" font-size="13" data-t0></text>
    <text x="4" y="210" class="svg-texte" font-size="13" data-t1></text>
    <text x="4" y="240" class="svg-sortie" font-size="14" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(1, Math.min(6, Math.round(e.k)));
  let nA = 0, nB = 0, nAB = 0, nU = 0;
  for (let i = 0; i < 6; i++) {
    const face = i + 1, a = face % 2 === 0, b = face >= k;
    nA += +a; nB += +b; nAB += +(a && b); nU += +(a || b);
    attrs(q(svg, `[data-a="${i}"]`), { class: a ? 'svg-trait-entree' : 'svg-trait', 'stroke-opacity': a ? 1 : 0.6 });
    attrs(q(svg, `[data-b="${i}"]`), { class: 'svg-trait-parametre', 'stroke-opacity': b ? 1 : 0 });
    q(svg, `[data-u="${i}"]`).style.opacity = a || b ? '0.9' : '0';
  }
  texte(svg, '[data-nb]', `pointillés verts : B = « au moins ${k} »`);
  texte(svg, '[data-t0]', `P(A) = ${frac(nA)} ; P(B) = ${frac(nB)} ; P(A ∩ B) = ${frac(nAB)}`);
  texte(svg, '[data-t1]', `P(A) + P(B) − P(A ∩ B) = ${nA} + ${nB} − ${nAB} sur 6`);
  texte(svg, '[data-t2]', `P(A ∪ B) = ${frac(nU)}`);
  scene.setAttribute('aria-label', `A : pair, B : au moins ${k}. P(A) = ${nA} sur 6, P(B) = ${nB} sur 6, P(A et B) = ${nAB} sur 6, P(A ou B) = ${nU} sur 6.`);
}
