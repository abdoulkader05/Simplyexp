// Fiche « esperance-variance » : ventes journalières (en milliers de F) valant m − d, m ou m + d
// avec les probabilités 0,25 ; 0,5 ; 0,25. Espérance m (point d'équilibre), variance d²/2.
// Exemple : m = 10, d = 4 : valeurs 6, 10, 14 ; E = 10 ; Var = 8 ; écart type ≈ 2,83.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'esperance-variance';
const P = [0.25, 0.5, 0.25];
const px = (v: number) => 20 + (v / 20) * 300;

export const etats: Record<string, Etat> = { initial: { m: 10, d: 4 } };

function gabarit() {
  return `
    <line x1="${px(0)}" y1="150" x2="${px(20)}" y2="150" class="svg-trait-encre" stroke-width="2" />
    ${[0, 5, 10, 15, 20].map((v) => `<text x="${px(v)}" y="166" text-anchor="middle" class="svg-doux" font-size="10">${v}</text>`).join('')}
    ${P.map((p, i) => `<rect data-b="${i}" width="26" rx="3" class="svg-entree" opacity=".85" />
      <text data-t="${i}" text-anchor="middle" class="svg-texte" font-size="11"></text>`).join('')}
    <polygon data-pivot class="svg-sortie" />
    <line data-ecart y1="182" y2="182" class="svg-trait-perte" stroke-width="3" stroke-linecap="round" />
    <text x="20" y="18" class="svg-doux" font-size="10">ventes du jour (milliers de F) ; hauteur = probabilité</text>
    <text x="20" y="200" class="svg-perte" font-size="10">trait rouge : moyenne ± un écart type</text>
    <text x="4" y="232" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="12" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const v = [e.m - e.d, e.m, e.m + e.d];
  v.forEach((x, i) => {
    const h = P[i] * 220;
    attrs(q(svg, `[data-b="${i}"]`), { x: px(x) - 13, y: 150 - h, height: h });
    const t = q(svg, `[data-t="${i}"]`);
    attrs(t, { x: px(x), y: 145 - h });
    t.textContent = fr(P[i], 2);
  });
  const esp = v.reduce((s, x, i) => s + P[i] * x, 0);
  const vari = v.reduce((s, x, i) => s + P[i] * (x - esp) ** 2, 0), sd = Math.sqrt(vari);
  attrs(q(svg, '[data-pivot]'), { points: `${px(esp)},152 ${px(esp) - 9},168 ${px(esp) + 9},168` });
  attrs(q(svg, '[data-ecart]'), { x1: px(esp - sd), x2: px(esp + sd) });
  texte(svg, '[data-t1]', `espérance E[X] = ${fr(esp, 2, 0)} (le point d’équilibre)`);
  texte(svg, '[data-t2]', `variance ${fr(vari, 2, 0)} ; écart type ${fr(sd, 2)}`);
  scene.setAttribute('aria-label', `Ventes de ${fr(v[0], 1, 0)}, ${fr(v[1], 1, 0)} ou ${fr(v[2], 1, 0)} milliers de francs. Espérance ${fr(esp, 2, 0)}, variance ${fr(vari, 2, 0)}, écart type ${fr(sd, 2)}.`);
}
