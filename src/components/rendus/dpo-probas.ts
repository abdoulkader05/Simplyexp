// Fiche « dpo » : la perte DPO sur une paire (préférée, rejetée), β = 0,1.
// Rapports π_θ / π_ref : (1 ; 1) → (2 ; 0,5) → (8 ; 0,25). Pertes 0,693 → 0,626 → 0,535.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte } from '../animations/svg';

export const fiche = 'dpo';

const BETA = 0.1;
const ETAPES = [
  { rw: 1, rl: 1, t1: 'Au départ, le modèle égale la référence', t2: 'les deux rapports valent 1 : perte ln 2 ≈ 0,693' },
  { rw: 2, rl: 0.5, t1: 'Un pas : la préférée monte, la rejetée baisse', t2: 'relativement au modèle de référence' },
  { rw: 8, rl: 0.25, t1: 'Plus d’écart, moins de perte', t2: 'mais la perte baisse de moins en moins vite' },
  { rw: 8, rl: 0.25, t1: 'La récompense implicite : β × ln(rapport)', t2: 'le modèle de langage sert lui-même de juge' },
];

export const etats: Record<string, Etat> = Object.fromEntries(ETAPES.map((_, i) => [['initial', 'pas1', 'pas2', 'implicite'][i], { k: i }]));

const sigma = (z: number) => 1 / (1 + Math.exp(-z));
const sub = (t: string) => `<tspan baseline-shift="sub" font-size="7.5">${t}</tspan>`;

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, () => `<g data-corps></g>
    <text x="4" y="226" class="svg-texte" font-size="12.5" font-weight="700" data-t1></text>
    <text x="4" y="245" class="svg-doux" font-size="11" data-t2></text>`);
  const k = Math.max(0, Math.min(ETAPES.length - 1, Math.round(e.k)));
  const et = ETAPES[k];
  const lw = Math.log(et.rw), ll = Math.log(et.rl);
  const z = BETA * (lw - ll);
  const perte = -Math.log(sigma(z));
  const implicite = k === 3;
  const X0 = 170, U = 40; // axe des ln(rapport), 40 px par unité
  const ligne = (y: number, nom: string, l: number, classe: string) => {
    const val = implicite ? BETA * l : l;
    const u = implicite ? U * 10 : U;
    const x = val >= 0 ? X0 : X0 + val * u;
    return `<text x="4" y="${y + 13}" class="svg-texte" font-size="11" font-weight="700">${nom}</text>
      <rect x="${x}" y="${y}" width="${Math.abs(val) * u}" height="18" rx="3" class="${classe}" fill-opacity="0.85" />
      <text x="336" y="${y + 13}" text-anchor="end" class="svg-texte" font-size="11" style="font-family: var(--police-code)">${fr(val, 2)}</text>`;
  };
  q(svg, '[data-corps]').innerHTML = `
    <text x="4" y="14" class="svg-doux" font-size="10">${implicite ? 'récompense implicite r̂ = β ln(π' + sub('θ') + ' / π' + sub('ref') + ')' : 'ln(π' + sub('θ') + ' / π' + sub('ref') + ') pour chaque réponse'}</text>
    <line x1="${X0}" y1="22" x2="${X0}" y2="100" class="svg-trait-doux" stroke-width="1" />
    ${ligne(30, 'préférée y' + sub('w'), lw, 'svg-parametre')}
    ${ligne(64, 'rejetée y' + sub('l'), ll, 'svg-perte')}
    <rect x="0" y="116" width="340" height="80" rx="5" class="svg-fond-sortie" />
    <text x="10" y="138" class="svg-texte" font-size="11" style="font-family: var(--police-code)">z = β (ln rapport${sub('w')} − ln rapport${sub('l')}) = ${fr(z, 3)}</text>
    <text x="10" y="160" class="svg-texte" font-size="11" style="font-family: var(--police-code)">σ(z) = ${fr(sigma(z), 3)}</text>
    <text x="10" y="184" class="svg-texte" font-size="12.5" font-weight="700" style="font-family: var(--police-code)">perte = − ln σ(z) = ${fr(perte, 3)}</text>`;
  texte(svg, '[data-t1]', et.t1);
  texte(svg, '[data-t2]', et.t2);
  scene.setAttribute('aria-label', `${et.t1}. Rapports ${fr(et.rw, 2)} et ${fr(et.rl, 2)}, perte ${fr(perte, 3)}.`);
}
