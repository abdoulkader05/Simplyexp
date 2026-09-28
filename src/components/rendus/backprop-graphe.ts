// Fiche « backpropagation » : x → z = w₁x → h = ReLU(z) → y = w₂h → L = ½(y − t)².
// x = 2, w₁ = 0,5, w₂ = 3, t = 1 : z = 1, h = 1, y = 3, L = 2.
// Gradients : ∂L/∂y = 2, ∂L/∂w₂ = 2, ∂L/∂h = 6, ∂L/∂z = 6, ∂L/∂w₁ = 12.
import type { Etat } from '../animations/types';
import { svgDe, q, texte } from '../animations/svg';
import { fr } from '../animations/format';

export const fiche = 'backpropagation';
const NOEUDS = [
  { nom: 'x', val: '2', grad: '' },
  { nom: 'z', val: '1', grad: '∂L/∂z = 6' },
  { nom: 'h', val: '1', grad: '∂L/∂h = 6' },
  { nom: 'y', val: '3', grad: '∂L/∂y = 2' },
  { nom: 'L', val: '2', grad: '' },
];
const OPS = ['× w₁', 'ReLU', '× w₂', '½(y − 1)²'];
const X0 = 26, DX = 72, Y0 = 110;

// avant : 0 → 1 (valeurs allumées une à une) ; arriere : 0 → 4 (gradients de droite à gauche).
export const etats: Record<string, Etat> = {
  initial: { avant: 0, arriere: 0 }, avant: { avant: 1, arriere: 0 },
  arriere1: { avant: 1, arriere: 1 }, arriere2: { avant: 1, arriere: 2.5 }, arriere3: { avant: 1, arriere: 4 },
};

function gabarit() {
  const n = NOEUDS.map((m, i) => `
    <circle cx="${X0 + i * DX}" cy="${Y0}" r="17" class="svg-fond-sortie" data-rond="${i}" />
    <text x="${X0 + i * DX}" y="${Y0 + 5}" text-anchor="middle" class="svg-texte" font-size="15" font-weight="600">${m.nom}</text>
    <text data-v="${i}" x="${X0 + i * DX}" y="${Y0 - 26}" text-anchor="middle" class="svg-entree" font-size="13" font-weight="600">${m.val}</text>
    <text data-g="${i}" x="${X0 + i * DX}" y="${Y0 + 40}" text-anchor="middle" class="svg-perte" font-size="11" font-weight="600">${m.grad}</text>`).join('');
  const a = OPS.map((o, i) => `
    <line x1="${X0 + i * DX + 19}" y1="${Y0}" x2="${X0 + (i + 1) * DX - 21}" y2="${Y0}" class="svg-trait-doux" stroke-width="1.5" />
    <polygon points="${X0 + (i + 1) * DX - 19},${Y0} ${X0 + (i + 1) * DX - 26},${Y0 - 4} ${X0 + (i + 1) * DX - 26},${Y0 + 4}" class="svg-doux" />
    <text x="${X0 + i * DX + DX / 2}" y="${Y0 - 8}" text-anchor="middle" class="svg-doux" font-size="10">${o}</text>`).join('');
  return `
    ${a}${n}
    <text x="${X0 + 0.5 * DX}" y="${Y0 - 50}" text-anchor="middle" class="svg-parametre" font-size="12" font-weight="600">w₁ = 0,5</text>
    <text x="${X0 + 2.5 * DX}" y="${Y0 - 50}" text-anchor="middle" class="svg-parametre" font-size="12" font-weight="600">w₂ = 3</text>
    <text data-gw1 x="${X0 + 0.5 * DX}" y="${Y0 + 64}" text-anchor="middle" class="svg-perte" font-size="12" font-weight="600">∂L/∂w₁ = 12</text>
    <text data-gw2 x="${X0 + 2.5 * DX}" y="${Y0 + 64}" text-anchor="middle" class="svg-perte" font-size="12" font-weight="600">∂L/∂w₂ = 2</text>
    <text x="4" y="16" class="svg-doux" font-size="10">bleu : valeurs (passe avant) ; rouge : gradients (passe arrière)</text>
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  if (e.w1 !== undefined) return reglable(scene, svg, e.w1, e.w2);
  NOEUDS.forEach((_, i) => {
    q(svg, `[data-v="${i}"]`).style.opacity = String(Math.max(0, Math.min(1, e.avant * 5 - i)));
    // Gradients allumés de droite à gauche : y (3) d'abord, puis h (2), puis z (1).
    const rang = 3 - i;
    q(svg, `[data-g="${i}"]`).style.opacity = String(Math.max(0, Math.min(1, e.arriere - rang)));
  });
  q(svg, '[data-gw2]').style.opacity = String(Math.max(0, Math.min(1, e.arriere - 1)));
  q(svg, '[data-gw1]').style.opacity = String(Math.max(0, Math.min(1, e.arriere - 3)));
  const etapes = [
    ['Le graphe de calcul', 'Chaque nœud est une valeur, chaque flèche une opération.'],
    ['Passe avant', 'On calcule de gauche à droite : z = 1, h = 1, y = 3, L = 2.'],
    ['Passe arrière : la sortie', '∂L/∂y = y − t = 3 − 1 = 2.'],
    ['Passe arrière : la couche de sortie', '∂L/∂w₂ = 2 × h = 2 ; ∂L/∂h = 2 × w₂ = 6.'],
    ['Passe arrière : la première couche', 'ReLU laisse passer (z > 0) : ∂L/∂w₁ = 6 × x = 12.'],
  ];
  const k = e.arriere >= 3.5 ? 4 : e.arriere >= 1.5 ? 3 : e.arriere >= 0.5 ? 2 : e.avant >= 0.5 ? 1 : 0;
  (q(svg, '[data-t1]') as SVGTextElement).textContent = etapes[k][0];
  (q(svg, '[data-t2]') as SVGTextElement).textContent = etapes[k][1];
  scene.setAttribute('aria-label', `${etapes[k][0]}. ${etapes[k][1]}`);
}

/** Mode manipulation : les curseurs fixent w₁ et w₂ ; x = 2 et t = 1 restent fixes. */
function reglable(scene: HTMLElement, svg: SVGSVGElement, w1: number, w2: number) {
  const x = 2, t = 1;
  const z = w1 * x, h = Math.max(0, z), y = w2 * h, L = 0.5 * (y - t) ** 2;
  const gy = y - t, gw2 = gy * h, gh = gy * w2, gz = z > 0 ? gh : 0, gw1 = gz * x;
  const vals = [x, z, h, y, L], grads = ['', `∂L/∂z = ${fr(gz, 2, 0)}`, `∂L/∂h = ${fr(gh, 2, 0)}`, `∂L/∂y = ${fr(gy, 2, 0)}`, ''];
  vals.forEach((v, i) => { texte(svg, `[data-v="${i}"]`, fr(v, 2, 0)); q(svg, `[data-v="${i}"]`).style.opacity = '1'; });
  grads.forEach((g, i) => { texte(svg, `[data-g="${i}"]`, g); q(svg, `[data-g="${i}"]`).style.opacity = '1'; });
  texte(svg, '[data-gw1]', `∂L/∂w₁ = ${fr(gw1, 2, 0)}`);
  texte(svg, '[data-gw2]', `∂L/∂w₂ = ${fr(gw2, 2, 0)}`);
  q(svg, '[data-gw1]').style.opacity = '1'; q(svg, '[data-gw2]').style.opacity = '1';
  const pw = [...svg.querySelectorAll<SVGTextElement>('text.svg-parametre')];
  if (pw[0]) pw[0].textContent = `w₁ = ${fr(w1, 2, 0)}`;
  if (pw[1]) pw[1].textContent = `w₂ = ${fr(w2, 2, 0)}`;
  texte(svg, '[data-t1]', z > 0 ? 'ReLU active : le gradient passe' : 'ReLU éteinte : le gradient s’arrête en z');
  texte(svg, '[data-t2]', `perte L = ${fr(L, 3, 0)} ; pas suivant : w₁ − η × ${fr(gw1, 2, 0)}`);
  scene.setAttribute('aria-label', `w₁ = ${fr(w1, 2, 0)}, w₂ = ${fr(w2, 2, 0)} : perte ${fr(L, 3, 0)}, gradient de w₁ ${fr(gw1, 2, 0)}, gradient de w₂ ${fr(gw2, 2, 0)}.`);
}