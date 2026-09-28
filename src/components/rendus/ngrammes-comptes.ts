// Fiche « ngrammes » : bigrammes comptés sur « le chat dort . / le chien dort . / le chat mange . ».
// P(chat|le) = 2/3, P(dort|chat) = 1/2, P(mange|chien) = 0 → lissage de Laplace (V = 6) : 1/7.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'ngrammes';
const CORPUS = ['le chat dort .', 'le chien dort .', 'le chat mange .'];

type Barre = [string, number, string];
const ETAPES: { surligne: string[]; titre: string; barres: Barre[]; t1: string; t2: string }[] = [
  { surligne: [], titre: '', barres: [], t1: 'un corpus de trois phrases', t2: 'on va compter les paires de mots voisins (bigrammes)' },
  { surligne: ['le chat', 'le chien'], titre: 'mots qui suivent « le » (3 fois)', barres: [['chat', 2 / 3, '2/3'], ['chien', 1 / 3, '1/3']], t1: 'P(chat | le) = 2/3', t2: '« le chat » apparaît 2 fois sur 3 « le »' },
  { surligne: ['chat dort', 'chat mange'], titre: 'mots qui suivent « chat » (2 fois)', barres: [['dort', 1 / 2, '1/2'], ['mange', 1 / 2, '1/2']], t1: 'P(dort | chat) = 1/2', t2: 'P(le chat dort .) = 2/3 × 1/2 × 1 = 1/3' },
  { surligne: ['chien dort'], titre: 'mots qui suivent « chien » (1 fois)', barres: [['dort', 1, '1/1'], ['mange', 0, '0/1']], t1: 'P(mange | chien) = 0', t2: '« le chien mange . » reçoit une probabilité nulle' },
  { surligne: ['chien dort'], titre: 'après « chien », lissage de Laplace (V = 6)', barres: [['dort', 2 / 7, '2/7'], ['mange', 1 / 7, '1/7'], ['4 autres', 4 / 7, '4 × 1/7']], t1: 'P(mange | chien) = (0 + 1)/(1 + 6) = 1/7', t2: 'P(le chien mange .) ≈ 0,009 : faible, mais plus nulle' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'le', 'chat', 'zero', 'laplace'][i], { k: i }]));

function gabarit() {
  return CORPUS.map((_, i) => `<g data-p="${i}"></g>`).join('') + `
    <text x="4" y="110" class="svg-doux" font-size="10" data-titre></text>
    <g data-barres></g>
    <text x="4" y="226" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="248" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  CORPUS.forEach((phrase, i) => {
    const mots = phrase.split(' ');
    let x = 4, html = '';
    mots.forEach((m, j) => {
      const w = m.length * 8 + 12;
      const paire = j < mots.length - 1 && et.surligne.includes(`${m} ${mots[j + 1]}`);
      const second = j > 0 && et.surligne.includes(`${mots[j - 1]} ${m}`);
      html += `<rect x="${x}" y="${10 + i * 28}" width="${w}" height="20" rx="3" class="${second ? 'svg-fond-sortie' : 'svg-entree'}" opacity="${second ? 1 : paire ? 0.4 : 0.15}" />
        <text x="${x + w / 2}" y="${24 + i * 28}" text-anchor="middle" class="svg-texte" font-size="12">${m}</text>`;
      x += w + 4;
    });
    q(svg, `[data-p="${i}"]`).innerHTML = html;
  });
  q(svg, '[data-barres]').innerHTML = et.barres.map(([m, p, lib], i) => {
    const y = 120 + i * 28;
    return `<text x="4" y="${y + 13}" class="svg-texte" font-size="12">${m}</text>
      <rect x="76" y="${y}" width="190" height="18" rx="3" fill="none" class="svg-trait" />
      <rect x="76" y="${y}" width="${190 * p}" height="18" rx="3" class="svg-sortie" />
      <text x="336" y="${y + 13}" text-anchor="end" class="svg-texte" font-size="12">${lib}</text>`;
  }).join('');
  texte(svg, '[data-titre]', et.titre);
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}. ${et.barres.map(([m, p]) => `${m} ${fr(p, 2)}`).join(', ')}`);
}
