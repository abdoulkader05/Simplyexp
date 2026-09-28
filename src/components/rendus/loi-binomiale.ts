// Fiche « variables-aleatoires » : X = nombre de clients qui paient par mobile money parmi n clients,
// chacun indépendamment avec la probabilité p. Loi de X : P(X = k) = C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ.
// Exemple : n = 4, p = 0,5 : 1/16, 4/16, 6/16, 4/16, 1/16.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'variables-aleatoires';
const NMAX = 20;

export function binomiale(n: number, p: number) {
  const r: number[] = [];
  let c = 1;
  for (let k = 0; k <= n; k++) {
    r.push(c * p ** k * (1 - p) ** (n - k));
    c = (c * (n - k)) / (k + 1);
  }
  return r;
}

export const etats: Record<string, Etat> = { initial: { n: 4, p: 0.5 } };

function gabarit() {
  return `
    <line x1="20" y1="190" x2="330" y2="190" class="svg-trait-doux" />
    ${Array.from({ length: NMAX + 1 }, (_, k) => `<rect data-b="${k}" rx="2" class="svg-sortie" />
      <text data-k="${k}" y="204" text-anchor="middle" class="svg-doux" font-size="9">${k}</text>
      <text data-v="${k}" text-anchor="middle" class="svg-texte" font-size="9"></text>`).join('')}
    <text x="20" y="18" class="svg-doux" font-size="10">P(X = k) : probabilité que k clients sur n paient par mobile money</text>
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="600" data-t1></text>
    <text x="4" y="252" class="svg-doux" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const n = Math.max(1, Math.min(NMAX, Math.round(e.n)));
  const loi = binomiale(n, e.p);
  const max = Math.max(...loi);
  const larg = 300 / (n + 1);
  for (let k = 0; k <= NMAX; k++) {
    const b = q(svg, `[data-b="${k}"]`), t = q(svg, `[data-k="${k}"]`), v = q(svg, `[data-v="${k}"]`);
    if (k > n) { b.setAttribute('height', '0'); t.textContent = ''; v.textContent = ''; continue; }
    const h = (loi[k] / Math.max(max, 0.05)) * 150;
    const x = 22 + k * larg;
    attrs(b, { x, width: Math.max(2, larg - 3), y: 190 - h, height: h });
    attrs(t, { x: x + (larg - 3) / 2 });
    t.textContent = n <= 12 || k % 2 === 0 ? String(k) : '';
    attrs(v, { x: x + (larg - 3) / 2, y: 186 - h });
    v.textContent = n <= 8 ? fr(loi[k], 3) : '';
  }
  const somme = loi.reduce((a, b) => a + b, 0);
  const mode = loi.indexOf(max);
  texte(svg, '[data-t1]', `n = ${n} clients, p = ${fr(e.p, 2)} ; valeur la plus probable : ${mode}`);
  texte(svg, '[data-t2]', `somme des probabilités : ${fr(somme, 3)}`);
  scene.setAttribute('aria-label', `Loi du nombre de paiements mobiles parmi ${n} clients avec p = ${fr(e.p, 2)} : valeur la plus probable ${mode}, de probabilité ${fr(max, 3)}.`);
}
