// Fiche « recherche-semantique » : cinq articles d'aide et une requête, en vecteurs 2D inventés.
// Requête (0,95 ; 0,25). cos : Retours 0,994 ; Taille 0,908 ; Délais 0,534 ; Colis 0,302 ; Paiement −0,459.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, fleche } from '../animations/svg';

export const fiche = 'recherche-semantique';
export const DOCS: [string, string, number, number][] = [
  ['A', 'Retours et remboursements', 0.9, 0.35],
  ['B', 'Changer de taille', 0.75, 0.62],
  ['C', 'Délais de livraison', 0.3, 0.95],
  ['D', 'Suivre mon colis', 0.05, 1.0],
  ['E', 'Moyens de paiement', -0.65, 0.72],
];
export const REQUETE: [number, number] = [0.95, 0.25];
const norme = (x: number, y: number) => Math.hypot(x, y);
const cos = (x: number, y: number) => (x * REQUETE[0] + y * REQUETE[1]) / (norme(x, y) * norme(...REQUETE));
const O = [62, 150], U = 58;

export const etats: Record<string, Etat> = { initial: { k: 0 }, requete: { k: 1 }, scores: { k: 2 }, topk: { k: 3 } };

function gabarit() {
  return `
    <line x1="${O[0] - 58}" y1="${O[1]}" x2="${O[0] + 66}" y2="${O[1]}" class="svg-trait" />
    <line x1="${O[0]}" y1="${O[1] + 20}" x2="${O[0]}" y2="${O[1] - 76}" class="svg-trait" />
    ${DOCS.map((_, i) => `<g data-v="${i}"></g>`).join('')}<g data-q></g><g data-lettres></g>
    <g data-liste></g>
    <text x="4" y="232" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(3, Math.round(e.k)));
  const scores = DOCS.map((d) => cos(d[2], d[3]));
  const ordre = k >= 2 ? DOCS.map((_, i) => i).sort((a, b) => scores[b] - scores[a]) : DOCS.map((_, i) => i);
  const garde = (i: number) => k < 3 || ordre.indexOf(i) < 2;
  let lettres = '';
  DOCS.forEach(([l, , x, y], i) => {
    const n = norme(x, y), ux = x / n, uy = y / n;
    fleche(q(svg, `[data-v="${i}"]`), O[0], O[1], O[0] + ux * U, O[1] - uy * U, 'entree', 2);
    (q(svg, `[data-v="${i}"]`) as SVGGElement).setAttribute('opacity', garde(i) ? '1' : '0.25');
    lettres += `<text x="${O[0] + ux * (U + 11)}" y="${O[1] - uy * (U + 11) + 4}" text-anchor="middle" class="svg-texte" font-size="11" font-weight="600" opacity="${garde(i) ? 1 : 0.3}">${l}</text>`;
  });
  const gq = q(svg, '[data-q]');
  if (k >= 1) {
    const n = norme(...REQUETE);
    fleche(gq, O[0], O[1], O[0] + (REQUETE[0] / n) * U, O[1] - (REQUETE[1] / n) * U, 'sortie', 3);
    lettres += `<text x="${O[0] - 6}" y="${O[1] + 16}" class="svg-texte" font-size="11" font-weight="700">requête</text>`;
  } else gq.innerHTML = '';
  q(svg, '[data-lettres]').innerHTML = lettres;
  q(svg, '[data-liste]').innerHTML = ordre.map((i, r) => {
    const [l, titre] = DOCS[i];
    const y = 22 + r * 38, s = scores[i];
    const vu = garde(i) ? 1 : 0.3;
    return `<g opacity="${vu}">
      <text x="146" y="${y}" class="svg-texte" font-size="11"><tspan font-weight="700">${l}</tspan> ${titre}</text>
      ${k >= 2 ? `<rect x="146" y="${y + 6}" width="150" height="8" rx="2" fill="none" class="svg-trait" />
      <rect x="146" y="${y + 6}" width="${150 * Math.max(0, s)}" height="8" rx="2" class="${k === 3 && r < 2 ? 'svg-sortie' : 'svg-entree'}" opacity="${k === 3 && r < 2 ? 1 : 0.45}" />
      <text x="336" y="${y + 14}" text-anchor="end" class="svg-texte" font-size="11">${fr(s, 2)}</text>` : ''}
    </g>`;
  }).join('');
  const T = [
    ['cinq articles d’aide, chacun devenu un vecteur', 'vecteurs inventés, en 2 dimensions pour les voir'],
    ['requête : « je veux renvoyer mes chaussures »', 'aucun mot en commun avec « Retours et remboursements »'],
    ['on classe par similarité cosinus', `Retours ${fr(scores[0], 3)}, Taille ${fr(scores[1], 3)}, Paiement ${fr(scores[4], 3)}`],
    ['on renvoie les k = 2 meilleurs', 'Retours et remboursements, puis Changer de taille'],
  ][k];
  texte(svg, '[data-t1]', T[0]);
  texte(svg, '[data-t2]', T[1]);
  scene.setAttribute('aria-label', `${T[0]}. ${T[1]}.`);
}
