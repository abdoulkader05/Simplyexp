// Fiches « probabilite-conditionnelle » et « bayes » : 1 000 SMS, une part d'arnaques ;
// 80 % des arnaques contiennent « gagnant », contre une part réglable des SMS normaux.
// Exemple : 10 % d'arnaques et 5 % : 80 arnaques + 45 normaux contiennent « gagnant » ;
// P(arnaque | gagnant) = 80 / 125 = 0,64.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'probabilite-conditionnelle';
const X0 = 20, Y0 = 30, L = 300, H = 150, N = 1000, SENS = 0.8;

export const etats: Record<string, Etat> = { initial: { arnaques: 10, faux: 5 } };

function gabarit() {
  return `
    <rect x="${X0}" y="${Y0}" width="${L}" height="${H}" fill="none" class="svg-trait-doux" />
    <rect data-ag class="svg-perte" opacity=".85" /><rect data-an class="svg-perte" opacity=".25" />
    <rect data-ng class="svg-entree" opacity=".85" /><rect data-nn class="svg-entree" opacity=".18" />
    <text data-la class="svg-texte" font-size="11" font-weight="600">arnaques</text>
    <text data-ln class="svg-texte" font-size="11" font-weight="600">SMS normaux</text>
    <text x="${X0}" y="20" class="svg-doux" font-size="10">parties foncées : SMS qui contiennent « gagnant »</text>
    <text x="4" y="204" class="svg-texte" font-size="12" data-t0></text>
    <text x="4" y="226" class="svg-texte" font-size="12" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="14" font-weight="700" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const pa = e.arnaques / 100, pf = e.faux / 100;
  const la = Math.max(2, L * pa), ln = L - la;
  const ha = H * SENS, hn = H * pf;
  attrs(q(svg, '[data-ag]'), { x: X0, y: Y0 + H - ha, width: la, height: ha });
  attrs(q(svg, '[data-an]'), { x: X0, y: Y0, width: la, height: H - ha });
  attrs(q(svg, '[data-ng]'), { x: X0 + la, y: Y0 + H - hn, width: ln, height: hn });
  attrs(q(svg, '[data-nn]'), { x: X0 + la, y: Y0, width: ln, height: H - hn });
  attrs(q(svg, '[data-la]'), { x: X0 + 4, y: Y0 + 14 });
  attrs(q(svg, '[data-ln]'), { x: X0 + la + 6, y: Y0 + 14 });
  const na = Math.round(N * pa), ag = Math.round(na * SENS), ng = Math.round((N - na) * pf);
  const post = ag / (ag + ng);
  texte(svg, '[data-t0]', `${na} arnaques sur 1 000, dont ${ag} avec « gagnant »`);
  texte(svg, '[data-t1]', `${N - na} SMS normaux, dont ${ng} avec « gagnant »`);
  texte(svg, '[data-t2]', `P(arnaque | « gagnant ») = ${ag} / ${ag + ng} = ${fr(post, 2)}`);
  scene.setAttribute('aria-label', `${na} arnaques sur 1 000. Parmi les ${ag + ng} SMS qui contiennent gagnant, ${ag} sont des arnaques : probabilité ${fr(post, 2)}.`);
}
