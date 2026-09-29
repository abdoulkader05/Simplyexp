// Fiche « encodage-positionnel » : trois paires (sin, cos) de l'encodage sinusoïdal, vues comme des roues.
// d_model = 8, paires i = 0, 1, 2 : fréquences 1, 0,1 et 0,01 radian par position.
// Position 6 : la roue rapide a presque fait un tour (344°), les lentes la distinguent de la position 0.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'encodage-positionnel';

const ROUES = [
  { cx: 58, w: 1, nom: 'i = 0 · ω = 1' },
  { cx: 170, w: 0.1, nom: 'i = 1 · ω = 0,1' },
  { cx: 282, w: 0.01, nom: 'i = 2 · ω = 0,01' },
];
const CY = 104, R = 40;
const POSITIONS = [0, 1, 2, 6, 20];
const MESSAGES = [
  ['position 0 : toutes les roues au repère', 'le vecteur commence par (0 ; 1), (0 ; 1), (0 ; 1)'],
  ['position 1 : la roue rapide tourne d’un radian', 'les roues lentes bougent à peine'],
  ['position 2 : chaque roue avance à son rythme', 'la position se lit dans l’ensemble des angles'],
  ['position 6 : la roue rapide est presque revenue', 'seule, elle confondrait 6 et 0 ; les lentes, non'],
  ['position 20 : la roue lente sépare les grandes distances', 'chaque position a sa combinaison d’angles'],
];

export const etats: Record<string, Etat> = Object.fromEntries(
  POSITIONS.map((p, k) => [['initial', 'p1', 'p2', 'p6', 'p20'][k], { pos: p, k }]),
);

function gabarit() {
  return ROUES.map((r, i) => `
    <circle cx="${r.cx}" cy="${CY}" r="${R}" fill="none" class="svg-trait" stroke-width="2" />
    <line x1="${r.cx}" y1="${CY - R - 4}" x2="${r.cx}" y2="${CY - R + 6}" class="svg-trait-doux" stroke-width="2" />
    <line x1="${r.cx}" y1="${CY}" y2="${CY}" x2="${r.cx}" class="svg-trait-entree" stroke-width="2.5" stroke-linecap="round" data-rayon="${i}" />
    <circle r="6" class="svg-sortie" data-point="${i}" />
    <text x="${r.cx}" y="${CY + R + 18}" text-anchor="middle" class="svg-doux" font-size="10">${r.nom}</text>
    <text x="${r.cx}" y="${CY + R + 34}" text-anchor="middle" class="svg-texte" font-size="10.5" style="font-family: var(--police-code)" data-val="${i}"></text>`).join('') + `
    <text x="4" y="20" class="svg-texte" font-size="15" font-weight="700" data-pos></text>
    <text x="336" y="20" text-anchor="end" class="svg-doux" font-size="10">(sin, cos) de pos × ω</text>
    <text x="4" y="224" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="244" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(POSITIONS.length - 1, Math.round(e.k)));
  const pos = e.pos;
  ROUES.forEach((r, i) => {
    const a = pos * r.w;
    const x = r.cx + R * Math.sin(a), y = CY - R * Math.cos(a);
    const p = q(svg, `[data-point="${i}"]`);
    p.setAttribute('cx', x.toFixed(1)); p.setAttribute('cy', y.toFixed(1));
    const l = q(svg, `[data-rayon="${i}"]`);
    l.setAttribute('x2', x.toFixed(1)); l.setAttribute('y2', y.toFixed(1));
    texte(svg, `[data-val="${i}"]`, `(${fr(Math.sin(a), 2)} ; ${fr(Math.cos(a), 2)})`);
  });
  texte(svg, '[data-pos]', `pos = ${Math.round(pos)}`);
  texte(svg, '[data-t1]', MESSAGES[k][0]);
  texte(svg, '[data-t2]', MESSAGES[k][1]);
  scene.setAttribute('aria-label', `Position ${Math.round(pos)} : ${MESSAGES[k][0]}. ${MESSAGES[k][1]}.`);
}
