// Fiche « loi-categorielle » : tirer le mot qui suit « je vais au » selon une loi catégorielle.
// Probabilités : marché 0,40 ; travail 0,25 ; lit 0,15 ; champ 0,10 ; autre 0,10.
// Un nombre u uniforme entre 0 et 1 tombe dans un des segments : c'est le mot tiré.
import type { Etat } from '../animations/types';
import { fr } from '../animations/format';
import { svgDe, q, texte, attrs } from '../animations/svg';

export const fiche = 'loi-categorielle';
export const MOTS = [['marché', 0.4], ['travail', 0.25], ['lit', 0.15], ['champ', 0.1], ['autre', 0.1]] as const;
const X0 = 20, L = 300;

export const etats: Record<string, Etat> = { initial: { u: 0.52 } };

function gabarit() {
  let cumul = 0;
  const segs = MOTS.map(([m, p], i) => {
    const x = X0 + cumul * L, w = p * L;
    cumul += p;
    return `
      <rect data-s="${i}" x="${x}" y="130" width="${w - 2}" height="34" rx="3" class="svg-entree" />
      <text x="${x + w / 2}" y="151" text-anchor="middle" class="svg-texte" font-size="11" font-weight="600" data-n="${i}">${m}</text>
      <rect data-b="${i}" x="${X0 + i * 62}" y="${110 - p * 150}" width="40" height="${p * 150}" rx="3" class="svg-entree" opacity=".85" />
      <text x="${X0 + i * 62 + 20}" y="${104 - p * 150}" text-anchor="middle" class="svg-texte" font-size="11">${fr(p, 2)}</text>
      <text x="${X0 + i * 62 + 20}" y="122" text-anchor="middle" class="svg-doux" font-size="10">${m}</text>`;
  }).join('');
  return `
    <text x="${X0}" y="16" class="svg-doux" font-size="10">P(mot | « je vais au ») : hauteur des barres = longueur des segments</text>
    ${segs}
    <line x1="${X0}" y1="176" x2="${X0 + L}" y2="176" class="svg-trait-doux" />
    <text x="${X0}" y="190" class="svg-doux" font-size="10">0</text><text x="${X0 + L}" y="190" text-anchor="end" class="svg-doux" font-size="10">1</text>
    <polygon data-u class="svg-perte" />
    <text x="4" y="232" class="svg-texte" font-size="13" data-t1></text>
    <text x="4" y="252" class="svg-texte" font-size="14" font-weight="700" data-t2></text>`;
}

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const u = Math.max(0, Math.min(0.9999, e.u));
  let cumul = 0, choisi = 0;
  MOTS.forEach(([, p], i) => { if (u >= cumul && u < cumul + p) choisi = i; cumul += p; });
  MOTS.forEach((_, i) => {
    q(svg, `[data-s="${i}"]`).setAttribute('class', i === choisi ? 'svg-sortie' : 'svg-entree');
    q(svg, `[data-s="${i}"]`).style.opacity = i === choisi ? '1' : '0.3';
    q(svg, `[data-b="${i}"]`).setAttribute('class', i === choisi ? 'svg-sortie' : 'svg-entree');
  });
  const x = X0 + u * L;
  attrs(q(svg, '[data-u]'), { points: `${x},170 ${x - 6},182 ${x + 6},182` });
  texte(svg, '[data-t1]', `nombre tiré au hasard entre 0 et 1 : u = ${fr(u, 2)}`);
  texte(svg, '[data-t2]', `mot choisi : « ${MOTS[choisi][0]} »`);
  scene.setAttribute('aria-label', `u = ${fr(u, 2)} tombe dans le segment du mot ${MOTS[choisi][0]}, de probabilité ${fr(MOTS[choisi][1], 2)}.`);
}
