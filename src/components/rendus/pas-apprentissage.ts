// Fiche « learning-rate » : descente sur f(w) = w², w ← (1 − 2η) w, w₀ = 1,5.
// Converge si 0 < η < 1 ; zigzague si η > 0,5 ; diverge si η > 1.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs, points } from '../animations/svg';

export const fiche = 'learning-rate';
const W0 = 1.5, PAS = 12;
const px = (w: number) => 170 + w * 60;
const py = (y: number) => 200 - y * 28;

export const etats: Record<string, Etat> = { initial: { eta: 0.1 } };

function gabarit() {
  const courbe: [number, number][] = [];
  for (let w = -2.6; w <= 2.6; w += 0.05) courbe.push([px(w), py(w * w)]);
  return `
    <defs><clipPath id="lr-cadre"><rect x="0" y="0" width="340" height="212" /></clipPath></defs>
    <line x1="4" y1="${py(0)}" x2="336" y2="${py(0)}" class="svg-trait-doux" />
    <line x1="${px(0)}" y1="12" x2="${px(0)}" y2="${py(0)}" class="svg-trait-doux" />
    <polyline points="${points(courbe)}" class="svg-ligne svg-trait-perte" stroke-width="2" />
    <g clip-path="url(#lr-cadre)">
      <polyline data-chemin class="svg-ligne svg-trait-parametre" stroke-width="1.5" />
      <g data-points></g>
    </g>
    <text x="4" y="16" class="svg-doux" font-size="11">f(w) = w², départ w₀ = 1,5</text>
    <text x="4" y="232" class="svg-parametre" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="14" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = 1 - 2 * e.eta;
  const w = [W0];
  for (let i = 0; i < PAS; i++) w.push(k * w[i]);
  const pts = w.map((v) => [px(v), py(v * v)] as [number, number]);
  attrs(q(svg, '[data-chemin]'), { points: points(pts) });
  q(svg, '[data-points]').innerHTML = pts.map(([x, y], i) =>
    `<circle cx="${x}" cy="${y}" r="${i === 0 ? 5 : 3.5}" class="svg-parametre" opacity="${i === 0 ? 1 : 0.35 + 0.65 * (i / PAS)}" />`).join('');
  const regime = Math.abs(k) < 1 ? (k < 0 ? 'converge en zigzaguant' : 'converge sans zigzag') : Math.abs(k) === 1 ? 'oscille sans fin' : 'diverge';
  texte(svg, '[data-t1]', `η = ${fr(e.eta, 2)} ; facteur 1 − 2η = ${fr(k, 2)}`);
  texte(svg, '[data-t2]', `w₁₂ = ${Math.abs(w[PAS]) < 1e4 ? fr(w[PAS], 4) : fr(w[PAS], 0)} : ${regime}`);
  scene.setAttribute('aria-label', `Pas d'apprentissage ${fr(e.eta, 2)} : chaque pas multiplie w par ${fr(k, 2)}. Après 12 pas, w vaut ${fr(w[PAS], 4)} ; la descente ${regime}.`);
}
