// Fiche « descente-gradient » : itérations w ← w − η L'(w) sur la perte du gbaka.
// η = 0,005, w₀ = 0 : w₁ = 37,25 ; w₂ ≈ 64,35 ; w₃ ≈ 84,06 ; w₁₀ ≈ 131,0.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';
import { perte, derivee } from '../animations/gbaka';

export const fiche = 'descente-gradient';
const ETA = 0.005;
const px = (w: number) => 30 + (w / 160) * 290;
const py = (l: number) => 200 - (l / 520000) * 180;

/** Suite des itérés w₀ … w_k. */
function iteres(k: number) {
  const w = [0];
  for (let i = 0; i < k; i++) w.push(w[i] - ETA * derivee(w[i]));
  return w;
}

export const etats: Record<string, Etat> = {
  initial: { t: 0 }, pas1: { t: 1 }, pas2: { t: 2 }, pas3: { t: 3 }, suite: { t: 10 },
};

function gabarit() {
  const courbe: [number, number][] = [];
  for (let w = 0; w <= 160; w += 2) courbe.push([px(w), py(perte(w))]);
  return `
    <line x1="${px(0)}" y1="${py(0)}" x2="${px(160)}" y2="${py(0)}" class="svg-trait-doux" />
    <line x1="${px(0)}" y1="${py(0)}" x2="${px(0)}" y2="${py(520000)}" class="svg-trait-doux" />
    <text x="${px(160)}" y="${py(0) + 14}" text-anchor="end" class="svg-doux" font-size="10">w (F par km)</text>
    <text x="${px(0) + 4}" y="${py(520000) + 4}" class="svg-doux" font-size="10">perte L(w)</text>
    <polyline points="${points(courbe)}" class="svg-ligne svg-trait-perte" stroke-width="2" />
    <line data-tangente class="svg-trait-doux" stroke-width="1.5" stroke-dasharray="5 4" />
    <polyline data-chemin class="svg-ligne svg-trait-parametre" stroke-width="1.5" stroke-dasharray="2 3" />
    <g data-points></g>
    <circle data-cour r="6" class="svg-parametre" />
    <text x="4" y="232" class="svg-parametre" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="13" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.floor(e.t), frac = e.t - k;
  const suite = iteres(k + 1);
  const w = suite[k] + (suite[k + 1] - suite[k]) * frac; // position interpolée entre deux itérés
  const l = perte(w), d = derivee(w);
  const faits = suite.slice(0, k + 1);
  q(svg, '[data-points]').innerHTML = faits.map((v) => `<circle cx="${px(v)}" cy="${py(perte(v))}" r="3.5" class="svg-parametre" opacity=".45" />`).join('');
  attrs(q(svg, '[data-chemin]'), { points: points([...faits, w].map((v) => [px(v), py(perte(v))] as [number, number])) });
  attrs(q(svg, '[data-cour]'), { cx: px(w), cy: py(l) });
  // Tangente : la pente L'(w) que la descente utilise.
  const a = w - 25, b = w + 25;
  attrs(q(svg, '[data-tangente]'), { x1: px(a), y1: py(l + d * (a - w)), x2: px(b), y2: py(l + d * (b - w)) });
  const n = Math.round(e.t);
  const indice = String(n).replace(/\d/g, (c) => '₀₁₂₃₄₅₆₇₈₉'[Number(c)]);
  texte(svg, '[data-t1]', `w${indice} = ${fr(w, 2)} ; L(w) = ${fr(l, 0)}`);
  texte(svg, '[data-t2]', `pente L′(w) = ${fr(d, 1)} ; pas = −η L′ = ${fr(-ETA * d, 2)}`);
  scene.setAttribute('aria-label', `Après ${n} pas, w vaut ${fr(w, 2)} et la perte ${fr(l, 0)}. La pente vaut ${fr(d, 1)}.`);
}
