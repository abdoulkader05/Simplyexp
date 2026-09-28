// Simulation de la fiche « attention » : on oriente et on allonge l'état du décodeur s,
// et on voit les poids α et le contexte c réagir. Mêmes vecteurs que l'exemple chiffré.
// s = λ·√2·(cos θ ; sin θ) : pour θ = 45° et λ = 1, on retrouve s = (1 ; 1).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';

const MOTS = ['Awa', 'paie', 'Koffi'];
const H = [[1, -1], [1, 1], [-1, 1]];

const NS = 'http://www.w3.org/2000/svg';
const CX = 88, CY = 122, U = 28; // origine du plan et pixels par unité
const px = (v: number[]) => [CX + v[0] * U, CY - v[1] * U];
const vec = (v: number[]) => `(${fr(v[0])} ; ${fr(v[1])})`;

function fleche(g: SVGGElement, v: number[], classe: string, epaisseur: number) {
  const [x, y] = px(v);
  const long = Math.hypot(x - CX, y - CY);
  g.innerHTML = '';
  if (long < 2) return;
  const ux = (x - CX) / long, uy = (y - CY) / long;
  const t = 8; // taille de la pointe
  const bx = x - ux * t, by = y - uy * t;
  const ligne = document.createElementNS(NS, 'line');
  ligne.setAttribute('x1', String(CX)); ligne.setAttribute('y1', String(CY));
  ligne.setAttribute('x2', String(bx)); ligne.setAttribute('y2', String(by));
  ligne.setAttribute('class', `svg-trait-${classe}`);
  ligne.setAttribute('stroke-width', String(epaisseur));
  const pointe = document.createElementNS(NS, 'polygon');
  pointe.setAttribute('points', `${x},${y} ${bx - uy * t * 0.55},${by + ux * t * 0.55} ${bx + uy * t * 0.55},${by - ux * t * 0.55}`);
  pointe.setAttribute('class', `svg-${classe}`);
  g.append(ligne, pointe);
}

function construire(scene: HTMLElement) {
  const axes = `
    <line x1="${CX - 84}" y1="${CY}" x2="${CX + 84}" y2="${CY}" class="svg-trait" />
    <line x1="${CX}" y1="${CY - 84}" x2="${CX}" y2="${CY + 84}" class="svg-trait" />`;
  const etiquettes = H.map((h, i) => {
    const [x, y] = px([h[0] * 1.32, h[1] * 1.32]);
    return `<text x="${x}" y="${y + 4}" text-anchor="middle" class="svg-entree" font-size="12">${MOTS[i]}</text>`;
  }).join('');
  const barres = MOTS.map((mot, i) => {
    const y = 58 + i * 50;
    return `
      <text x="190" y="${y}" class="svg-texte" font-size="14">${mot}</text>
      <text x="336" y="${y}" text-anchor="end" class="svg-texte" font-size="14" data-a="${i}"></text>
      <rect x="190" y="${y + 7}" width="146" height="14" rx="3" fill="none" class="svg-trait" />
      <rect x="190" y="${y + 7}" width="0" height="14" rx="3" class="svg-sortie" data-barre="${i}" />`;
  }).join('');
  scene.innerHTML = `
    <svg viewBox="0 0 340 262" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      ${axes}
      <g data-h0 opacity=".5"></g><g data-h1 opacity=".5"></g><g data-h2 opacity=".5"></g>
      ${etiquettes}
      <g data-s></g>
      <g data-c></g>
      <text class="svg-entree" font-size="13" font-weight="600" data-lab-s>s</text>
      <text class="svg-texte" font-size="13" font-weight="600" data-lab-c>c</text>
      <text x="190" y="24" class="svg-doux" font-size="11">poids α</text>
      ${barres}
      <text x="4" y="228" class="svg-entree" font-size="14" font-weight="600" data-texte-s></text>
      <rect x="0" y="236" width="178" height="22" rx="3" class="svg-fond-sortie" />
      <text x="4" y="252" class="svg-texte" font-size="14" font-weight="600" data-texte-c></text>
      <text x="190" y="228" class="svg-doux" font-size="11" data-texte-e></text>
    </svg>`;
  H.forEach((h, i) => fleche(scene.querySelector(`[data-h${i}]`)!, h, 'entree', 2));
}

export function dessiner(scene: HTMLElement, p: Etat) {
  if (!scene.querySelector('svg')) construire(scene);
  const theta = (p.theta * Math.PI) / 180;
  const s = [p.lambda * Math.SQRT2 * Math.cos(theta), p.lambda * Math.SQRT2 * Math.sin(theta)];
  const e = H.map((h) => s[0] * h[0] + s[1] * h[1]);
  const m = Math.max(...e); // stabilité numérique, sans changer le résultat
  const z = e.reduce((t, x) => t + Math.exp(x - m), 0);
  const a = e.map((x) => Math.exp(x - m) / z);
  const c = [0, 1].map((k) => a.reduce((t, aj, j) => t + aj * H[j][k], 0));

  fleche(scene.querySelector('[data-s]')!, s, 'entree', 3.5);
  fleche(scene.querySelector('[data-c]')!, c, 'sortie', 4);
  // Étiquettes au bout des flèches, décalées de part et d'autre pour ne pas se chevaucher.
  const etiqueter = (sel: string, v: number[], decalage: number, part: number) => {
    const t = scene.querySelector<SVGTextElement>(sel)!;
    const n = Math.hypot(v[0], v[1]);
    t.style.opacity = n < 0.08 ? '0' : '1';
    if (n < 0.08) return;
    const [x, y] = px([v[0] * part, v[1] * part]);
    t.setAttribute('x', String(x - (v[1] / n) * decalage - 4));
    t.setAttribute('y', String(y - (v[0] / n) * decalage + 4));
  };
  etiqueter('[data-lab-s]', s, 12, 0.5); // au milieu de la flèche s
  etiqueter('[data-lab-c]', c, -12, 0.8); // de l'autre côté, près du bout de c
  scene.querySelectorAll('[data-barre]').forEach((r, i) => r.setAttribute('width', String(146 * a[i])));
  scene.querySelectorAll('[data-a]').forEach((t, i) => (t.textContent = fr(a[i])));
  scene.querySelector('[data-texte-s]')!.textContent = `s = ${vec(s)}`;
  scene.querySelector('[data-texte-c]')!.textContent = `c = ${vec(c)}`;
  scene.querySelector('[data-texte-e]')!.textContent = `scores : ${e.map((x) => fr(x, 1)).join(' ; ')}`;
  const max = a.indexOf(Math.max(...a));
  scene.setAttribute(
    'aria-label',
    `s = ${vec(s)}. Poids : Awa ${fr(a[0])}, paie ${fr(a[1])}, Koffi ${fr(a[2])}. ` +
      `Le mot le plus regardé est « ${MOTS[max]} ». Contexte c = ${vec(c)}.`,
  );
}
