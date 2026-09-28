// Fiche « vecteurs » : somme de deux vecteurs et multiplication par un nombre.
// Exemple de la fiche : u = (3 ; 1), v = (1 ; 2), u + v = (4 ; 3).
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, fleche, texte, repere } from '../animations/svg';

export const fiche = 'vecteurs';
const U = [3, 1];
const R = repere(80, 190, 22);

export const etats: Record<string, Etat> = {
  initial: { vx: 1, vy: 2, k: 1 },
};

function gabarit() {
  let grille = '';
  for (let i = -3; i <= 10; i++) grille += `<line x1="${R.x(i)}" y1="${R.y(-3)}" x2="${R.x(i)}" y2="${R.y(8)}" class="svg-trait" stroke-opacity=".5" />`;
  for (let j = -3; j <= 8; j++) grille += `<line x1="${R.x(-3)}" y1="${R.y(j)}" x2="${R.x(10)}" y2="${R.y(j)}" class="svg-trait" stroke-opacity=".5" />`;
  return `${grille}
    <line x1="${R.x(-3)}" y1="${R.y(0)}" x2="${R.x(10)}" y2="${R.y(0)}" class="svg-trait-doux" stroke-opacity=".6" />
    <line x1="${R.x(0)}" y1="${R.y(-3)}" x2="${R.x(0)}" y2="${R.y(8)}" class="svg-trait-doux" stroke-opacity=".6" />
    <g data-v2 opacity=".45"></g><g data-u2 opacity=".45"></g>
    <g data-u></g><g data-v></g><g data-somme></g>
    <text class="svg-entree" font-size="14" font-weight="600" data-lu>u</text>
    <text class="svg-entree" font-size="14" font-weight="600" data-lv>v</text>
    <text class="svg-texte" font-size="14" font-weight="600" data-ls></text>
    <text x="332" y="24" text-anchor="end" class="svg-entree" font-size="13" data-tu></text>
    <text x="332" y="44" text-anchor="end" class="svg-entree" font-size="13" data-tv></text>
    <text x="332" y="64" text-anchor="end" class="svg-texte" font-size="13" font-weight="600" data-ts></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  // Sans curseur pour v, on garde v = (1 ; 2) de l'exemple.
  const k = e.k ?? 1;
  const v = [(e.vx ?? 1) * k, (e.vy ?? 2) * k];
  const s = [U[0] + v[0], U[1] + v[1]];
  fleche(q(svg, '[data-u]'), R.x(0), R.y(0), R.x(U[0]), R.y(U[1]), 'entree', 3);
  fleche(q(svg, '[data-v]'), R.x(0), R.y(0), R.x(v[0]), R.y(v[1]), 'entree', 3);
  fleche(q(svg, '[data-v2]'), R.x(U[0]), R.y(U[1]), R.x(s[0]), R.y(s[1]), 'entree', 2);
  fleche(q(svg, '[data-u2]'), R.x(v[0]), R.y(v[1]), R.x(s[0]), R.y(s[1]), 'entree', 2);
  fleche(q(svg, '[data-somme]'), R.x(0), R.y(0), R.x(s[0]), R.y(s[1]), 'sortie', 4);
  const place = (sel: string, p: number[], dx: number, dy: number) => {
    const t = q(svg, sel);
    t.setAttribute('x', String(R.x(p[0]) + dx));
    t.setAttribute('y', String(R.y(p[1]) + dy));
  };
  place('[data-lu]', [U[0] / 2, U[1] / 2], 2, 16);
  place('[data-lv]', [v[0] / 2, v[1] / 2], -14, -4);
  place('[data-ls]', s, 6, -6);
  const c = (a: number[]) => `(${fr(a[0], 1, 0)} ; ${fr(a[1], 1, 0)})`;
  const nom = k === 1 ? 'v' : `${fr(k, 1, 0)} v`;
  texte(svg, '[data-ls]', `u + ${nom}`);
  texte(svg, '[data-lv]', nom);
  texte(svg, '[data-tu]', `u = ${c(U)}`);
  texte(svg, '[data-tv]', `${nom} = ${c(v)}`);
  texte(svg, '[data-ts]', `u + ${nom} = ${c(s)}`);
  scene.setAttribute('aria-label', `u = ${c(U)}, ${nom} = ${c(v)}, et leur somme u + ${nom} = ${c(s)}, dessinée en doré.`);
}
