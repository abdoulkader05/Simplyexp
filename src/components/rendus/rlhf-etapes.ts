// Fiche « rlhf » : les trois étapes d'InstructGPT, puis l'effet de la pénalité KL sur deux réponses.
// Scores et rapports de probabilités inventés pour l'illustration (β = 0,5).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'rlhf';

const ETAPES = [
  { vue: 'sft', t1: '1. Démonstrations : apprentissage supervisé', t2: 'des humains écrivent de bonnes réponses' },
  { vue: 'comparaison', t1: '2. Comparaisons : entraîner un juge', t2: 'des humains classent des réponses du modèle' },
  { vue: 'recompense', t1: 'Le modèle de récompense note chaque réponse', t2: 'probabilité de préférer A : σ de l’écart des scores' },
  { vue: 'rl', t1: '3. Renforcement, avec une laisse', t2: 'récompense moins une pénalité d’éloignement' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((et, i) => [i === 0 ? 'initial' : et.vue, { k: i }]));

const sub = (t: string) => `<tspan baseline-shift="sub" font-size="7.5">${t}</tspan>`;
const boite = (x: number, y: number, l: number, h: number, classe: string, op: number) =>
  `<rect x="${x}" y="${y}" width="${l}" height="${h}" rx="5" class="${classe}" fill-opacity="${op}" />`;
const txt = (x: number, y: number, t: string, taille = 10.5, gras = false, ancre = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${ancre}" class="svg-texte" font-size="${taille}"${gras ? ' font-weight="700"' : ''}>${t}</text>`;

function barre(y: number, nom: string, r: number, ratio: number, beta: number) {
  const pen = beta * Math.log(ratio);
  const total = r - pen;
  const u = 32; // pixels par point
  return `${txt(4, y + 12, nom, 11, true)}
    ${boite(96, y, r * u, 14, 'svg-parametre', 0.8)}
    ${boite(96 + (r - pen) * u, y + 18, pen * u, 10, 'svg-perte', 0.8)}
    ${txt(336, y + 12, `r = ${fr(r, 0)}`, 10.5, false, 'end')}
    ${txt(336, y + 28, `total ${fr(total, 2)}`, 10.5, true, 'end')}`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, () => `<g data-corps></g>
    <text x="4" y="226" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="245" class="svg-doux" font-size="11" data-t2></text>`);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  let h = '';
  if (et.vue === 'sft') {
    h = boite(0, 20, 340, 34, 'svg-entree', 0.12) + txt(8, 41, 'Consigne : Explique la photosynthèse à un enfant.')
      + boite(0, 64, 340, 50, 'svg-fond-sortie', 1) + txt(8, 84, 'Démonstration écrite par un annotateur :')
      + txt(8, 102, '« Les plantes se nourrissent grâce à la lumière… »')
      + txt(8, 144, 'On ajuste le modèle dessus : c’est l’instruction tuning.', 10.5)
      + `<text x="8" y="162" class="svg-texte" font-size="10.5" font-weight="700">On obtient π${sub('SFT')}, le modèle de départ.</text>`;
  } else if (et.vue === 'comparaison') {
    h = txt(4, 16, 'Même consigne, deux réponses du modèle :', 10.5)
      + boite(0, 26, 164, 64, 'svg-parametre', 0.15) + txt(8, 44, 'A', 12, true) + txt(8, 62, 'claire, adaptée à')+ txt(8, 78, 'un enfant')
      + boite(176, 26, 164, 64, 'svg-perte', 0.1) + txt(184, 44, 'B', 12, true) + txt(184, 62, 'exacte, mais pleine')+ txt(184, 78, 'de jargon')
      + txt(4, 118, 'L’annotateur choisit : A ≻ B', 12, true)
      + txt(4, 140, 'De nombreuses comparaisons de ce type')
      + txt(4, 156, 'servent à entraîner un modèle de récompense r.');
  } else if (et.vue === 'recompense') {
    h = txt(4, 16, 'Le modèle de récompense donne un score :', 10.5)
      + boite(0, 28, 60 + 2.0 * 50, 22, 'svg-parametre', 0.8) + txt(8, 44, 'A', 12, true) + `<text x="336" y="44" text-anchor="end" class="svg-texte" font-size="11" font-weight="700">r${sub('A')} = 2,0</text>`
      + boite(0, 58, 60 + 0.5 * 50, 22, 'svg-perte', 0.6) + txt(8, 74, 'B', 12, true) + `<text x="336" y="74" text-anchor="end" class="svg-texte" font-size="11" font-weight="700">r${sub('B')} = 0,5</text>`
      + txt(4, 112, 'σ(2,0 − 0,5) = σ(1,5) ≈ 0,82', 12, true)
      + txt(4, 132, 'le juge prédit que A sera préférée 82 fois sur 100')
      + txt(4, 150, 'perte si l’humain a choisi A : − ln 0,82 ≈ 0,20');
  } else {
    h = txt(4, 14, 'Deux réponses possibles, β = 0,5 :', 10.5)
      + barre(24, 'X (flatteuse)', 5, 50, 0.5)
      + barre(76, 'Y (normale)', 4, 2, 0.5)
      + `<rect x="96" y="128" width="12" height="8" class="svg-parametre" fill-opacity="0.8" />${txt(112, 136, 'récompense r', 10)}`
      + `<rect x="196" y="128" width="12" height="8" class="svg-perte" fill-opacity="0.8" />${txt(212, 136, 'pénalité KL', 10)}`
      + `<text x="4" y="164" class="svg-texte" font-size="10.5">X a la meilleure note, mais s’éloigne trop de π${sub('SFT')}</text>`
      + txt(4, 182, '(50 fois plus probable) : Y l’emporte.', 10.5, true);
  }
  q(svg, '[data-corps]').innerHTML = h;
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
