// Fiche « tokenisation » : une même phrase découpée en caractères, en sous-mots ou en mots.
// Le découpage en sous-mots est une illustration faite à la main, pas la sortie d'un vrai tokeniseur.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'tokenisation';
const PHRASE = 'Les chatons adorent les incompréhensibles pelotes.';
export const DECOUPAGES = [
  { nom: 'caractères', tokens: [...PHRASE] },
  { nom: 'sous-mots', tokens: ['Les', ' chat', 'ons', ' ador', 'ent', ' les', ' in', 'compr', 'éhens', 'ibles', ' pel', 'otes', '.'] },
  { nom: 'mots', tokens: ['Les', ' chatons', ' adorent', ' les', ' incompréhensibles', ' pelotes', '.'] },
];

export const etats: Record<string, Etat> = { initial: { niveau: 1 } };

function gabarit() {
  return `
    <text x="4" y="18" class="svg-doux" font-size="10">« ${PHRASE} »</text>
    <g data-boites></g>
    <text x="4" y="212" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="232" class="svg-texte" font-size="12" data-t2></text>
    <text x="4" y="252" class="svg-doux" font-size="11" data-t3></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const d = DECOUPAGES[Math.max(0, Math.min(2, Math.round(e.niveau)))];
  const petit = d.tokens.length > 20;
  const taille = petit ? 10 : 12, largCar = petit ? 6.2 : 7.2, h = petit ? 16 : 22;
  let x = 4, y = 34, html = '';
  d.tokens.forEach((t, i) => {
    const affiche = t.replace(/ /g, '·');
    const w = Math.max(10, affiche.length * largCar + 8);
    if (x + w > 336) { x = 4; y += h + 6; }
    html += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" class="${i % 2 ? 'svg-fond-sortie' : 'svg-entree'}" opacity="${i % 2 ? 1 : 0.18}" />
      <text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" class="svg-texte" font-size="${taille}">${affiche.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`;
    x += w + 3;
  });
  q(svg, '[data-boites]').innerHTML = html;
  texte(svg, '[data-t1]', `découpage en ${d.nom} : ${d.tokens.length} tokens`);
  texte(svg, '[data-t2]', ['vocabulaire minuscule, mais des suites très longues', 'compromis : peu de tokens, vocabulaire de taille raisonnable', 'suites courtes, mais un mot jamais vu est inconnu'][Math.round(e.niveau)]);
  texte(svg, '[data-t3]', 'le point « · » marque une espace collée au début du token');
  scene.setAttribute('aria-label', `Découpage en ${d.nom} : ${d.tokens.length} tokens.`);
}
