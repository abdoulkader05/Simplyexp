// Fiches « entropie-croisee » et « divergence-kl » : vraie loi p et loi du modèle q sur trois mots.
// p = (0,5 ; 0,3 ; 0,2). Le modèle q = (q₁ ; q₂ ; 1 − q₁ − q₂) est réglable. Logarithme népérien (nats).
// Exemple : q = (0,4 ; 0,4 ; 0,2) : H(p) ≈ 1,030 ; H(p, q) ≈ 1,055 ; KL ≈ 0,025.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'entropie-croisee';
export const P = [0.5, 0.3, 0.2];
const MOTS = ['marché', 'travail', 'champ'];

export function mesures(q1: number, q2: number) {
  const qq = [q1, q2, Math.max(1e-6, 1 - q1 - q2)];
  const H = -P.reduce((s, p) => s + p * Math.log(p), 0);
  const Hc = -P.reduce((s, p, i) => s + p * Math.log(qq[i]), 0);
  return { qq, H, Hc, kl: Hc - H };
}

export const etats: Record<string, Etat> = { initial: { q1: 0.4, q2: 0.4 } };

function gabarit() {
  return MOTS.map((m, i) => {
    const x = 30 + i * 100;
    return `
      <rect x="${x}" y="${180 - P[i] * 260}" width="34" height="${P[i] * 260}" rx="3" class="svg-entree" />
      <rect data-q="${i}" x="${x + 38}" width="34" rx="3" class="svg-parametre" />
      <text x="${x + 17}" y="${174 - P[i] * 260}" text-anchor="middle" class="svg-texte" font-size="10">${fr(P[i], 2)}</text>
      <text data-v="${i}" x="${x + 55}" text-anchor="middle" class="svg-texte" font-size="10"></text>
      <text x="${x + 36}" y="196" text-anchor="middle" class="svg-doux" font-size="11">${m}</text>`;
  }).join('') + `
    <line x1="20" y1="180" x2="330" y2="180" class="svg-trait-doux" />
    <text x="20" y="16" class="svg-entree" font-size="11" font-weight="600">bleu : vraie loi p</text>
    <text x="150" y="16" class="svg-parametre" font-size="11" font-weight="600">vert : modèle q</text>
    <text x="4" y="220" class="svg-texte" font-size="12" data-t0></text>
    <text x="4" y="238" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="256" class="svg-perte" font-size="12" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const m = mesures(e.q1, e.q2);
  m.qq.forEach((v, i) => {
    const h = v * 260;
    attrs(q(svg, `[data-q="${i}"]`), { y: 180 - h, height: h });
    const t = q(svg, `[data-v="${i}"]`);
    attrs(t, { y: 174 - h });
    t.textContent = fr(v, 2);
  });
  texte(svg, '[data-t0]', `entropie de la vraie loi H(p) = ${fr(m.H, 3)} nat`);
  texte(svg, '[data-t1]', `entropie croisée H(p, q) = ${fr(m.Hc, 3)} nat`);
  texte(svg, '[data-t2]', `écart = divergence KL = ${fr(m.kl, 3)} nat`);
  scene.setAttribute('aria-label', `Modèle q = ${m.qq.map((v) => fr(v, 2)).join(', ')}. Entropie croisée ${fr(m.Hc, 3)}, entropie ${fr(m.H, 3)}, divergence ${fr(m.kl, 3)}.`);
}
