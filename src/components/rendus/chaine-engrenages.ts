// Fiche « regle-chaine » : x → u = g(x) = 3x + 1 → y = f(u) = u².
// Un petit écart Δx devient Δu ≈ 3 Δx, puis Δy ≈ 2u Δu : les taux se multiplient.
// Exemple : x = 1, u = 4, y = 16 ; dy/dx = 2u × 3 = 24.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'regle-chaine';
const g = (x: number) => 3 * x + 1;
const f = (u: number) => u * u;
const AXES = [
  { nom: 'x', y: 40, min: -1, max: 2, classe: 'entree' },
  { nom: 'u = 3x + 1', y: 100, min: -2, max: 7, classe: 'parametre' },
  { nom: 'y = u²', y: 160, min: 0, max: 50, classe: 'sortie' },
];
const px = (v: number, a: (typeof AXES)[number]) => 20 + ((v - a.min) / (a.max - a.min)) * 300;

export const etats: Record<string, Etat> = { initial: { x: 1, dx: 0.1 } };

function gabarit() {
  return AXES.map((a, i) => `
    <text x="20" y="${a.y - 12}" class="svg-${a.classe}" font-size="12" font-weight="600">${a.nom}</text>
    <line x1="20" y1="${a.y}" x2="320" y2="${a.y}" class="svg-trait-doux" />
    <rect data-i="${i}" y="${a.y - 5}" height="10" rx="2" class="svg-fond-sortie" />
    <circle data-p="${i}" cy="${a.y}" r="5" class="svg-${a.classe}" />
    <text data-v="${i}" y="${a.y + 20}" text-anchor="middle" class="svg-texte" font-size="11"></text>`).join('') + `
    <text x="4" y="206" class="svg-texte" font-size="12" data-t0></text>
    <text x="4" y="232" class="svg-texte" font-size="12" data-t1></text>
    <text x="4" y="252" class="svg-sortie" font-size="13" font-weight="600" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const x = e.x, dx = e.dx, u = g(x), y = f(u);
  const du = g(x + dx) - u, dy = f(g(x + dx)) - y;
  const vals = [[x, x + dx], [u, u + du], [y, y + dy]];
  AXES.forEach((a, i) => {
    const [v0, v1] = vals[i];
    const x0 = px(Math.min(v0, v1), a), x1 = px(Math.max(v0, v1), a);
    attrs(q(svg, `[data-i="${i}"]`), { x: x0, width: Math.max(1, x1 - x0) });
    attrs(q(svg, `[data-p="${i}"]`), { cx: px(v0, a) });
    const t = q(svg, `[data-v="${i}"]`);
    attrs(t, { x: px(v0, a) });
    t.textContent = fr(v0, 2, 0);
  });
  texte(svg, '[data-t0]', `Δx = ${fr(dx, 2)} ; Δu = ${fr(du, 3)} ; Δy = ${fr(dy, 3)}`);
  texte(svg, '[data-t1]', `Δy / Δx = ${fr(dy / dx, 3)} (taux moyen)`);
  texte(svg, '[data-t2]', `dy/dx = f′(u) × g′(x) = ${fr(2 * u, 2, 0)} × 3 = ${fr(6 * u, 2, 0)}`);
  scene.setAttribute('aria-label', `En x = ${fr(x, 2, 0)}, u = ${fr(u, 2, 0)} et y = ${fr(y, 2, 0)}. La règle de la chaîne donne dy/dx = ${fr(6 * u, 2, 0)}.`);
}
