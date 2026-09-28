// Fiche « train-val-test » : k « modèles » qui répondent au hasard, notés sur 40 questions de validation.
// Le meilleur score de validation monte avec k, alors que son score sur 1 000 questions neuves reste vers 50 %.
// Tirages pseudo-aléatoires à graine fixe.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { generateur } from '../animations/alea';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'train-val-test';
const K = 100, NVAL = 40, NTEST = 1000;

const alea = generateur(40);
const score = (n: number) => { let s = 0; for (let i = 0; i < n; i++) s += alea() < 0.5 ? 1 : 0; return s / n; };
const VAL = Array.from({ length: K }, () => score(NVAL));
const TEST = Array.from({ length: K }, () => score(NTEST));

const bx = (i: number) => 30 + i * 3;
const by = (s: number) => 200 - s * 180;

export const etats: Record<string, Etat> = { initial: { k: 20 } };

function gabarit() {
  const barres = VAL.map((s, i) => `<rect data-b="${i}" x="${bx(i)}" y="${by(s)}" width="2.2" height="${by(0) - by(s)}" class="svg-entree" />`).join('');
  return `
    <line x1="30" y1="${by(0.5)}" x2="330" y2="${by(0.5)}" class="svg-trait-doux svg-pointille" />
    <text x="26" y="${by(0.5) + 4}" text-anchor="end" class="svg-doux" font-size="10">50 %</text>
    <text x="26" y="${by(1) + 8}" text-anchor="end" class="svg-doux" font-size="10">100 %</text>
    <line x1="30" y1="${by(0)}" x2="330" y2="${by(0)}" class="svg-trait-doux" />
    ${barres}
    <line data-meilleur class="svg-trait-sortie" stroke-width="2" />
    <text x="30" y="16" class="svg-doux" font-size="11">score de validation de chaque modèle essayé (40 questions)</text>
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-perte" font-size="13" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(1, Math.min(K, Math.round(e.k)));
  let best = 0;
  for (let i = 0; i < K; i++) {
    q(svg, `[data-b="${i}"]`).style.opacity = i < k ? '0.8' : '0.08';
    if (i < k && VAL[i] > VAL[best]) best = i;
  }
  attrs(q(svg, '[data-meilleur]'), { x1: 30, y1: by(VAL[best]), x2: 330, y2: by(VAL[best]) });
  texte(svg, '[data-t1]', `${k} modèle${k > 1 ? 's' : ''} essayé${k > 1 ? 's' : ''} : le meilleur a ${fr(VAL[best] * 100, 1, 0)} % en validation`);
  texte(svg, '[data-t2]', `le même sur 1 000 questions neuves : ${fr(TEST[best] * 100, 1)} %`);
  scene.setAttribute('aria-label', `${k} modèles au hasard. Le meilleur obtient ${fr(VAL[best] * 100, 1, 0)} % sur la validation, mais ${fr(TEST[best] * 100, 1)} % sur des questions neuves.`);
}
