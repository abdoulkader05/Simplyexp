// Fiche « entropie » : pluie ou pas demain, avec la probabilité p de pluie.
// Surprise : −log₂ p ; entropie H(p) = −p log₂ p − (1 − p) log₂(1 − p), maximale (1 bit) en p = 0,5.
// Exemple : p = 0,1 : surprises 3,32 et 0,15 bit ; H ≈ 0,469 bit.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';

export const fiche = 'entropie';
const H = (p: number) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));
const px = (p: number) => 30 + p * 170;
const py = (h: number) => 180 - h * 140;

export const etats: Record<string, Etat> = { initial: { p: 0.1 } };

function gabarit() {
  const c: [number, number][] = [];
  for (let p = 0; p <= 1.0001; p += 0.01) c.push([px(p), py(H(p))]);
  return `
    <line x1="${px(0)}" y1="180" x2="${px(1)}" y2="180" class="svg-trait-doux" />
    <line x1="${px(0)}" y1="180" x2="${px(0)}" y2="${py(1.05)}" class="svg-trait-doux" />
    <text x="${px(0) - 4}" y="${py(1) + 4}" text-anchor="end" class="svg-doux" font-size="10">1</text>
    <text x="${px(1)}" y="194" text-anchor="end" class="svg-doux" font-size="10">p (pluie)</text>
    <text x="${px(0)}" y="16" class="svg-doux" font-size="10">entropie H(p) en bits</text>
    <polyline points="${points(c)}" class="svg-ligne svg-trait-sortie" stroke-width="2.5" />
    <circle data-p r="5.5" class="svg-entree" />
    <text x="226" y="28" class="svg-doux" font-size="10">surprise (bits)</text>
    <rect data-sp x="232" width="36" rx="3" class="svg-perte" /><rect data-ss x="284" width="36" rx="3" class="svg-perte" opacity=".5" />
    <text x="250" y="194" text-anchor="middle" class="svg-doux" font-size="10">pluie</text>
    <text x="302" y="194" text-anchor="middle" class="svg-doux" font-size="10">sec</text>
    <text data-vp x="250" text-anchor="middle" class="svg-texte" font-size="11"></text>
    <text data-vs x="302" text-anchor="middle" class="svg-texte" font-size="11"></text>
    <text x="4" y="232" class="svg-texte" font-size="12" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="13" font-weight="700" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const p = e.p, h = H(p), sp = -Math.log2(p), ss = -Math.log2(1 - p);
  attrs(q(svg, '[data-p]'), { cx: px(p), cy: py(h) });
  const hb = (s: number) => Math.min(150, s * 34);
  attrs(q(svg, '[data-sp]'), { y: 180 - hb(sp), height: hb(sp) });
  attrs(q(svg, '[data-ss]'), { y: 180 - hb(ss), height: hb(ss) });
  attrs(q(svg, '[data-vp]'), { y: 175 - hb(sp) });
  attrs(q(svg, '[data-vs]'), { y: 175 - hb(ss) });
  texte(svg, '[data-vp]', fr(sp, 2));
  texte(svg, '[data-vs]', fr(ss, 2));
  texte(svg, '[data-t1]', `P(pluie) = ${fr(p, 2)} ; surprise moyenne = ${fr(p, 2)} × ${fr(sp, 2)} + ${fr(1 - p, 2)} × ${fr(ss, 2)}`);
  texte(svg, '[data-t2]', `entropie H = ${fr(h, 3)} bit`);
  scene.setAttribute('aria-label', `Probabilité de pluie ${fr(p, 2)} : surprise ${fr(sp, 2)} bit s'il pleut, ${fr(ss, 2)} s'il fait sec, entropie ${fr(h, 3)} bit.`);
}
