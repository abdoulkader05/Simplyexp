// Fiche « rope » : une requête et une clé en 2D, tournées de m·θ et n·θ (θ = 30°), q = k = (1 ; 0) au départ.
// (m, n) = (2, 1) et (5, 4) : même écart de 30°, même score 0,866. (5, 1) : écart de 120°, score −0,5.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, fleche } from '../animations/svg';

export const fiche = 'rope';

const CX = 96, CY = 118, R = 70, THETA = 30;
const MESSAGES: Record<string, [string, string]> = {
  initial: ['avant rotation : q et k confondus', 'score q · k = 1'],
  m2n1: ['q en position 2, k en position 1', 'q tourne de 60°, k de 30° : écart 30°'],
  m5n4: ['q en position 5, k en position 4', 'tout a tourné, l’écart reste 30° : même score'],
  m5n1: ['q en position 5, k en position 1', 'écart de 4 positions, soit 120° : le score change'],
};
const POS: Record<string, [number, number]> = { initial: [0, 0], m2n1: [2, 1], m5n4: [5, 4], m5n1: [5, 1] };

export const etats: Record<string, Etat> = Object.fromEntries(
  Object.entries(POS).map(([nom, [m, n]], k) => [nom, { m, n, k }]),
);
const NOMS = Object.keys(POS);

function gabarit() {
  let graduations = '';
  for (let p = 0; p < 12; p++) {
    const a = (p * THETA * Math.PI) / 180;
    graduations += `<line x1="${CX + (R - 4) * Math.cos(a)}" y1="${CY - (R - 4) * Math.sin(a)}" x2="${CX + (R + 4) * Math.cos(a)}" y2="${CY - (R + 4) * Math.sin(a)}" class="svg-trait" stroke-width="1.5" />`;
  }
  return `
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" class="svg-trait" stroke-width="1.5" />
    ${graduations}
    <g data-k></g><g data-q></g>
    <text class="svg-texte" font-size="13" font-weight="700" data-lq>q</text>
    <text class="svg-texte" font-size="13" font-weight="700" data-lk>k</text>
    <text x="4" y="20" class="svg-doux" font-size="10">une graduation = une position = 30°</text>
    <text x="190" y="72" class="svg-texte" font-size="12" style="font-family: var(--police-code)" data-m></text>
    <text x="190" y="92" class="svg-texte" font-size="12" style="font-family: var(--police-code)" data-n></text>
    <text x="190" y="118" class="svg-texte" font-size="12" style="font-family: var(--police-code)" data-ecart></text>
    <text x="190" y="144" class="svg-texte" font-size="13" font-weight="700" style="font-family: var(--police-code)" data-score></text>
    <text x="4" y="228" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="248" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(NOMS.length - 1, Math.round(e.k)));
  const [aq, ak] = [e.m * THETA, e.n * THETA];
  const bout = (deg: number, r: number) => [CX + r * Math.cos((deg * Math.PI) / 180), CY - r * Math.sin((deg * Math.PI) / 180)];
  const [qx, qy] = bout(aq, R - 6), [kx, ky] = bout(ak, R - 6);
  fleche(q(svg, '[data-q]'), CX, CY, qx, qy, 'sortie', 3);
  fleche(q(svg, '[data-k]'), CX, CY, kx, ky, 'entree', 3);
  // Étiquettes hors du cercle, légèrement décalées pour ne pas se chevaucher quand q et k sont proches.
  const [lqx, lqy] = bout(aq + 8, R + 16), [lkx, lky] = bout(ak - 8, R + 16);
  const lq = q(svg, '[data-lq]'), lk = q(svg, '[data-lk]');
  lq.setAttribute('x', (lqx - 4).toFixed(1)); lq.setAttribute('y', (lqy + 4).toFixed(1));
  lk.setAttribute('x', (lkx - 4).toFixed(1)); lk.setAttribute('y', (lky + 4).toFixed(1));
  const ecart = aq - ak;
  texte(svg, '[data-m]', `q : m = ${Math.round(e.m)} → ${Math.round(aq)}°`);
  texte(svg, '[data-n]', `k : n = ${Math.round(e.n)} → ${Math.round(ak)}°`);
  texte(svg, '[data-ecart]', `écart : ${Math.round(ecart)}°`);
  texte(svg, '[data-score]', `q · k = ${fr(Math.cos((ecart * Math.PI) / 180), 3)}`);
  const [t1, t2] = MESSAGES[NOMS[k]];
  texte(svg, '[data-t1]', t1);
  texte(svg, '[data-t2]', t2);
  scene.setAttribute('aria-label', `${t1}. ${t2}. Score ${fr(Math.cos((ecart * Math.PI) / 180), 3)}.`);
}
