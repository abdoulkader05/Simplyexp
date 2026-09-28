// Fiche « mlp » : une couche cachée de n neurones ReLU approche la courbe de fréquentation du marché.
// Le réseau réalise l'interpolation affine par morceaux entre n + 1 heures régulières.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';
import { vraie } from '../animations/polynome';

const px = (h: number) => 16 + ((h - 6) / 12) * 308;
const py = (y: number) => 196 - (y / 10) * 170;

/** Poids du réseau y = b + Σ aₖ ReLU(h − tₖ) qui interpole la courbe aux nœuds tₖ. */
export function reseau(n: number) {
  const t = Array.from({ length: n + 1 }, (_, k) => 6 + (12 * k) / n);
  const y = t.map(vraie);
  const pentes = t.slice(1).map((tk, k) => (y[k + 1] - y[k]) / (tk - t[k]));
  const a = pentes.map((p, k) => (k === 0 ? p : p - pentes[k - 1]));
  const f = (h: number) => y[0] + a.reduce((s, ak, k) => s + ak * Math.max(0, h - t[k]), 0);
  return { t, a, f };
}

export const etats: Record<string, Etat> = { initial: { n: 3 } };

function gabarit() {
  const c: [number, number][] = [];
  for (let h = 6; h <= 18; h += 0.1) c.push([px(h), py(vraie(h))]);
  return `
    <line x1="${px(6)}" y1="${py(0)}" x2="${px(18)}" y2="${py(0)}" class="svg-trait-doux" />
    ${[6, 12, 18].map((h) => `<text x="${px(h)}" y="${py(0) + 13}" text-anchor="middle" class="svg-doux" font-size="10">${h} h</text>`).join('')}
    <polyline points="${points(c)}" class="svg-ligne svg-trait-encre svg-pointille" stroke-width="2" />
    <polyline data-reseau class="svg-ligne svg-trait-sortie" stroke-width="3" />
    <g data-noeuds></g>
    <text x="4" y="16" class="svg-doux" font-size="10">pointillés : la courbe visée ; doré : la sortie du réseau</text>
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-perte" font-size="12" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const n = Math.max(1, Math.round(e.n));
  const r = reseau(n);
  const c: [number, number][] = [];
  let err = 0, k = 0;
  for (let h = 6; h <= 18.0001; h += 0.05) { c.push([px(h), py(r.f(h))]); err += (r.f(h) - vraie(h)) ** 2; k++; }
  attrs(q(svg, '[data-reseau]'), { points: points(c) });
  q(svg, '[data-noeuds]').innerHTML = r.t.slice(0, -1).map((tk) => `<line x1="${px(tk)}" y1="${py(0) - 4}" x2="${px(tk)}" y2="${py(0) + 4}" class="svg-trait-sortie" stroke-width="2" />`).join('');
  texte(svg, '[data-t1]', `couche cachée de ${n} neurone${n > 1 ? 's' : ''} ReLU`);
  texte(svg, '[data-t2]', `écart quadratique moyen avec la courbe : ${fr(err / k, 3)}`);
  scene.setAttribute('aria-label', `Réseau à ${n} neurones cachés : écart quadratique moyen ${fr(err / k, 3)} avec la courbe visée.`);
}
