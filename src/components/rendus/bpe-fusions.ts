// Fiche « bpe » : fusions successives sur le corpus banane ×3, bandana ×2, ananas ×2, banc ×1.
// Fusions : a+n (15), b+an (6), an+a (4), ban+an (3), banan+e (3). Égalités : la paire vue en premier.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'bpe';
const MOTS = [['banane', 3], ['bandana', 2], ['ananas', 2], ['banc', 1]] as const;
const ETAPES = [
  { fusion: '', compte: 0, seg: ['b|a|n|a|n|e', 'b|a|n|d|a|n|a', 'a|n|a|n|a|s', 'b|a|n|c'] },
  { fusion: 'a + n → an', compte: 15, seg: ['b|an|an|e', 'b|an|d|an|a', 'an|an|a|s', 'b|an|c'] },
  { fusion: 'b + an → ban', compte: 6, seg: ['ban|an|e', 'ban|d|an|a', 'an|an|a|s', 'ban|c'] },
  { fusion: 'an + a → ana', compte: 4, seg: ['ban|an|e', 'ban|d|ana', 'an|ana|s', 'ban|c'] },
  { fusion: 'ban + an → banan', compte: 3, seg: ['banan|e', 'ban|d|ana', 'an|ana|s', 'ban|c'] },
  { fusion: 'banan + e → banane', compte: 3, seg: ['banane', 'ban|d|ana', 'an|ana|s', 'ban|c'] },
];
const NOUVEAUX = ['an', 'ban', 'ana', 'banan', 'banane'];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [i === 0 ? 'initial' : `f${i}`, { k: i }]));

function gabarit() {
  return MOTS.map(([m, n], i) => `
    <text x="4" y="${46 + i * 30}" class="svg-doux" font-size="11">${m} ×${n}</text>
    <g data-m="${i}"></g>`).join('') + `
    <text x="4" y="18" class="svg-doux" font-size="10">corpus : chaque mot et son nombre d’apparitions</text>
    <text x="4" y="176" class="svg-texte" font-size="11" data-voc></text>
    <text x="4" y="212" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="234" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  const nouveau = k > 0 ? NOUVEAUX[k - 1] : '';
  et.seg.forEach((s, i) => {
    let x = 96, html = '';
    for (const t of s.split('|')) {
      const w = t.length * 8 + 10;
      html += `<rect x="${x}" y="${32 + i * 30}" width="${w}" height="20" rx="3" class="${t === nouveau ? 'svg-fond-sortie' : 'svg-entree'}" opacity="${t === nouveau ? 1 : 0.18}" />
        <text x="${x + w / 2}" y="${46 + i * 30}" text-anchor="middle" class="svg-texte" font-size="12">${t}</text>`;
      x += w + 3;
    }
    q(svg, `[data-m="${i}"]`).innerHTML = html;
  });
  texte(svg, '[data-voc]', `vocabulaire : lettres${k ? ' + ' + NOUVEAUX.slice(0, k).join(', ') : ''}`);
  texte(svg, '[data-t1]', k ? `fusion ${k} : ${et.fusion}` : 'départ : chaque lettre est un token');
  texte(svg, '[data-t2]', k ? `cette paire apparaît ${et.compte} fois dans le corpus pondéré` : 'on va fusionner, une à une, les paires les plus fréquentes');
  scene.setAttribute('aria-label', k ? `Fusion ${k} : ${et.fusion}, ${et.compte} apparitions.` : 'Corpus découpé en lettres.');
}
