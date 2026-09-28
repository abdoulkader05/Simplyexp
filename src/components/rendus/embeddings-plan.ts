// Fiche « embeddings » : mots placés dans un plan (coordonnées inventées pour l'illustration).
// cos(chien, chiot) ≈ 0,992 ; cos(chien, roi) ≈ −0,838 ; roi − homme + femme = (4 ; 3,2), à 0,14 de reine.
import type { Etat } from '../animations/types';
import { svgDe, q, texte, repere, fleche } from '../animations/svg';

export const fiche = 'embeddings';
export const MOTS: Record<string, [number, number]> = {
  homme: [1, 1], femme: [1, 3], roi: [4, 1.2], reine: [4.1, 3.1],
  chat: [-3, -2], chien: [-2.2, -2.6], chiot: [-2, -3.1],
};
const R = repere(130, 122, 26);

export const etats: Record<string, Etat> = {
  initial: { k: 0 }, proches: { k: 1 }, direction: { k: 2 }, analogie: { k: 3 },
};

function gabarit() {
  return `${R.axes(118)}
    <g data-f1></g><g data-f2></g><g data-f3></g>
    <g data-points></g>
    <text x="4" y="236" class="svg-texte" font-size="13" font-weight="700" data-t1></text>
    <text x="4" y="255" class="svg-doux" font-size="11" data-t2></text>`;
}

const GROUPES = { animaux: ['chat', 'chien', 'chiot'], royaute: ['homme', 'femme', 'roi', 'reine'] };

export function dessiner(scene: HTMLElement, e: Etat) {
  const svg = svgDe(scene, 340, 262, gabarit);
  const k = Math.max(0, Math.min(3, Math.round(e.k)));
  const vif = (m: string) => (k === 1 ? GROUPES.animaux.includes(m) : k >= 2 ? GROUPES.royaute.includes(m) : true);
  let html = Object.entries(MOTS).map(([m, [x, y]]) => `
    <circle cx="${R.x(x)}" cy="${R.y(y)}" r="5" class="svg-entree" opacity="${vif(m) ? 1 : 0.25}" />
    <text x="${R.x(x) + 8}" y="${R.y(y) + 4}" class="svg-texte" font-size="12" opacity="${vif(m) ? 1 : 0.35}">${m}</text>`).join('');
  if (k === 3) {
    const [x, y] = [4, 3.2];
    html += `<circle cx="${R.x(x)}" cy="${R.y(y)}" r="9" fill="none" class="svg-trait-sortie" stroke-width="2.5" />
      <text x="${R.x(x) - 12}" y="${R.y(y) - 13}" text-anchor="end" class="svg-texte" font-size="11" font-weight="700">roi − homme + femme</text>`;
  }
  q(svg, '[data-points]').innerHTML = html;
  const [f1, f2, f3] = ['[data-f1]', '[data-f2]', '[data-f3]'].map((s) => q(svg, s));
  const vec = (g: Element, a: string, b: string, c: string) => fleche(g, R.x(MOTS[a][0]), R.y(MOTS[a][1]) - 6, R.x(MOTS[b][0]), R.y(MOTS[b][1]) + 7, c);
  if (k >= 2) { vec(f1, 'homme', 'femme', 'parametre'); vec(f2, 'roi', 'reine', 'parametre'); } else { f1.innerHTML = ''; f2.innerHTML = ''; }
  f3.innerHTML = '';
  const T = [
    ['chaque mot devient un point du plan', 'coordonnées inventées pour l’illustration'],
    ['chien, chiot et chat sont voisins', 'cos(chien, chiot) ≈ 0,99   cos(chien, roi) ≈ −0,84'],
    ['homme → femme et roi → reine : même flèche', 'une direction du plan code « masculin → féminin »'],
    ['roi − homme + femme = (4 ; 3,2)', 'le point le plus proche est reine, à 0,14'],
  ][k];
  texte(svg, '[data-t1]', T[0]);
  texte(svg, '[data-t2]', T[1]);
  scene.setAttribute('aria-label', `${T[0]}. ${T[1]}.`);
}
