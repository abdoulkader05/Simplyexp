// Rendu signature de la fiche « attention » : scores, softmax, somme pondérée.
// Les nombres sont exactement ceux de l'exemple chiffré de la fiche :
//   s = (1 ; 1), h1 = (1 ; −1) « Awa », h2 = (1 ; 1) « paie », h3 = (−1 ; 1) « Koffi »
//   scores e = (0 ; 2 ; 0), poids α ≈ (0,11 ; 0,79 ; 0,11), contexte c ≈ (0,79 ; 0,79)
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';

export const fiche = 'attention';

const MOTS = ['Awa', 'paie', 'Koffi'];
const H = [[1, -1], [1, 1], [-1, 1]];
const S = [1, 1];

const E = H.map((h) => S[0] * h[0] + S[1] * h[1]);
const Z = E.reduce((t, e) => t + Math.exp(e), 0);
const A = E.map((e) => Math.exp(e) / Z);

export const etats: Record<string, Etat> = {
  initial: { voirScores: 0, e0: 0, e1: 0, e2: 0, a0: 0, a1: 0, a2: 0, voirSortie: 0 },
  scores: { voirScores: 1, e0: E[0], e1: E[1], e2: E[2], a0: 0, a1: 0, a2: 0, voirSortie: 0 },
  softmax: { voirScores: 1, e0: E[0], e1: E[1], e2: E[2], a0: A[0], a1: A[1], a2: A[2], voirSortie: 0 },
  sortie: { voirScores: 1, e0: E[0], e1: E[1], e2: E[2], a0: A[0], a1: A[1], a2: A[2], voirSortie: 1 },
};

const NS = 'http://www.w3.org/2000/svg';
const vec = (v: number[]) => `(${fr(v[0], 2, 0)} ; ${fr(v[1], 2, 0)})`;
const BARRE = 70;

function construire(scene: HTMLElement) {
  const lignes = MOTS.map((mot, i) => {
    const y = 110 + i * 42;
    return `
      <text x="12" y="${y}" class="svg-texte" font-size="15">${mot}</text>
      <text x="74" y="${y}" class="svg-entree" font-size="14">${vec(H[i])}</text>
      <text x="170" y="${y}" class="svg-texte" font-size="14" data-e="${i}"></text>
      <rect x="220" y="${y - 13}" width="${BARRE}" height="17" rx="3" fill="none" class="svg-trait" />
      <rect x="220" y="${y - 13}" width="0" height="17" rx="3" class="svg-sortie" data-barre="${i}" />
      <text x="336" y="${y}" text-anchor="end" class="svg-texte" font-size="14" data-a="${i}"></text>`;
  }).join('');
  scene.innerHTML = `
    <svg viewBox="0 0 340 262" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <text x="12" y="22" class="svg-doux" font-size="12">Le décodeur s’apprête à écrire « pays ».</text>
      <text x="12" y="46" class="svg-entree" font-size="15" font-weight="600">s = ${vec(S)}</text>
      <text x="12" y="80" class="svg-doux" font-size="11">mot</text>
      <text x="74" y="80" class="svg-doux" font-size="11">vecteur h</text>
      <text x="170" y="80" class="svg-doux" font-size="11" data-titre-scores>score e</text>
      <text x="220" y="80" class="svg-doux" font-size="11" data-titre-poids>poids α</text>
      <line x1="12" y1="88" x2="336" y2="88" class="svg-trait" />
      ${lignes}
      <g data-sortie>
        <line x1="12" y1="212" x2="336" y2="212" class="svg-trait" />
        <text x="12" y="233" class="svg-texte" font-size="13">c = 0,11 h₁ + 0,79 h₂ + 0,11 h₃</text>
        <rect x="8" y="240" width="150" height="21" rx="3" class="svg-fond-sortie" />
        <text x="12" y="256" class="svg-texte" font-size="14" font-weight="600" data-c></text>
      </g>
    </svg>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  if (!scene.querySelector('svg')) construire(scene);
  const svg = scene.querySelector('svg')!;
  const scores = [e.e0, e.e1, e.e2];
  const poids = [e.a0, e.a1, e.a2];

  svg.querySelectorAll<SVGTextElement>('[data-e]').forEach((t, i) => {
    t.textContent = fr(scores[i], 1, 0);
    t.style.opacity = String(e.voirScores);
  });
  (svg.querySelector('[data-titre-scores]') as SVGElement).style.opacity = String(Math.max(0.35, e.voirScores));
  const voirPoids = Math.min(1, (e.a0 + e.a1 + e.a2) * 4);
  (svg.querySelector('[data-titre-poids]') as SVGElement).style.opacity = String(Math.max(0.35, voirPoids));
  svg.querySelectorAll<SVGRectElement>('[data-barre]').forEach((r, i) => r.setAttribute('width', String(BARRE * poids[i])));
  svg.querySelectorAll<SVGTextElement>('[data-a]').forEach((t, i) => {
    t.textContent = fr(poids[i], 2);
    t.style.opacity = String(voirPoids);
  });
  const c = [0, 1].map((k) => poids.reduce((t, a, j) => t + a * H[j][k], 0));
  (svg.querySelector('[data-c]') as SVGTextElement).textContent = `c = ${vec([c[0], c[1]])}`;
  (svg.querySelector('[data-sortie]') as SVGGElement).style.opacity = String(e.voirSortie);

  const pct = poids.map((a) => fr(a, 2));
  scene.setAttribute(
    'aria-label',
    e.voirSortie > 0.5
      ? `Vecteur de contexte c = ${vec(c)} : il ressemble surtout au vecteur de « paie ».`
      : voirPoids > 0.5
        ? `Poids d’attention après softmax : Awa ${pct[0]}, paie ${pct[1]}, Koffi ${pct[2]}.`
        : e.voirScores > 0.5
          ? `Scores s·h : Awa ${fr(scores[0], 1, 0)}, paie ${fr(scores[1], 1, 0)}, Koffi ${fr(scores[2], 1, 0)}.`
          : 'Trois mots source, Awa, paie et Koffi, chacun représenté par un vecteur à deux coordonnées, et l’état du décodeur s = (1 ; 1).',
  );
}
