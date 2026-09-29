// Fiche « flash-attention » : une ligne d'attention calculée par blocs dans la mémoire rapide.
// Exponentielles des scores 1, 2 | 3, 4 ; valeurs 10, 20 | 30, 40.
// Bloc 1 : ℓ = 3, u = 50 ; bloc 2 : ℓ = 10, u = 300 ; sortie o = 300 / 10 = 30, comme le calcul complet.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, fleche } from '../animations/svg';

export const fiche = 'flash-attention';

const ETAPES = [
  { bloc: 0, l: 0, u: 0, t1: 'Attention classique : toute la matrice S en HBM', t2: 'écrite, puis relue pour la softmax, puis pour × V' },
  { bloc: 1, l: 3, u: 50, t1: 'Bloc 1 chargé en SRAM : ℓ = 1 + 2 = 3', t2: 'u = 1 × 10 + 2 × 20 = 50 ; o provisoire = 50 / 3' },
  { bloc: 2, l: 10, u: 300, t1: 'Bloc 2 : on ajoute 3 + 4 à ℓ, 90 + 160 à u', t2: 'ℓ = 10, u = 300 : o = 300 / 10 = 30' },
  { bloc: 3, l: 10, u: 300, t1: 'Seule la sortie o = 30 retourne en HBM', t2: 'la matrice S n’a jamais été stockée en entier' },
];

export const etats: Record<string, Etat> = Object.fromEntries(
  ETAPES.map((_, k) => [['initial', 'bloc1', 'bloc2', 'fin'][k], { k }]),
);

const BLOCS = [
  { e: '1, 2', v: '10, 20' },
  { e: '3, 4', v: '30, 40' },
];

function gabarit() {
  return `
    <rect x="4" y="26" width="150" height="160" rx="6" class="svg-entree" fill-opacity="0.08" />
    <rect x="4" y="26" width="150" height="160" rx="6" fill="none" class="svg-trait-entree" stroke-width="1.5" />
    <text x="12" y="44" class="svg-texte" font-size="12" font-weight="700">HBM</text>
    <text x="146" y="44" text-anchor="end" class="svg-doux" font-size="10">grande, lente</text>
    <g data-hbm></g>
    <rect x="200" y="26" width="136" height="104" rx="6" class="svg-sortie" fill-opacity="0.12" />
    <rect x="200" y="26" width="136" height="104" rx="6" fill="none" class="svg-trait-sortie" stroke-width="1.5" />
    <text x="208" y="44" class="svg-texte" font-size="12" font-weight="700">SRAM</text>
    <text x="330" y="44" text-anchor="end" class="svg-doux" font-size="10">petite, rapide</text>
    <g data-sram></g>
    <g data-fleche></g>
    <text x="200" y="152" class="svg-texte" font-size="12" style="font-family: var(--police-code)" data-l></text>
    <text x="200" y="170" class="svg-texte" font-size="12" style="font-family: var(--police-code)" data-u></text>
    <text x="200" y="188" class="svg-texte" font-size="12" font-weight="700" style="font-family: var(--police-code)" data-o></text>
    <text x="4" y="224" class="svg-texte" font-size="12" font-weight="700" data-t1></text>
    <text x="4" y="244" class="svg-doux" font-size="11" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  // Mémoire lente : Q, les blocs de K et V, et soit la matrice S (classique), soit la sortie o.
  let hbm = `<text x="14" y="66" class="svg-texte" font-size="11">q (une requête)</text>`;
  BLOCS.forEach((b, i) => {
    const y = 76 + i * 30, actif = et.bloc === i + 1;
    hbm += `<rect x="12" y="${y}" width="134" height="24" rx="4" class="svg-parametre" fill-opacity="${actif ? 0.35 : 0.12}" />
      <text x="18" y="${y + 16}" class="svg-texte" font-size="10.5">K, V bloc ${i + 1} : e^s ${b.e}</text>`;
  });
  if (k === 0) {
    let grille = '';
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) grille += `<rect x="${14 + j * 12}" y="${142 + i * 10}" width="11" height="9" class="svg-perte" fill-opacity="0.55" />`;
    hbm += grille + `<text x="68" y="166" class="svg-texte" font-size="10.5">S : n × n</text>`;
  } else if (k === 3) {
    hbm += `<rect x="12" y="144" width="60" height="24" rx="4" class="svg-sortie" fill-opacity="0.45" />
      <text x="20" y="160" class="svg-texte" font-size="11" font-weight="700">o = 30</text>`;
  }
  q(svg, '[data-hbm]').innerHTML = hbm;
  // Mémoire rapide : le bloc en cours.
  const b = BLOCS[et.bloc - 1];
  q(svg, '[data-sram]').innerHTML = b
    ? `<text x="208" y="70" class="svg-texte" font-size="11">bloc ${et.bloc}</text>
       <text x="208" y="90" class="svg-texte" font-size="11" style="font-family: var(--police-code)">e^s : ${b.e}</text>
       <text x="208" y="108" class="svg-texte" font-size="11" style="font-family: var(--police-code)">v   : ${b.v}</text>`
    : `<text x="208" y="80" class="svg-doux" font-size="10.5">${k === 0 ? 'peu utilisée' : 'libérée'}</text>`;
  const g = q(svg, '[data-fleche]');
  if (b) fleche(g, 156, 88 + (et.bloc - 1) * 30, 198, 80, 'sortie', 2.5);
  else if (k === 3) fleche(g, 198, 122, 74, 156, 'sortie', 2.5);
  else g.innerHTML = '';
  texte(svg, '[data-l]', k ? `ℓ = ${et.l}` : '');
  texte(svg, '[data-u]', k ? `u = ${et.u}` : '');
  texte(svg, '[data-o]', k ? `o = u / ℓ = ${fr(et.u / et.l, 2)}` : '');
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. ${et.t2}.`);
}
