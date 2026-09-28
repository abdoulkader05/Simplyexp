// Fiche « memoire-agent » : score de récupération récence + importance + pertinence (Park et al., 2023),
// chaque composante normalisée min-max. Souvenirs, heures et similarités inventés pour l'illustration.
// Scores (composantes arrondies) : attiéké 2,11 ; four 2,02 ; allergie 1,90 ; réunion 1,30 ; pluie 1,00.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'memoire-agent';

const SOUVENIRS = [
  { t: 'Léa adore l’attiéké', r: 0.73, i: 0.38, p: 1.0 },
  { t: 'Réunion déplacée à 15 h', r: 0.99, i: 0.25, p: 0.06 },
  { t: 'Léa : allergie arachides', r: 0.0, i: 1.0, p: 0.9 },
  { t: 'Le four est en panne', r: 0.88, i: 0.62, p: 0.52 },
  { t: 'Il a plu ce matin', r: 1.0, i: 0.0, p: 0.0 },
];
const score = (s: (typeof SOUVENIRS)[number]) => s.r + s.i + s.p;
const RANG = [...SOUVENIRS].sort((a, b) => score(b) - score(a)).map((s) => s.t);
const COLS = [
  { cle: 'r', x: 150, lib: 'récence', classe: 'svg-entree' },
  { cle: 'i', x: 192, lib: 'import.', classe: 'svg-perte' },
  { cle: 'p', x: 234, lib: 'pertin.', classe: 'svg-parametre' },
] as const;
const ETAPES = [
  { cols: 0, total: false, t1: 'Le flux de souvenirs', t2: 'chaque observation passée, datée, en langage naturel' },
  { cols: 1, total: false, t1: 'Récence : 0,995 par heure écoulée', t2: 'les souvenirs récents remontent, même anodins' },
  { cols: 2, total: false, t1: 'Importance : notée de 1 à 10 par le modèle', t2: 'l’allergie compte plus que la pluie' },
  { cols: 3, total: false, t1: 'Pertinence : cosinus avec la question', t2: 'la réunion et la pluie n’ont rien à voir' },
  { cols: 3, total: true, t1: 'Score = somme des trois ; on garde les 3 meilleurs', t2: 'avec 2 seulement, l’allergie serait perdue' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'recence', 'importance', 'pertinence', 'score'][i], { k: i }]));

function gabarit() {
  return `
    <text x="4" y="14" class="svg-texte" font-size="12" font-weight="700">« Quel plat préparer pour Léa samedi ? »</text>
    ${COLS.map((c) => `<text x="${c.x + 17}" y="36" text-anchor="middle" class="svg-doux" font-size="9" data-c="${c.cle}">${c.lib}</text>`).join('')}
    <text x="310" y="36" text-anchor="middle" class="svg-doux" font-size="9" data-cs>score</text>
    ${SOUVENIRS.map((_, i) => `<g data-s="${i}"></g>`).join('')}
    <text x="4" y="224" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="244" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  COLS.forEach((c, j) => q(svg, `[data-c="${c.cle}"]`).setAttribute('opacity', j < et.cols ? '1' : '0'));
  q(svg, '[data-cs]').setAttribute('opacity', et.total ? '1' : '0');
  SOUVENIRS.forEach((s, i) => {
    const y = 44 + i * 33;
    const garde = et.total && RANG.indexOf(s.t) < 3;
    const barres = COLS.slice(0, et.cols).map((c) => `
      <rect x="${c.x}" y="${y + 7}" width="34" height="12" rx="2" fill="none" class="svg-trait" />
      <rect x="${c.x}" y="${y + 7}" width="${Math.max(1, 34 * s[c.cle])}" height="12" rx="2" class="${c.classe}" fill-opacity="0.75" />`).join('');
    q(svg, `[data-s="${i}"]`).innerHTML = `
      <rect x="0" y="${y}" width="340" height="27" rx="4" class="${garde ? 'svg-sortie' : 'svg-entree'}" fill-opacity="${garde ? 0.28 : 0.06}" />
      <text x="8" y="${y + 17.5}" class="svg-texte" font-size="10.5">${s.t}</text>
      ${barres}
      ${et.total ? `<text x="330" y="${y + 17.5}" text-anchor="end" class="svg-texte" font-size="11" font-weight="700">${fr(score(s), 2)}</text>` : ''}`;
  });
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}. ${et.total ? `Classement : ${RANG.join(', ')}.` : ''}`);
}
